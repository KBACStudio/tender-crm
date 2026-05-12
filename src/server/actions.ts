"use server";

import { ContractMilestoneStatus, ContractStatus, ContractTaskArea, ContractTaskStatus, DesignLevel, GroupMemberRole, OrganizationModule, OrganizationPlan, PersonCompanyRole, SubjectType, TenderOutcome, TenderTaskArea, TenderTaskStatus, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { writeStorageFile } from "@/lib/storage";
import { requireOrgRole } from "@/server/auth";
import { optionalBoolean, optionalDate, optionalDecimal, optionalString, requiredString } from "@/server/form";

function enumValue<T extends Record<string, string>>(source: T, value: FormDataEntryValue | null, fallback: T[keyof T]) {
  return Object.values(source).includes(String(value)) ? (String(value) as T[keyof T]) : fallback;
}

function jsonRows(formData: FormData, key: string): Record<string, string>[] {
  const raw = optionalString(formData, key);
  if (!raw) return [];
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed.filter((row) => row && typeof row === "object") : [];
}

export async function upsertCompany(id: string | null, formData: FormData) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const data = {
    name: requiredString(formData, "name"),
    subjectType: enumValue(SubjectType, formData.get("subjectType"), SubjectType.other),
    vatNumber: optionalString(formData, "vatNumber"),
    fiscalCode: optionalString(formData, "fiscalCode"),
    email: optionalString(formData, "email"),
    pec: optionalString(formData, "pec"),
    phone: optionalString(formData, "phone"),
    website: optionalString(formData, "website"),
    address: optionalString(formData, "address"),
    city: optionalString(formData, "city"),
    province: optionalString(formData, "province"),
    notes: optionalString(formData, "notes")
  };
  let company;
  if (id) {
    const existing = await prisma.company.findFirst({ where: { id, organizationId } });
    if (!existing) redirect("/companies");
    company = await prisma.company.update({ where: { id }, data });
  } else {
    company = await prisma.company.create({ data: { ...data, organizationId } });
  }
  await prisma.economicOperator.upsert({
    where: { companyId: company.id },
    create: {
      companyId: company.id,
      organizationId,
      displayName: company.name,
      operatorType: "company",
      availableForAvvalimento: optionalBoolean(formData, "availableForAvvalimento"),
      tags: optionalString(formData, "tags")
    },
    update: {
      organizationId,
      displayName: company.name,
      operatorType: "company",
      availableForAvvalimento: optionalBoolean(formData, "availableForAvvalimento"),
      tags: optionalString(formData, "tags")
    }
  });
  revalidatePath("/companies");
  redirect(`/companies/${company.id}`);
}

export async function createEconomicOperator(formData: FormData) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const operatorKind = optionalString(formData, "operatorKind") ?? "company";
  if (operatorKind === "professional") {
    const person = await prisma.person.create({
      data: {
        organizationId,
        firstName: requiredString(formData, "firstName"),
        lastName: requiredString(formData, "lastName"),
        email: optionalString(formData, "email"),
        pec: optionalString(formData, "pec"),
        phone: optionalString(formData, "phone"),
        fiscalCode: optionalString(formData, "fiscalCode"),
        birthPlace: optionalString(formData, "birthPlace"),
        birthDate: optionalDate(formData, "birthDate"),
        residenceAddress: optionalString(formData, "residenceAddress"),
        educationTitle: optionalString(formData, "educationTitle"),
        university: optionalString(formData, "university"),
        qualificationDate: optionalDate(formData, "qualificationDate"),
        professionalOrder: optionalString(formData, "professionalOrder"),
        professionalOrderProvince: optionalString(formData, "professionalOrderProvince"),
        professionalOrderNumber: optionalString(formData, "professionalOrderNumber"),
        professionalOrderRegistrationDate: optionalDate(formData, "professionalOrderRegistrationDate"),
        inarcassaNumber: optionalString(formData, "inarcassaNumber"),
        notes: optionalString(formData, "notes")
      }
    });
    const professional = await prisma.professional.create({
      data: {
        organizationId,
        personId: person.id,
        register: optionalString(formData, "professionalOrder"),
        registerNumber: optionalString(formData, "professionalOrderNumber"),
        specialization: optionalString(formData, "specialization"),
        vatNumber: optionalString(formData, "vatNumber")
      }
    });
    const operator = await prisma.economicOperator.create({
      data: {
        organizationId,
        professionalId: professional.id,
        displayName: `${person.lastName} ${person.firstName}`,
        operatorType: "professional",
        availableForAvvalimento: optionalBoolean(formData, "availableForAvvalimento"),
        tags: optionalString(formData, "tags")
      }
    });
    redirect(`/operators/${operator.id}`);
  }

  const company = await prisma.company.create({
    data: {
      organizationId,
      name: requiredString(formData, "name"),
      subjectType: enumValue(SubjectType, formData.get("subjectType"), SubjectType.other),
      vatNumber: optionalString(formData, "vatNumber"),
      fiscalCode: optionalString(formData, "fiscalCode"),
      email: optionalString(formData, "email"),
      pec: optionalString(formData, "pec"),
      phone: optionalString(formData, "phone"),
      website: optionalString(formData, "website"),
      address: optionalString(formData, "address"),
      city: optionalString(formData, "city"),
      province: optionalString(formData, "province"),
      notes: optionalString(formData, "notes")
    }
  });
  const operator = await prisma.economicOperator.create({
    data: {
      organizationId,
      companyId: company.id,
      displayName: company.name,
      operatorType: "company",
      availableForAvvalimento: optionalBoolean(formData, "availableForAvvalimento"),
      tags: optionalString(formData, "tags")
    }
  });
  redirect(`/operators/${operator.id}`);
}

