import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { statStorageFile } from "@/lib/storage";
import { verifyWopiAccessToken } from "@/lib/wopi";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = request.nextUrl.searchParams.get("access_token");
  const payload = verifyWopiAccessToken(token);
  if (!payload || payload.docId !== id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const doc = await prisma.document.findFirst({ where: { id, organizationId: payload.organizationId } });
  if (!doc?.storagePath) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const stat = await statStorageFile(doc.storagePath);
  return NextResponse.json({
    BaseFileName: doc.fileName ?? doc.title,
    Size: stat.size,
    OwnerId: doc.contractId ?? doc.tenderId ?? "system",
    UserId: payload.userId,
    Version: String(doc.version),
    UserCanWrite: true,
    SupportsUpdate: true,
    SupportsLocks: true,
    SupportsGetLock: true,
    SupportsExtendedLockLength: true,
    SupportsRename: false
  });
}
