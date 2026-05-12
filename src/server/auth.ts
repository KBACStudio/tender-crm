"use server";

import { OrganizationMemberRole, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const LOCAL_ADMIN_ID = "00000000-0000-0000-0000-000000000000";
const DEFAULT_ORGANIZATION_ID = "00000000-0000-0000-0000-000000000001";

export async function getCurrentAppUser() {
  const config = getSupabaseConfig();

  if (!config) {
    return prisma.appUser.upsert({
      where: { id: LOCAL_ADMIN_ID },
      create: { id: LOCAL_ADMIN_ID, role: UserRole.admin, email: "local-admin@example.invalid" },
      update: {}
    });
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const existing = await prisma.appUser.findUnique({ where: { id: user.id } });
  if (existing) return existing;

  const usersCount = await prisma.appUser.count();
  const role = usersCount === 0 ? UserRole.admin : UserRole.operator;

  return prisma.appUser.create({
    data: {
      id: user.id,
      email: user.email ?? null,
      role
    }
  });
}

async function ensureDefaultOrganization() {
  return prisma.organization.upsert({
    where: { id: DEFAULT_ORGANIZATION_ID },
    create: {
      id: DEFAULT_ORGANIZATION_ID,
      slug: "default",
      name: "Default",
      modules: []
    },
    update: {}
  });
}

function effectiveRoleFromMembership(role: OrganizationMemberRole): UserRole {
  if (role === OrganizationMemberRole.viewer) return UserRole.viewer;
  if (role === OrganizationMemberRole.member) return UserRole.operator;
  return UserRole.admin;
}

export async function getCurrentOrganization() {
  const user = await getCurrentAppUser();
  if (!user) return null;

  await ensureDefaultOrganization();

  const preferredOrgId = user.defaultOrganizationId ?? undefined;
  if (preferredOrgId) {
    const membership = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: preferredOrgId, userId: user.id } },
      include: { organization: true }
    });
    if (membership) return membership.organization;
  }

  const firstMembership = await prisma.organizationMember.findFirst({
    where: { userId: user.id },
    include: { organization: true },
    orderBy: { createdAt: "asc" }
  });
  if (firstMembership) {
    if (user.defaultOrganizationId !== firstMembership.organizationId) {
      await prisma.appUser.update({
        where: { id: user.id },
        data: { defaultOrganizationId: firstMembership.organizationId }
      });
    }
    return firstMembership.organization;
  }

  const role: OrganizationMemberRole = user.role === UserRole.admin ? OrganizationMemberRole.owner : OrganizationMemberRole.member;
  await prisma.organizationMember.create({
    data: {
      organizationId: DEFAULT_ORGANIZATION_ID,
      userId: user.id,
      role
    }
  });
  await prisma.appUser.update({ where: { id: user.id }, data: { defaultOrganizationId: DEFAULT_ORGANIZATION_ID } });
  return prisma.organization.findUnique({ where: { id: DEFAULT_ORGANIZATION_ID } });
}

export async function requireOrganization() {
  const user = await getCurrentAppUser();
  if (!user) throw new Error("Accesso non autorizzato.");
  const organization = await getCurrentOrganization();
  if (!organization) throw new Error("Organizzazione non disponibile.");
  return { user, organization };
}

export async function requireOrgRole(allowed: UserRole[]) {
  const user = await requireRole(allowed);
  const organization = await getCurrentOrganization();
  if (!organization) throw new Error("Organizzazione non disponibile.");
  return { user, organization };
}

export async function requireRole(allowed: UserRole[]) {
  const user = await getCurrentAppUser();
  if (!user) throw new Error("Accesso non autorizzato.");
  if (allowed.includes(user.role)) return user;

  const organizationId = user.defaultOrganizationId ?? DEFAULT_ORGANIZATION_ID;
  const membership = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId, userId: user.id } }
  });
  if (!membership) throw new Error("Permessi insufficienti.");

  const effective = effectiveRoleFromMembership(membership.role);
  if (!allowed.includes(effective)) throw new Error("Permessi insufficienti.");
  return user;
}