export async function updateEconomicOperator(id: string, formData: FormData) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const operator = await prisma.economicOperator.findFirst({
    where: { id, organizationId },
    include: { company: true, professional: { include: { person: true } } }
  });
  if (!operator) redirect("/operators");

  const common = {
    availableForAvvalimento: optionalBoolean(formData, "availableForAvvalimento"),
    tags: optionalString(formData, "tags"),
    notes: optionalString(formData, "notes")
  };

  if (operator.operatorType === "professional" && operator.professional?.person) {
    const personRecord = await prisma.person.findFirst({ where: { id: operator.professional.personId, organizationId } });
    if (!personRecord) redirect("/operators");
    const person = await prisma.person.update({
      where: { id: operator.professional.personId },
      data: {
        firstName: requiredString(formData, "firstName"),
        lastName: requiredString(formData, "lastName"),
        email: optionalString(formData, "email"),
        pec: optionalString(formData, "pec"),
        phone: optionalString(formData, "phone"),
        fiscalCode: optionalString(formData, "fiscalCode"),
        birthPlace: optionalString(formData, "birthPlace"),
        birthDate: optionalDate(formData, "birthDate"),
        residenceAddress: optionalString(formData, "residenceAddress"),
        educationTitle: optionalString(formData, "educationTitle"),
        university: optionalString(formData, "university"),
        qualificationDate: optionalDate(formData, "qualificationDate"),
        professionalOrder: optionalString(formData, "professionalOrder"),
        professionalOrderProvince: optionalString(formData, "professionalOrderProvince"),
        professionalOrderNumber: optionalString(formData, "professionalOrderNumber"),
        professionalOrderRegistrationDate: optionalDate(formData, "professionalOrderRegistrationDate"),
        inarcassaNumber: optionalString(formData, "inarcassaNumber"),
        notes: optionalString(formData, "notes")
      }
    });
    await prisma.professional.update({
      where: { id: operator.professional.id },
      data: {
        register: optionalString(formData, "professionalOrder"),
        registerNumber: optionalString(formData, "professionalOrderNumber"),
        specialization: optionalString(formData, "specialization"),
        vatNumber: optionalString(formData, "vatNumber")
      }
    });
    await prisma.economicOperator.update({
      where: { id },
      data: { ...common, displayName: `${person.lastName} ${person.firstName}` }
    });
    revalidatePath(`/operators/${id}`);
    redirect(`/operators/${id}`);
  }

  if (operator.company) {
    const companyRecord = await prisma.company.findFirst({ where: { id: operator.company.id, organizationId } });
    if (!companyRecord) redirect("/operators");
    const company = await prisma.company.update({
      where: { id: operator.company.id },
      data: {
        name: requiredString(formData, "name"),
        subjectType: enumValue(SubjectType, formData.get("subjectType"), SubjectType.other),
        vatNumber: optionalString(formData, "vatNumber"),
        fiscalCode: optionalString(formData, "fiscalCode"),
        email: optionalString(formData, "email"),
        pec: optionalString(formData, "pec"),
        phone: optionalString(formData, "phone"),
        website: optionalString(formData, "website"),
        address: optionalString(formData, "address"),
        city: optionalString(formData, "city"),
        province: optionalString(formData, "province"),
        notes: optionalString(formData, "notes")
      }
    });
    await prisma.economicOperator.update({ where: { id }, data: { ...common, displayName: company.name } });
  }

  revalidatePath("/operators");
  revalidatePath(`/operators/${id}`);
  redirect(`/operators/${id}`);
}

