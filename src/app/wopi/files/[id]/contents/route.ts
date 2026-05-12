import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { readStorageFile, writeStorageFile } from "@/lib/storage";
import { verifyWopiAccessToken } from "@/lib/wopi";

async function loadDoc(request: NextRequest, id: string) {
  const token = request.nextUrl.searchParams.get("access_token");
  const payload = verifyWopiAccessToken(token);
  if (!payload || payload.docId !== id) return { payload: null, doc: null };
  const doc = await prisma.document.findFirst({ where: { id, organizationId: payload.organizationId } });
  if (!doc?.storagePath) return { payload, doc: null };
  return { payload, doc };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { doc } = await loadDoc(request, id);
  if (!doc) return new NextResponse("Not found", { status: 404 });
  const file = await readStorageFile(doc.storagePath!);
  return new NextResponse(file, {
    status: 200,
    headers: {
      "Content-Type": doc.mimeType ?? "application/octet-stream"
    }
  });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { doc } = await loadDoc(request, id);
  if (!doc) return new NextResponse("Not found", { status: 404 });

  const override = request.headers.get("x-wopi-override")?.toUpperCase() ?? "";
  const lock = request.headers.get("x-wopi-lock") ?? "";

  if (override === "PUT") {
    const body = new Uint8Array(await request.arrayBuffer());
    await writeStorageFile(doc.storagePath!, body);
    await prisma.document.update({ where: { id }, data: { version: { increment: 1 } } });
    return new NextResponse(null, { status: 200 });
  }

  if (override === "LOCK" || override === "UNLOCK" || override === "REFRESH_LOCK") {
    return new NextResponse(null, { status: 200, headers: { "X-WOPI-Lock": lock } });
  }

  if (override === "GET_LOCK") {
    return new NextResponse(null, { status: 200, headers: { "X-WOPI-Lock": lock } });
  }

  return new NextResponse(null, { status: 200 });
}
