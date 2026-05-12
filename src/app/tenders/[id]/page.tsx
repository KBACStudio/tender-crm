import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { groupRoleLabels, tenderOutcomeLabels, tenderTaskAreaLabels, tenderTaskStatusLabels } from "@/lib/labels";
import { formatCurrency, formatDate } from "@/lib/format";
import { addTenderTask, deleteTender, openTenderContract, updateTenderTaskStatus } from "@/server/actions";
import { requireOrganization } from "@/server/auth";
import { Badge, DeleteButton, Field, PageHeader, Panel, Table } from "@/components/ui";

export default async function TenderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { organization } = await requireOrganization();
  const organizationId = organization.id;
  const tender = await prisma.tender.findFirst({
    where: { id, organizationId },
    include: {
      workRequirements: true,
      soaRequirements: true,
      grouping: { include: { members: { include: { operator: true } } } },
      tasks: { include: { operator: true }, orderBy: [{ status: "asc" }, { dueDate: "asc" }] },
      contract: true
    }
  });
  if (!tender) notFound();
  const members = tender.grouping?.members ?? [];
  const taskColumns = ["todo", "doing", "done"] as const;

  return (
    <>
      <PageHeader title={tender.object} description={`CIG ${tender.cig}`} actionHref={`/tenders/edit/${tender.id}`} actionLabel="Modifica gara" />
      <div className="mb-4 flex flex-wrap justify-end gap-2">
        {tender.outcome === "awarded" ? (
          <form action={openTenderContract.bind(null, tender.id)}>
            <button className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white" type="submit">
              Apri appalto
            </button>
          </form>
        ) : null}
        <DeleteButton action={deleteTender.bind(null, tender.id)} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Panel className="p-4"><h2 className="mb-3 font-bold">Dati gara</h2><div className="grid gap-2 text-sm md:grid-cols-2"><div>CUP: {tender.cup ?? "-"}</div><div>Luogo: {tender.place ?? "-"}</div><div>Stazione appaltante: {tender.contractingBody ?? "-"}</div><div>Valore: {formatCurrency(tender.value?.toString())}</div><div>Pubblicazione: {formatDate(tender.publishedAt)}</div><div>Scadenza: {formatDate(tender.deadline)}</div><div>Esito: {tenderOutcomeLabels[tender.outcome]}</div><div className="md:col-span-2">Note: {tender.notes ?? "-"}</div></div></Panel>
          <Panel className="p-4"><h2 className="mb-3 font-bold">RTP / RTI</h2><Table><tbody className="divide-y divide-line">{members.map((m) => <tr key={m.id}><td className="px-3 py-2">{m.operator?.displayName ?? "-"}</td><td className="px-3 py-2">{groupRoleLabels[m.role]}</td><td className="px-3 py-2">{m.sharePercent?.toString() ?? "-"}%</td></tr>)}</tbody></Table></Panel>
          <Panel className="p-4"><h2 className="mb-3 font-bold">Requisiti</h2><Table><tbody className="divide-y divide-line">{tender.workRequirements.map((w) => <tr key={w.id}><td className="px-3 py-2">ID opera {w.workId}</td><td className="px-3 py-2">{w.category ?? "-"}</td><td className="px-3 py-2">{formatCurrency(w.amount?.toString())}</td></tr>)}{tender.soaRequirements.map((s) => <tr key={s.id}><td className="px-3 py-2">SOA {s.category}</td><td className="px-3 py-2">{s.ranking ?? "-"}</td><td className="px-3 py-2">-</td></tr>)}</tbody></Table></Panel>
          <Panel className="p-4">
            <h2 className="mb-3 font-bold">Kanban gara</h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {taskColumns.map((status) => (
                <div key={status} className="rounded-lg border border-line bg-app p-3">
                  <div className="mb-3 text-sm font-bold">{tenderTaskStatusLabels[status]}</div>
                  <div className="space-y-2">
                    {tender.tasks.filter((task) => task.status === status).map((task) => (
                      <div key={task.id} className="rounded-lg border border-line bg-panel p-3 text-sm">
                        <div className="font-semibold">{task.title}</div>
                        <div className="mt-1 text-xs text-muted">{tenderTaskAreaLabels[task.area]} - {task.operator?.displayName ?? "Generale"}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <Badge tone={status === "done" ? "success" : status === "doing" ? "warning" : "neutral"}>{tenderTaskStatusLabels[status]}</Badge>
                          <span className="text-xs text-muted">{formatDate(task.dueDate)}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {taskColumns.filter((nextStatus) => nextStatus !== status).map((nextStatus) => (
                            <form key={nextStatus} action={updateTenderTaskStatus.bind(null, task.id, tender.id, nextStatus)}>
                              <button className="rounded-md border border-line px-2 py-1 text-xs font-semibold" type="submit">{tenderTaskStatusLabels[nextStatus]}</button>
                            </form>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
        <Panel className="p-4">
          <h2 className="mb-3 font-bold">Aggiungi attivita</h2>
          <form action={addTenderTask} className="grid gap-3">
            <input type="hidden" name="tenderId" value={tender.id} />
            <Field label="Titolo"><input name="title" required placeholder="Richiedere DGUE a operatore" /></Field>
            <Field label="Area"><select name="area"><option value="administrative">Amministrativa</option><option value="technical_offer">Offerta tecnica</option><option value="economic_offer">Offerta economica</option><option value="rtp">RTP</option><option value="general">Generale</option></select></Field>
            <Field label="Stato"><select name="status"><option value="todo">Da fare</option><option value="doing">In corso</option><option value="done">Fatto</option></select></Field>
            <Field label="Operatore"><select name="operatorId"><option value="">Generale</option>{members.map((m) => m.operator ? <option key={m.operator.id} value={m.operator.id}>{m.operator.displayName}</option> : null)}</select></Field>
            <Field label="Scadenza"><input name="dueDate" type="date" /></Field>
            <Field label="Note"><textarea name="notes" /></Field>
            <button className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white" type="submit">Aggiungi al taccuino</button>
          </form>
        </Panel>
      </div>
    </>
  );
}