export async function deleteEconomicOperator(id: string) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const operator = await prisma.economicOperator.findFirst({
    where: { id, organizationId },
    select: { companyId: true, professional: { select: { personId: true } } }
  });
  if (operator?.companyId) {
    const company = await prisma.company.findFirst({ where: { id: operator.companyId, organizationId } });
    if (company) await prisma.company.delete({ where: { id: company.id } });
  } else if (operator?.professional?.personId) {
    const person = await prisma.person.findFirst({ where: { id: operator.professional.personId, organizationId } });
    if (person) await prisma.person.delete({ where: { id: person.id } });
  } else {
    if (operator) await prisma.economicOperator.delete({ where: { id } });
  }
  revalidatePath("/operators");
  redirect("/operators");
}

export async function deleteCompany(id: string) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const company = await prisma.company.findFirst({ where: { id, organizationId } });
  if (!company) redirect("/companies");
  await prisma.company.delete({ where: { id } });
  revalidatePath("/companies");
  redirect("/companies");
}

export async function upsertPerson(id: string | null, formData: FormData) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const markProfessional = optionalBoolean(formData, "markProfessional");
  const data = {
    firstName: requiredString(formData, "firstName"),
    lastName: requiredString(formData, "lastName"),
    email: optionalString(formData, "email"),
    pec: optionalString(formData, "pec"),
    phone: optionalString(formData, "phone"),
    fiscalCode: optionalString(formData, "fiscalCode"),
    birthPlace: optionalString(formData, "birthPlace"),
    birthDate: optionalDate(formData, "birthDate"),
    residenceAddress: optionalString(formData, "residenceAddress"),
    educationTitle: optionalString(formData, "educationTitle"),
    university: optionalString(formData, "university"),
    graduationDate: optionalDate(formData, "graduationDate"),
    qualificationDate: optionalDate(formData, "qualificationDate"),
    professionalOrder: optionalString(formData, "professionalOrder"),
    professionalOrderProvince: optionalString(formData, "professionalOrderProvince"),
    professionalOrderNumber: optionalString(formData, "professionalOrderNumber"),
    professionalOrderRegistrationDate: optionalDate(formData, "professionalOrderRegistrationDate"),
    inarcassaNumber: optionalString(formData, "inarcassaNumber"),
    notes: optionalString(formData, "notes")
  };

  let person;
  if (id) {
    const existing = await prisma.person.findFirst({ where: { id, organizationId } });
    if (!existing) redirect("/people");
    person = await prisma.person.update({ where: { id }, data });
  } else {
    person = await prisma.person.create({ data: { ...data, organizationId } });
  }

  const operatorId = optionalString(formData, "operatorId");
  if (operatorId) {
    const role = enumValue(PersonCompanyRole, formData.get("operatorRole"), PersonCompanyRole.contact);
    await prisma.personOperator.upsert({
      where: { personId_operatorId_role: { personId: person.id, operatorId, role } },
      create: {
        organizationId,
        personId: person.id,
        operatorId,
        role,
        title: optionalString(formData, "operatorTitle")
      },
      update: { title: optionalString(formData, "operatorTitle") }
    });

    const linkedOperator = await prisma.economicOperator.findFirst({ where: { id: operatorId, organizationId }, select: { companyId: true } });
    if (linkedOperator?.companyId) {
      await prisma.personCompany.upsert({
        where: { personId_companyId_role: { personId: person.id, companyId: linkedOperator.companyId, role } },
        create: {
          organizationId,
          personId: person.id,
          companyId: linkedOperator.companyId,
          role,
          title: optionalString(formData, "operatorTitle")
        },
        update: { title: optionalString(formData, "operatorTitle") }
      });
    }
  }

  if (markProfessional) {
    await prisma.professional.upsert({
      where: { personId: person.id },
      create: { organizationId, personId: person.id },
      update: { organizationId }
    });
  }

  revalidatePath("/people");
  redirect(`/people/${person.id}`);
}

export async function deletePerson(id: string) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const person = await prisma.person.findFirst({ where: { id, organizationId } });
  if (!person) redirect("/people");
  await prisma.person.delete({ where: { id } });
  revalidatePath("/people");
  redirect("/people");
}

