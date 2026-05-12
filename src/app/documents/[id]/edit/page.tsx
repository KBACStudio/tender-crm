import Link from "next/link";
import { notFound } from "next/navigation";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createWopiAccessToken } from "@/lib/wopi";
import { requireOrgRole } from "@/server/auth";
import { PageHeader, Panel } from "@/components/ui";

function appBaseUrl() {
  return process.env.WOPI_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

function collaboraBaseUrl() {
  return process.env.COLLABORA_URL ?? "http://localhost:9980";
}

export default async function DocumentEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { user: appUser, organization } = await requireOrgRole([UserRole.admin, UserRole.operator]);
  const organizationId = organization.id;
  const { id } = await params;
  const doc = await prisma.document.findFirst({ where: { id, organizationId } });
  if (!doc?.storagePath) notFound();

  const token = createWopiAccessToken(doc.id, appUser.id, organizationId);
  const wopiSrc = `${appBaseUrl()}/wopi/files/${doc.id}?access_token=${encodeURIComponent(token)}`;
  const editorUrl = `${collaboraBaseUrl()}/browser/dist/cool.html?WOPISrc=${encodeURIComponent(wopiSrc)}`;

  const backHref = doc.contractId ? `/contracts/${doc.contractId}` : doc.tenderId ? `/tenders/${doc.tenderId}` : "/contracts";

  return (
    <>
      <PageHeader title={doc.title} description="Editing documento (Collabora Online)" />
      <Panel className="mb-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <Link className="font-semibold text-teal" href={backHref}>
            Torna indietro
          </Link>
          <Link className="rounded-md border border-line px-3 py-1 font-semibold" href={`/documents/${doc.id}/download`}>
            Scarica
          </Link>
        </div>
      </Panel>
      <div className="overflow-hidden rounded-lg border border-line bg-panel">
        <iframe src={editorUrl} className="h-[80vh] w-full" allow="clipboard-read; clipboard-write" />
      </div>
    </>
  );
}
