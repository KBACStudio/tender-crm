import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { designLevelLabels } from "@/lib/labels";
import { formatCurrency, formatDate } from "@/lib/format";
import { deleteService } from "@/server/actions";
import { DeleteButton, PageHeader, Panel, Table } from "@/components/ui";

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id }, include: { assignments: { include: { operator: true } }, workItems: true, levels: true } });
  if (!service) notFound();
  return <><PageHeader title={service.title} description={service.levels.map((l) => designLevelLabels[l.level]).join(", ") || "Servizio"} actionHref={`/services/edit/${service.id}`} actionLabel="Modifica" /><div className="mb-4 flex justify-end"><DeleteButton action={deleteService.bind(null, service.id)} /></div><div className="grid gap-6 xl:grid-cols-2"><Panel className="p-4"><h2 className="mb-3 font-bold">Dati servizio</h2><div className="grid gap-2 text-sm"><div>Committente: {service.client ?? "-"}</div><div>Parcella: {formatCurrency(service.feeAmount?.toString())}</div><div>Valore lavori: {formatCurrency(service.workItems.reduce((sum, item) => sum + Number(item.workValue ?? 0), 0))}</div><div>Periodo: {formatDate(service.startedAt)} - {formatDate(service.endedAt)}</div><div>Note: {service.notes ?? "-"}</div></div></Panel><Panel className="p-4"><h2 className="mb-3 font-bold">Operatori coinvolti</h2><Table><tbody className="divide-y divide-line">{service.assignments.map((a) => <tr key={a.id}><td className="px-3 py-2">{a.operator?.displayName ?? "-"}</td><td className="px-3 py-2">{a.role ?? "-"}</td><td className="px-3 py-2">{a.executionPercent?.toString() ?? "-"}%</td></tr>)}</tbody></Table></Panel><Panel className="p-4 xl:col-span-2"><h2 className="mb-3 font-bold">ID opera</h2><Table><tbody className="divide-y divide-line">{service.workItems.map((w) => <tr key={w.id}><td className="px-3 py-2">{w.workId}</td><td className="px-3 py-2">{w.workCategory ?? "-"}</td><td className="px-3 py-2">{formatCurrency(w.workValue?.toString())}</td></tr>)}</tbody></Table></Panel></div></>;
}