export async function upsertProfessional(id: string | null, formData: FormData) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const personId = requiredString(formData, "personId");
  const person = await prisma.person.findFirst({ where: { id: personId, organizationId } });
  if (!person) redirect("/professionals");
  const data = {
    personId,
    register: optionalString(formData, "register"),
    registerNumber: optionalString(formData, "registerNumber"),
    specialization: optionalString(formData, "specialization"),
    vatNumber: optionalString(formData, "vatNumber"),
    insured: optionalBoolean(formData, "insured"),
    notes: optionalString(formData, "notes")
  };
  let professional;
  if (id) {
    const existing = await prisma.professional.findFirst({ where: { id, organizationId } });
    if (!existing) redirect("/professionals");
    professional = await prisma.professional.update({ where: { id }, data: { ...data, organizationId } });
  } else {
    professional = await prisma.professional.create({ data: { ...data, organizationId } });
  }
  await prisma.economicOperator.upsert({
    where: { professionalId: professional.id },
    create: {
      organizationId,
      professionalId: professional.id,
      displayName: `${person.lastName} ${person.firstName}`,
      operatorType: "professional"
    },
    update: {
      organizationId,
      displayName: `${person.lastName} ${person.firstName}`,
      operatorType: "professional"
    }
  });
  revalidatePath("/professionals");
  redirect(`/professionals/${professional.id}`);
}

export async function deleteProfessional(id: string) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const professional = await prisma.professional.findFirst({ where: { id, organizationId } });
  if (!professional) redirect("/professionals");
  await prisma.professional.delete({ where: { id } });
  revalidatePath("/professionals");
  redirect("/professionals");
}

export async function upsertCertification(id: string | null, formData: FormData) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const operatorId = requiredString(formData, "operatorId");
  const operator = await prisma.economicOperator.findFirst({ where: { id: operatorId, organizationId }, select: { companyId: true } });
  if (!operator) redirect("/certifications");
  const data = {
    organizationId,
    operatorId,
    companyId: operator?.companyId ?? null,
    type: requiredString(formData, "type"),
    number: optionalString(formData, "number"),
    issuingBody: optionalString(formData, "issuingBody"),
    issuedAt: optionalDate(formData, "issuedAt"),
    expiresAt: optionalDate(formData, "expiresAt"),
    notes: optionalString(formData, "notes"),
    availableForAvvalimento: optionalBoolean(formData, "availableForAvvalimento")
  };
  let item;
  if (id) {
    const existing = await prisma.certification.findFirst({ where: { id, organizationId } });
    if (!existing) redirect("/certifications");
    item = await prisma.certification.update({ where: { id }, data });
  } else {
    item = await prisma.certification.create({ data });
  }
  revalidatePath("/certifications");
  redirect(`/certifications/${item.id}`);
}

export async function addTenderTask(formData: FormData) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const tenderId = requiredString(formData, "tenderId");
  const tender = await prisma.tender.findFirst({ where: { id: tenderId, organizationId } });
  if (!tender) redirect("/tenders");
  const statusRaw = String(formData.get("status") ?? "todo");
  const areaRaw = String(formData.get("area") ?? "general");
  await prisma.tenderTask.create({
    data: {
      organizationId,
      tenderId,
      operatorId: optionalString(formData, "operatorId"),
      title: requiredString(formData, "title"),
      area: Object.values(TenderTaskArea).includes(areaRaw as TenderTaskArea) ? (areaRaw as TenderTaskArea) : TenderTaskArea.general,
      status: Object.values(TenderTaskStatus).includes(statusRaw as TenderTaskStatus) ? (statusRaw as TenderTaskStatus) : TenderTaskStatus.todo,
      dueDate: optionalDate(formData, "dueDate"),
      notes: optionalString(formData, "notes")
    }
  });
  revalidatePath(`/tenders/${tenderId}`);
  redirect(`/tenders/${tenderId}`);
}

export async function updateTenderTaskStatus(taskId: string, tenderId: string, status: TenderTaskStatus) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const task = await prisma.tenderTask.findFirst({ where: { id: taskId, tenderId, organizationId } });
  if (!task) return;
  await prisma.tenderTask.update({ where: { id: taskId }, data: { status } });
  revalidatePath(`/tenders/${tenderId}`);
}

export async function deleteCertification(id: string) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const item = await prisma.certification.findFirst({ where: { id, organizationId } });
  if (!item) redirect("/certifications");
  await prisma.certification.delete({ where: { id } });
  revalidatePath("/certifications");
  redirect("/certifications");
}

