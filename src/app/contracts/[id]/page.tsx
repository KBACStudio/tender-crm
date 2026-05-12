import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { contractMilestoneStatusLabels, contractStatusLabels, contractTaskAreaLabels, contractTaskStatusLabels } from "@/lib/labels";
import { formatCurrency, formatDate } from "@/lib/format";
import { addContractMilestone, addContractTask, deleteContractMilestone, deleteContractTask, updateContractMilestoneStatus, updateContractTaskStatus, uploadContractDocument } from "@/server/actions";
import { requireOrganization } from "@/server/auth";
import { Badge, Field, PageHeader, Panel, Table } from "@/components/ui";

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { organization } = await requireOrganization();
  const organizationId = organization.id;
  const contract = await prisma.contract.findFirst({
    where: { id, organizationId },
    include: {
      tender: { include: { grouping: { include: { members: { include: { operator: true } } } } } },
      documents: true,
      tasks: { orderBy: [{ status: "asc" }, { dueDate: "asc" }] },
      milestones: { orderBy: [{ plannedAt: "asc" }, { createdAt: "asc" }] }
    }
  });
  if (!contract) notFound();
  const taskColumns = ["todo", "doing", "done"] as const;

  return (
    <>
      <PageHeader
        title={contract.tender.object}
        description={`Appalto da gara CIG ${contract.tender.cig}`}
        actionHref={`/contracts/${contract.id}/edit`}
        actionLabel="Modifica appalto"
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Panel className="p-4">
            <h2 className="mb-3 font-bold">Dati appalto</h2>
            <div className="grid gap-2 text-sm md:grid-cols-2">
              <div>Stato: {contractStatusLabels[contract.status]}</div>
              <div>Aggiudicazione: {formatDate(contract.awardedAt)}</div>
              <div>Importo aggiudicato: {formatCurrency(contract.awardedValue?.toString())}</div>
              <div>Inizio: {formatDate(contract.startedAt)}</div>
              <div>Fine: {formatDate(contract.endedAt)}</div>
              <div className="md:col-span-2">Note: {contract.notes ?? "-"}</div>
            </div>
          </Panel>

          <Panel className="p-4">
            <h2 className="mb-3 font-bold">RTP / RTI (da gara)</h2>
            <div className="grid gap-2 text-sm">
              <div>Nome: {contract.tender.grouping?.name ?? "-"}</div>
              <div className="text-muted">
                {contract.tender.grouping?.members.map((m) => m.operator?.displayName).filter(Boolean).join(", ") || "-"}
              </div>
            </div>
          </Panel>

          <Panel className="p-4">
            <h2 className="mb-3 font-bold">Kanban appalto</h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {taskColumns.map((status) => (
                <div key={status} className="rounded-lg border border-line bg-app p-3">
                  <div className="mb-3 text-sm font-bold">{contractTaskStatusLabels[status]}</div>
                  <div className="space-y-2">
                    {contract.tasks
                      .filter((task) => task.status === status)
                      .map((task) => (
                        <div key={task.id} className="rounded-lg border border-line bg-panel p-3 text-sm">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="truncate font-semibold">{task.title}</div>
                              <div className="mt-1 text-xs text-muted">
                                {contractTaskAreaLabels[task.area]} {task.dueDate ? `- ${formatDate(task.dueDate)}` : ""}
                              </div>
                            </div>
                            <form action={deleteContractTask.bind(null, task.id, contract.id)}>
                              <button className="rounded-md border border-line px-2 py-1 text-xs font-semibold" type="submit">
                                Elimina
                              </button>
                            </form>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <Badge tone={status === "done" ? "success" : status === "doing" ? "warning" : "neutral"}>
                              {contractTaskStatusLabels[status]}
                            </Badge>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1">
                            {taskColumns
                              .filter((nextStatus) => nextStatus !== status)
                              .map((nextStatus) => (
                                <form key={nextStatus} action={updateContractTaskStatus.bind(null, task.id, contract.id, nextStatus)}>
                                  <button className="rounded-md border border-line px-2 py-1 text-xs font-semibold" type="submit">
                                    {contractTaskStatusLabels[nextStatus]}
                                  </button>
                                </form>
                              ))}
                          </div>
                          {task.notes ? <div className="mt-2 text-xs text-muted">{task.notes}</div> : null}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-4">
            <h2 className="mb-3 font-bold">Milestone / SAL (light)</h2>
            {contract.milestones.length ? (
              <Table>
                <thead>
                  <tr className="text-left text-xs uppercase text-muted">
                    <th className="px-3 py-2">Titolo</th>
                    <th className="px-3 py-2">Data</th>
                    <th className="px-3 py-2">Importo</th>
                    <th className="px-3 py-2">Stato</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {contract.milestones.map((m) => (
                    <tr key={m.id}>
                      <td className="px-3 py-2 font-semibold">{m.title}</td>
                      <td className="px-3 py-2">{formatDate(m.plannedAt)}</td>
                      <td className="px-3 py-2">{formatCurrency(m.amount?.toString())}</td>
                      <td className="px-3 py-2">{contractMilestoneStatusLabels[m.status]}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">
                          {m.status !== "done" ? (
                            <form action={updateContractMilestoneStatus.bind(null, m.id, contract.id, "done")}>
                              <button className="rounded-md border border-line px-2 py-1 text-xs font-semibold" type="submit">
                                Completa
                              </button>
                            </form>
                          ) : null}
                          {m.status !== "cancelled" ? (
                            <form action={updateContractMilestoneStatus.bind(null, m.id, contract.id, "cancelled")}>
                              <button className="rounded-md border border-line px-2 py-1 text-xs font-semibold" type="submit">
                                Annulla
                              </button>
                            </form>
                          ) : null}
                          <form action={deleteContractMilestone.bind(null, m.id, contract.id)}>
                            <button className="rounded-md border border-line px-2 py-1 text-xs font-semibold" type="submit">
                              Elimina
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-sm text-muted">Nessuna milestone.</div>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel className="p-4">
            <h2 className="mb-3 font-bold">Aggiungi attivita</h2>
            <form action={addContractTask} className="grid gap-3">
              <input type="hidden" name="contractId" value={contract.id} />
              <Field label="Titolo">
                <input name="title" required placeholder="Es. Avvio cantiere e verbale consegna" />
              </Field>
              <Field label="Area">
                <select name="area" defaultValue="general">
                  {Object.entries(contractTaskAreaLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Stato">
                <select name="status" defaultValue="todo">
                  {Object.entries(contractTaskStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Scadenza">
                <input name="dueDate" type="date" />
              </Field>
              <Field label="Note">
                <textarea name="notes" />
              </Field>
              <button className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white" type="submit">
                Aggiungi
              </button>
            </form>
          </Panel>

          <Panel className="p-4">
            <h2 className="mb-3 font-bold">Aggiungi milestone / SAL</h2>
            <form action={addContractMilestone} className="grid gap-3">
              <input type="hidden" name="contractId" value={contract.id} />
              <Field label="Titolo">
                <input name="title" required placeholder="Es. SAL 1 / Certificato pagamento / Consegna elaborati" />
              </Field>
              <Field label="Data">
                <input name="plannedAt" type="date" />
              </Field>
              <Field label="Importo €">
                <input name="amount" inputMode="decimal" />
              </Field>
              <Field label="Stato">
                <select name="status" defaultValue="planned">
                  {Object.entries(contractMilestoneStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Note">
                <textarea name="notes" />
              </Field>
              <button className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white" type="submit">
                Aggiungi
              </button>
            </form>
          </Panel>

          <Panel className="p-4">
            <h2 className="mb-3 font-bold">Collegamenti</h2>
            <div className="grid gap-3">
              <Field label="Gara di origine">
                <Link className="font-semibold text-teal" href={`/tenders/${contract.tenderId}`}>
                  Apri gara (CIG {contract.tender.cig})
                </Link>
              </Field>
              <Field label="Documenti">
                <div className="space-y-2">
                  <div className="space-y-1 text-sm">
                    {contract.documents.length ? (
                      contract.documents.map((doc) => (
                        <div key={doc.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-app px-3 py-2">
                          <div className="min-w-0">
                            <div className="truncate font-semibold">{doc.title}</div>
                            <div className="text-xs text-muted">{doc.fileName ?? "-"}</div>
                          </div>
                          <div className="flex gap-2">
                            <Link className="rounded-md border border-line px-2 py-1 text-xs font-semibold" href={`/documents/${doc.id}/edit`}>
                              Apri
                            </Link>
                            <Link className="rounded-md border border-line px-2 py-1 text-xs font-semibold" href={`/documents/${doc.id}/download`}>
                              Scarica
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted">Nessun documento.</div>
                    )}
                  </div>

                  <form action={uploadContractDocument.bind(null, contract.id)} className="grid gap-2 rounded-lg border border-line bg-panel p-3">
                    <input type="hidden" name="contractId" value={contract.id} />
                    <Field label="Titolo">
                      <input name="title" placeholder="Es. Verbale consegna, PSC, SAL..." />
                    </Field>
                    <Field label="File">
                      <input name="file" type="file" required />
                    </Field>
                    <button className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white" type="submit">
                      Carica
                    </button>
                  </form>
                </div>
              </Field>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
