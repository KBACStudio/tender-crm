import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { readStorageFile } from "@/lib/storage";
import { requireOrgRole } from "@/server/auth";
import { UserRole } from "@prisma/client";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { organization } = await requireOrgRole([UserRole.admin, UserRole.operator, UserRole.viewer]);
  const organizationId = organization.id;
  const { id } = await params;
  const doc = await prisma.document.findFirst({ where: { id, organizationId } });
  if (!doc?.storagePath) return new NextResponse("Not found", { status: 404 });

  const file = await readStorageFile(doc.storagePath);
  const fileName = doc.fileName ?? `${doc.title}.bin`;

  return new NextResponse(file, {
    status: 200,
    headers: {
      "Content-Type": doc.mimeType ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`
    }
  });
}