export async function upsertSoa(id: string | null, formData: FormData) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const qualifications = jsonRows(formData, "qualifications").filter((row) => row.category && row.ranking);
  const companyId = requiredString(formData, "companyId");
  const company = await prisma.company.findFirst({ where: { id: companyId, organizationId } });
  if (!company) redirect("/soa");
  const data = {
    organizationId,
    companyId,
    certificateNumber: optionalString(formData, "certificateNumber"),
    issuingBody: optionalString(formData, "issuingBody"),
    issuedAt: optionalDate(formData, "issuedAt"),
    expiresAt: optionalDate(formData, "expiresAt"),
    notes: optionalString(formData, "notes")
  };
  let item;
  if (id) {
    const existing = await prisma.soaCertificate.findFirst({ where: { id, organizationId } });
    if (!existing) redirect("/soa");
    item = await prisma.soaCertificate.update({ where: { id }, data });
  } else {
    item = await prisma.soaCertificate.create({ data });
  }
  await prisma.soaQualification.deleteMany({ where: { soaCertificateId: item.id, organizationId } });
  if (qualifications.length) {
    await prisma.soaQualification.createMany({
      data: qualifications.map((row) => ({
        organizationId,
        soaCertificateId: item.id,
        category: row.category,
        ranking: row.ranking,
        notes: row.notes || null
      }))
    });
  }
  revalidatePath("/soa");
  redirect(`/soa/${item.id}`);
}

export async function deleteSoa(id: string) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const item = await prisma.soaCertificate.findFirst({ where: { id, organizationId } });
  if (!item) redirect("/soa");
  await prisma.soaCertificate.delete({ where: { id } });
  revalidatePath("/soa");
  redirect("/soa");
}

export async function upsertService(id: string | null, formData: FormData) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const operatorId = optionalString(formData, "operatorId");
  const levels = formData.getAll("levels").map(String).filter((value) => Object.values(DesignLevel).includes(value as DesignLevel)) as DesignLevel[];
  const workRows = jsonRows(formData, "workItems").filter((row) => row.workReferenceId || row.workId);
  const data = {
    title: requiredString(formData, "title"),
    client: optionalString(formData, "client"),
    feeAmount: optionalDecimal(formData, "feeAmount"),
    startedAt: optionalDate(formData, "startedAt"),
    endedAt: optionalDate(formData, "endedAt"),
    notes: optionalString(formData, "notes")
  };
  let service;
  if (id) {
    const existing = await prisma.service.findFirst({ where: { id, organizationId } });
    if (!existing) redirect("/services");
    service = await prisma.service.update({ where: { id }, data });
  } else {
    service = await prisma.service.create({ data: { ...data, organizationId } });
  }
  await prisma.serviceAssignment.deleteMany({ where: { serviceId: service.id, organizationId } });
  await prisma.serviceWorkItem.deleteMany({ where: { serviceId: service.id, organizationId } });
  await prisma.serviceDesignLevel.deleteMany({ where: { serviceId: service.id, organizationId } });
  if (operatorId) {
    const operator = await prisma.economicOperator.findFirst({ where: { id: operatorId, organizationId }, select: { id: true } });
    if (!operator) redirect(`/services/${service.id}`);
    await prisma.serviceAssignment.create({
      data: {
        organizationId,
        serviceId: service.id,
        operatorId,
        role: optionalString(formData, "assignmentRole"),
        executionPercent: optionalDecimal(formData, "executionPercent")
      }
    });
  }
  if (workRows.length) {
    await prisma.serviceWorkItem.createMany({
      data: workRows.map((row) => ({
        organizationId,
        serviceId: service.id,
        workReferenceId: row.workReferenceId || null,
        workId: row.workId,
        workCategory: row.workCategory || null,
        workValue: row.workValue ? row.workValue.replace(",", ".") : null,
        sharePercent: row.sharePercent ? row.sharePercent.replace(",", ".") : null
      }))
    });
  }
  if (levels.length) {
    await prisma.serviceDesignLevel.createMany({
      data: levels.map((level) => ({ organizationId, serviceId: service.id, level })),
      skipDuplicates: true
    });
  }
  revalidatePath("/services");
  redirect(`/services/${service.id}`);
}

export async function deleteService(id: string) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const service = await prisma.service.findFirst({ where: { id, organizationId } });
  if (!service) redirect("/services");
  await prisma.service.delete({ where: { id } });
  revalidatePath("/services");
  redirect("/services");
}

