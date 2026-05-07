import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteSoa } from "@/server/actions";
import { expirationStatus, formatDate } from "@/lib/format";
import { Badge, DeleteButton, PageHeader, Panel, Table } from "@/components/ui";

export default async function SoaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.soaCertificate.findUnique({ where: { id }, include: { company: true, qualifications: true } });
  if (!item) notFound();
  const status = expirationStatus(item.expiresAt);
  return <><PageHeader title={item.certificateNumber ?? "Attestazione SOA"} description={item.company.name} actionHref={`/soa/edit/${item.id}`} actionLabel="Modifica" /><div className="mb-4 flex justify-end"><DeleteButton action={deleteSoa.bind(null, item.id)} /></div><div className="grid gap-6 xl:grid-cols-2"><Panel className="p-4"><div className="grid gap-2 text-sm"><div>Organismo: {item.issuingBody ?? "-"}</div><div>Rilascio: {formatDate(item.issuedAt)}</div><div>Scadenza: {formatDate(item.expiresAt)} <Badge tone={status.tone}>{status.label}</Badge></div><div>Note: {item.notes ?? "-"}</div></div></Panel><Panel className="p-4"><h2 className="mb-3 font-bold">Categorie e classifiche</h2><Table><tbody className="divide-y divide-line">{item.qualifications.map((q) => <tr key={q.id}><td className="px-3 py-2">{q.category}</td><td className="px-3 py-2">{q.ranking}</td></tr>)}</tbody></Table></Panel></div></>;
}
