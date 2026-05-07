import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteCertification } from "@/server/actions";
import { expirationStatus, formatDate } from "@/lib/format";
import { Badge, DeleteButton, PageHeader, Panel } from "@/components/ui";

export default async function CertificationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.certification.findUnique({ where: { id }, include: { operator: true } });
  if (!item) notFound();
  const status = expirationStatus(item.expiresAt);
  return (
    <>
      <PageHeader title={item.type} description={item.operator.displayName} actionHref={`/certifications/edit/${item.id}`} actionLabel="Modifica" />
      <div className="mb-4 flex justify-end"><DeleteButton action={deleteCertification.bind(null, item.id)} /></div>
      <Panel className="p-4">
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <div>Operatore: <Link className="font-semibold text-teal" href={`/operators/${item.operator.id}`}>{item.operator.displayName}</Link></div>
          <div>Numero: {item.number ?? "-"}</div>
          <div>Ente: {item.issuingBody ?? "-"}</div>
          <div>Rilascio: {formatDate(item.issuedAt)}</div>
          <div>Scadenza: {formatDate(item.expiresAt)} <Badge tone={status.tone}>{status.label}</Badge></div>
          <div>Avvalimento: {item.availableForAvvalimento ? "Disponibile" : "Non indicato"}</div>
          <div className="md:col-span-2">Note: {item.notes ?? "-"}</div>
        </div>
      </Panel>
    </>
  );
}