export async function upsertTender(id: string | null, formData: FormData) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const workRows = jsonRows(formData, "workRequirements").filter((row) => row.workReferenceId || row.workId);
  const soaRows = jsonRows(formData, "soaRequirements").filter((row) => row.category);
  const groupRows = jsonRows(formData, "groupMembers").filter((row) => row.operatorId);
  const data = {
    object: requiredString(formData, "object"),
    cig: requiredString(formData, "cig"),
    cup: optionalString(formData, "cup"),
    place: optionalString(formData, "place"),
    contractingBody: optionalString(formData, "contractingBody"),
    value: optionalDecimal(formData, "value"),
    publishedAt: optionalDate(formData, "publishedAt"),
    deadline: optionalDate(formData, "deadline"),
    outcome: enumValue(TenderOutcome, formData.get("outcome"), TenderOutcome.draft),
    notes: optionalString(formData, "notes")
  };
  let tender;
  if (id) {
    const existing = await prisma.tender.findFirst({ where: { id, organizationId } });
    if (!existing) redirect("/tenders");
    tender = await prisma.tender.update({ where: { id }, data });
  } else {
    tender = await prisma.tender.create({ data: { ...data, organizationId } });
  }
  await prisma.tenderWorkRequirement.deleteMany({ where: { tenderId: tender.id, organizationId } });
  await prisma.tenderSoaRequirement.deleteMany({ where: { tenderId: tender.id, organizationId } });
  if (workRows.length) {
    await prisma.tenderWorkRequirement.createMany({
      data: workRows.map((row) => ({
        organizationId,
        tenderId: tender.id,
        workReferenceId: row.workReferenceId || null,
        workId: row.workId,
        category: row.category || null,
        amount: row.amount ? row.amount.replace(",", ".") : null
      }))
    });
  }
  if (soaRows.length) {
    await prisma.tenderSoaRequirement.createMany({
      data: soaRows.map((row) => ({
        organizationId,
        tenderId: tender.id,
        category: row.category,
        ranking: row.ranking || null
      }))
    });
  }
  if (groupRows.length) {
    const grouping = await prisma.grouping.upsert({
      where: { tenderId: tender.id },
      create: { organizationId, tenderId: tender.id, name: optionalString(formData, "groupingName") ?? `RTI ${tender.cig}`, type: "RTI" },
      update: { name: optionalString(formData, "groupingName") ?? `RTI ${tender.cig}` }
    });
    await prisma.groupMember.deleteMany({ where: { groupingId: grouping.id, organizationId } });
    await prisma.groupMember.createMany({
      data: groupRows.map((row) => ({
        organizationId,
        groupingId: grouping.id,
        operatorId: row.operatorId,
        role: Object.values(GroupMemberRole).includes(row.role as GroupMemberRole) ? (row.role as GroupMemberRole) : GroupMemberRole.member,
        sharePercent: row.sharePercent ? row.sharePercent.replace(",", ".") : null,
        notes: row.notes || null
      }))
    });
  }
  if (tender.outcome === TenderOutcome.awarded) {
    const existingContract = await prisma.contract.findFirst({ where: { tenderId: tender.id, organizationId } });
    if (!existingContract) {
      await prisma.contract.create({
        data: {
          organizationId,
          tenderId: tender.id,
          status: ContractStatus.draft,
          awardedAt: new Date(),
          awardedValue: tender.value
        }
      });
    } else if (!existingContract.awardedAt) {
      await prisma.contract.update({ where: { id: existingContract.id }, data: { awardedAt: new Date() } });
    }
    revalidatePath("/contracts");
  }
  revalidatePath("/tenders");
  redirect(`/tenders/${tender.id}`);
}

export async function deleteTender(id: string) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const tender = await prisma.tender.findFirst({ where: { id, organizationId } });
  if (!tender) redirect("/tenders");
  await prisma.tender.delete({ where: { id } });
  revalidatePath("/tenders");
  redirect("/tenders");
}

export async function openTenderContract(tenderId: string) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const tender = await prisma.tender.findFirst({ where: { id: tenderId, organizationId } });
  if (!tender) redirect("/tenders");
  if (tender.outcome !== TenderOutcome.awarded) redirect(`/tenders/${tenderId}`);

  const existing = await prisma.contract.findFirst({ where: { tenderId, organizationId } });
  if (existing) redirect(`/contracts/${existing.id}`);

  const contract = await prisma.contract.create({
    data: {
      organizationId,
      tenderId,
      status: ContractStatus.draft,
      awardedAt: new Date(),
      awardedValue: tender.value
    }
  });
  revalidatePath("/contracts");
  redirect(`/contracts/${contract.id}`);
}

export async function upsertContract(id: string, formData: FormData) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const data = {
    status: enumValue(ContractStatus, formData.get("status"), ContractStatus.draft),
    awardedAt: optionalDate(formData, "awardedAt"),
    awardedValue: optionalDecimal(formData, "awardedValue"),
    startedAt: optionalDate(formData, "startedAt"),
    endedAt: optionalDate(formData, "endedAt"),
    notes: optionalString(formData, "notes")
  };
  const existing = await prisma.contract.findFirst({ where: { id, organizationId } });
  if (!existing) redirect("/contracts");
  const contract = await prisma.contract.update({ where: { id }, data });
  revalidatePath("/contracts");
  redirect(`/contracts/${contract.id}`);
}

export async function uploadContractDocument(contractId: string, formData: FormData) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const file = formData.get("file");
  if (!(file instanceof File)) redirect(`/contracts/${contractId}`);

  const contract = await prisma.contract.findFirst({ where: { id: contractId, organizationId }, include: { tender: true } });
  if (!contract) redirect("/contracts");

  const document = await prisma.document.create({
    data: {
      title: optionalString(formData, "title") ?? file.name,
      organizationId,
      contractId,
      tenderId: contract.tenderId,
      fileName: file.name,
      mimeType: file.type || null,
      sizeBytes: file.size
    }
  });

  const storagePath = `orgs/${organizationId}/contracts/${contractId}/${document.id}/${file.name}`;
  const buffer = new Uint8Array(await file.arrayBuffer());
  await writeStorageFile(storagePath, buffer);

  await prisma.document.update({
    where: { id: document.id },
    data: { storagePath }
  });

  revalidatePath(`/contracts/${contractId}`);
  redirect(`/contracts/${contractId}`);
}

export async function addContractTask(formData: FormData) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const contractId = requiredString(formData, "contractId");
  const contract = await prisma.contract.findFirst({ where: { id: contractId, organizationId } });
  if (!contract) redirect("/contracts");
  const statusRaw = formData.get("status");
  const areaRaw = formData.get("area");

  await prisma.contractTask.create({
    data: {
      organizationId,
      contractId,
      title: requiredString(formData, "title"),
      area: enumValue(ContractTaskArea, areaRaw, ContractTaskArea.general),
      status: enumValue(ContractTaskStatus, statusRaw, ContractTaskStatus.todo),
      dueDate: optionalDate(formData, "dueDate"),
      notes: optionalString(formData, "notes")
    }
  });

  revalidatePath(`/contracts/${contractId}`);
  redirect(`/contracts/${contractId}`);
}

export async function updateContractTaskStatus(taskId: string, contractId: string, status: ContractTaskStatus) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const task = await prisma.contractTask.findFirst({ where: { id: taskId, contractId, organizationId } });
  if (!task) return;
  await prisma.contractTask.update({ where: { id: taskId }, data: { status } });
  revalidatePath(`/contracts/${contractId}`);
}

export async function deleteContractTask(taskId: string, contractId: string) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const task = await prisma.contractTask.findFirst({ where: { id: taskId, contractId, organizationId } });
  if (!task) redirect(`/contracts/${contractId}`);
  await prisma.contractTask.delete({ where: { id: taskId } });
  revalidatePath(`/contracts/${contractId}`);
  redirect(`/contracts/${contractId}`);
}

export async function addContractMilestone(formData: FormData) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const contractId = requiredString(formData, "contractId");
  const contract = await prisma.contract.findFirst({ where: { id: contractId, organizationId } });
  if (!contract) redirect("/contracts");
  const statusRaw = formData.get("status");

  await prisma.contractMilestone.create({
    data: {
      organizationId,
      contractId,
      title: requiredString(formData, "title"),
      plannedAt: optionalDate(formData, "plannedAt"),
      amount: optionalDecimal(formData, "amount"),
      status: enumValue(ContractMilestoneStatus, statusRaw, ContractMilestoneStatus.planned),
      notes: optionalString(formData, "notes")
    }
  });

  revalidatePath(`/contracts/${contractId}`);
  redirect(`/contracts/${contractId}`);
}

export async function updateContractMilestoneStatus(milestoneId: string, contractId: string, status: ContractMilestoneStatus) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const milestone = await prisma.contractMilestone.findFirst({ where: { id: milestoneId, contractId, organizationId } });
  if (!milestone) return;
  await prisma.contractMilestone.update({ where: { id: milestoneId }, data: { status } });
  revalidatePath(`/contracts/${contractId}`);
}

export async function deleteContractMilestone(milestoneId: string, contractId: string) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const milestone = await prisma.contractMilestone.findFirst({ where: { id: milestoneId, contractId, organizationId } });
  if (!milestone) redirect(`/contracts/${contractId}`);
  await prisma.contractMilestone.delete({ where: { id: milestoneId } });
  revalidatePath(`/contracts/${contractId}`);
  redirect(`/contracts/${contractId}`);
}

export async function upsertGrouping(id: string | null, formData: FormData) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const operatorId = optionalString(formData, "operatorId");
  const tenderId = id ? null : requiredString(formData, "tenderId");
  const data = {
    name: requiredString(formData, "name"),
    type: optionalString(formData, "type") ?? "RTI",
    notes: optionalString(formData, "notes")
  };
  let grouping;
  if (id) {
    const existing = await prisma.grouping.findFirst({ where: { id, organizationId } });
    if (!existing) redirect("/groups");
    grouping = await prisma.grouping.update({ where: { id }, data });
  } else {
    const tender = await prisma.tender.findFirst({ where: { id: tenderId as string, organizationId } });
    if (!tender) redirect("/groups");
    grouping = await prisma.grouping.create({ data: { ...data, organizationId, tenderId: tenderId as string } });
  }
  if (operatorId) {
    const operator = await prisma.economicOperator.findFirst({ where: { id: operatorId, organizationId }, select: { id: true } });
    if (!operator) redirect(`/groups/${grouping.id}`);
    await prisma.groupMember.create({
      data: {
        organizationId,
        groupingId: grouping.id,
        operatorId,
        role: enumValue(GroupMemberRole, formData.get("memberRole"), GroupMemberRole.member),
        sharePercent: optionalDecimal(formData, "sharePercent"),
        notes: optionalString(formData, "memberNotes")
      }
    });
  }
  revalidatePath("/groups");
  redirect(`/groups/${grouping.id}`);
}

export async function addRevenueHistory(formData: FormData) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const operatorId = requiredString(formData, "operatorId");
  const operator = await prisma.economicOperator.findFirst({ where: { id: operatorId, organizationId }, select: { id: true } });
  if (!operator) redirect("/operators");
  await prisma.revenueHistory.upsert({
    where: { operatorId_year: { operatorId, year: Number(requiredString(formData, "year")) } },
    create: {
      organizationId,
      operatorId,
      year: Number(requiredString(formData, "year")),
      revenue: requiredString(formData, "revenue").replace(",", "."),
      source: optionalString(formData, "source"),
      notes: optionalString(formData, "notes")
    },
    update: {
      organizationId,
      revenue: requiredString(formData, "revenue").replace(",", "."),
      source: optionalString(formData, "source"),
      notes: optionalString(formData, "notes")
    }
  });
  revalidatePath("/operators");
  revalidatePath(`/operators/${operatorId}`);
  redirect(`/operators/${operatorId}`);
}

export async function createWorkReference(formData: FormData) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  await prisma.workReference.create({
    data: {
      organizationId,
      code: requiredString(formData, "code"),
      category: optionalString(formData, "category"),
      description: optionalString(formData, "description"),
      notes: optionalString(formData, "notes")
    }
  });
  revalidatePath("/works");
  redirect("/works");
}

export async function deleteWorkReference(id: string) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const item = await prisma.workReference.findFirst({ where: { id, organizationId } });
  if (!item) redirect("/works");
  await prisma.workReference.delete({ where: { id } });
  revalidatePath("/works");
  redirect("/works");
}

export async function deleteGrouping(id: string) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const grouping = await prisma.grouping.findFirst({ where: { id, organizationId } });
  if (!grouping) redirect("/groups");
  await prisma.grouping.delete({ where: { id } });
  revalidatePath("/groups");
  redirect("/groups");
}

export async function addPersonCompany(formData: FormData) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const companyId = requiredString(formData, "companyId");
  const company = await prisma.company.findFirst({ where: { id: companyId, organizationId } });
  if (!company) redirect("/companies");
  const personId = requiredString(formData, "personId");
  const person = await prisma.person.findFirst({ where: { id: personId, organizationId } });
  if (!person) redirect(`/companies/${companyId}`);
  await prisma.personCompany.create({
    data: {
      organizationId,
      companyId,
      personId,
      role: enumValue(PersonCompanyRole, formData.get("role"), PersonCompanyRole.contact),
      title: optionalString(formData, "title"),
      notes: optionalString(formData, "notes")
    }
  });
  revalidatePath(`/companies/${companyId}`);
  redirect(`/companies/${companyId}`);
}

export async function updateOrganizationSettings(formData: FormData) {
  const { organization } = await requireOrgRole([UserRole.admin]);
  const name = requiredString(formData, "name");
  const planRaw = formData.get("plan");
  const modulesRaw = formData.getAll("modules").map(String);
  const modules = modulesRaw.filter((value) => Object.values(OrganizationModule).includes(value as OrganizationModule)) as OrganizationModule[];

  await prisma.organization.update({
    where: { id: organization.id },
    data: {
      name,
      plan: enumValue(OrganizationPlan, planRaw, OrganizationPlan.starter),
      modules
    }
  });

  revalidatePath("/settings/organization");
  redirect("/settings/organization");
}
