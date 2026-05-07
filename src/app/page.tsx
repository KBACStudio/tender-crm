import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { expirationStatus, formatCurrency, formatDate } from "@/lib/format";
import { designLevelLabels, tenderOutcomeLabels, tenderTaskAreaLabels, tenderTaskStatusLabels } from "@/lib/labels";
import { Badge, Kpi, Panel, Table } from "@/components/ui";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q?.trim();
  const today = new Date();
  // Server-rendered operational window.
  // eslint-disable-next-line react-hooks/purity
  const in30Days = new Date(Date.now() + 30 * 86_400_000);

  const [operatorsCount, activeTenders, dueTenders, openTasks, nextTasks, operators, services, certifications, soaEntries, tenders] = await Promise.all([
    prisma.economicOperator.count(),
    prisma.tender.count({ where: { outcome: { in: ["draft", "submitted", "unknown"] } } }),
    prisma.tender.findMany({ where: { deadline: { gte: today, lte: in30Days } }, orderBy: { deadline: "asc" }, take: 8, include: { grouping: { include: { members: { include: { operator: true } } } } } }),
    prisma.tenderTask.count({ where: { status: { not: "done" } } }),
    prisma.tenderTask.findMany({ where: { status: { not: "done" } }, orderBy: { dueDate: "asc" }, take: 10, include: { tender: true, operator: true } }),
    query ? prisma.economicOperator.findMany({ where: { OR: [{ displayName: { contains: query, mode: "insensitive" } }, { tags: { contains: query, mode: "insensitive" } }] }, include: { revenues: { orderBy: { year: "desc" }, take: 3 } }, take: 20 }) : [],
    query ? prisma.service.findMany({
      where: { OR: [{ title: { contains: query, mode: "insensitive" } }, { client: { contains: query, mode: "insensitive" } }, { workItems: { some: { OR: [{ workId: { contains: query, mode: "insensitive" } }, { workCategory: { contains: query, mode: "insensitive" } }] } } }, { assignments: { some: { operator: { displayName: { contains: query, mode: "insensitive" } } } } }] },
      include: { workItems: true, levels: true, assignments: { include: { operator: true } } },
      take: 30
    }) : [],
    query ? prisma.certification.findMany({ where: { OR: [{ type: { contains: query, mode: "insensitive" } }, { number: { contains: query, mode: "insensitive" } }, { operator: { displayName: { contains: query, mode: "insensitive" } } }] }, include: { operator: true }, take: 30 }) : [],
    query ? prisma.soaCertificate.findMany({ where: { OR: [{ certificateNumber: { contains: query, mode: "insensitive" } }, { qualifications: { some: { OR: [{ category: { contains: query, mode: "insensitive" } }, { ranking: { contains: query, mode: "insensitive" } }] } } }, { company: { name: { contains: query, mode: "insensitive" } } }] }, include: { company: true, qualifications: true }, take: 30 }) : [],
    query ? prisma.tender.findMany({
      where: { OR: [{ cig: { contains: query, mode: "insensitive" } }, { object: { contains: query, mode: "insensitive" } }, { contractingBody: { contains: query, mode: "insensitive" } }, { workRequirements: { some: { workId: { contains: query, mode: "insensitive" } } } }, { soaRequirements: { some: { category: { contains: query, mode: "insensitive" } } } }, { grouping: { members: { some: { operator: { displayName: { contains: query, mode: "insensitive" } } } } } }] },
      include: { workRequirements: true, soaRequirements: true, grouping: { include: { members: { include: { operator: true } } } } },
      take: 30
    }) : []
  ]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-normal text-ink">Cruscotto gare</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted">Scadenze, taccuino operativo e ricerca requisiti in un unico punto di lavoro.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="inline-flex items-center gap-2 rounded-lg border border-line bg-panel px-3 py-2 text-sm font-semibold" href="/operators/new"><Plus className="h-4 w-4" />Operatore</Link>
          <Link className="inline-flex items-center gap-2 rounded-lg bg-teal px-3 py-2 text-sm font-semibold text-white" href="/tenders/new"><Plus className="h-4 w-4" />Gara</Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Kpi label="Operatori nel faldone" value={operatorsCount} />
        <Kpi label="Gare attive" value={activeTenders} />
        <Kpi label="Attivita aperte" value={openTasks} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel className="p-4">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">Scadenze gara</h2><Link className="text-sm font-semibold text-teal" href="/calendar">Calendario</Link></div>
          <Table><tbody className="divide-y divide-line">{dueTenders.map((tender) => <tr key={tender.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/tenders/${tender.id}`}>{tender.object}</Link><div className="text-xs text-muted">CIG {tender.cig} - {tenderOutcomeLabels[tender.outcome]}</div></td><td className="px-3 py-2">{formatDate(tender.deadline)}</td><td className="px-3 py-2">{tender.grouping?.members.map((member) => member.operator?.displayName).filter(Boolean).join(", ") || "-"}</td></tr>)}</tbody></Table>
        </Panel>
        <Panel className="p-4">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">Taccuino operativo</h2><Link className="text-sm font-semibold text-teal" href="/tenders">Kanban gare</Link></div>
          <Table><tbody className="divide-y divide-line">{nextTasks.map((task) => <tr key={task.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/tenders/${task.tender.id}`}>{task.title}</Link><div className="text-xs text-muted">{task.tender.object} - {task.operator?.displayName ?? "Generale"}</div></td><td className="px-3 py-2">{tenderTaskAreaLabels[task.area]}</td><td className="px-3 py-2"><Badge tone={task.status === "done" ? "success" : task.status === "doing" ? "warning" : "neutral"}>{tenderTaskStatusLabels[task.status]}</Badge></td><td className="px-3 py-2">{formatDate(task.dueDate)}</td></tr>)}</tbody></Table>
        </Panel>
      </div>

      <Panel className="mt-6 p-4">
        <h2 className="mb-3 font-bold">Ricerca requisiti</h2>
        <form className="mb-4 flex flex-col gap-3 md:flex-row">
          <input name="q" defaultValue={query ?? ""} placeholder="Cerca ID opera, E.22, IA.03, OG1 VII, ISO 9001, CIG, operatore..." />
          <button className="rounded-lg bg-teal px-5 py-2 text-sm font-semibold text-white" type="submit">Cerca</button>
        </form>
        {!query ? <div className="text-sm text-muted">Inserisci una chiave per interrogare operatori, servizi, certificazioni, SOA e gare.</div> : (
          <div className="space-y-5">
            <Table><thead><tr className="text-left text-xs uppercase text-muted"><th className="px-3 py-2">Operatori</th><th className="px-3 py-2">Tipo</th><th className="px-3 py-2">Fatturati</th></tr></thead><tbody className="divide-y divide-line">{operators.map((operator) => <tr key={operator.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/operators/${operator.id}`}>{operator.displayName}</Link><div className="text-xs text-muted">{operator.tags ?? "-"}</div></td><td className="px-3 py-2">{operator.operatorType === "company" ? "Societa" : "Libero professionista"}</td><td className="px-3 py-2">{operator.revenues.map((revenue) => `${revenue.year}: ${formatCurrency(revenue.revenue.toString())}`).join(" - ") || "-"}</td></tr>)}</tbody></Table>
            <Table><thead><tr className="text-left text-xs uppercase text-muted"><th className="px-3 py-2">Servizi e ID opera</th><th className="px-3 py-2">Categorie / valori</th><th className="px-3 py-2">Livelli</th><th className="px-3 py-2">Parcella</th></tr></thead><tbody className="divide-y divide-line">{services.map((service) => <tr key={service.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/services/${service.id}`}>{service.title}</Link><div className="text-xs text-muted">{service.assignments.map((assignment) => assignment.operator?.displayName).filter(Boolean).join(", ") || "-"}</div></td><td className="px-3 py-2">{service.workItems.map((work) => `${work.workId} (${formatCurrency(work.workValue?.toString())}, ${work.sharePercent?.toString() ?? "-"}%)`).join(", ") || "-"}</td><td className="px-3 py-2">{service.levels.map((level) => designLevelLabels[level.level]).join(", ") || "-"}</td><td className="px-3 py-2">{formatCurrency(service.feeAmount?.toString())}</td></tr>)}</tbody></Table>
            <Table><thead><tr className="text-left text-xs uppercase text-muted"><th className="px-3 py-2">Certificazioni</th><th className="px-3 py-2">Operatore</th><th className="px-3 py-2">Scadenza</th><th className="px-3 py-2">Stato</th></tr></thead><tbody className="divide-y divide-line">{certifications.map((certification) => { const status = expirationStatus(certification.expiresAt); return <tr key={certification.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/certifications/${certification.id}`}>{certification.type}</Link></td><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/operators/${certification.operator.id}`}>{certification.operator.displayName}</Link></td><td className="px-3 py-2">{formatDate(certification.expiresAt)}</td><td className="px-3 py-2"><Badge tone={status.tone}>{status.label}</Badge></td></tr>; })}</tbody></Table>
            <Table><thead><tr className="text-left text-xs uppercase text-muted"><th className="px-3 py-2">SOA</th><th className="px-3 py-2">Impresa</th><th className="px-3 py-2">Classifiche</th><th className="px-3 py-2">Scadenza</th></tr></thead><tbody className="divide-y divide-line">{soaEntries.map((soa) => { const status = expirationStatus(soa.expiresAt); return <tr key={soa.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/soa/${soa.id}`}>{soa.certificateNumber ?? "SOA"}</Link></td><td className="px-3 py-2">{soa.company.name}</td><td className="px-3 py-2">{soa.qualifications.map((qualification) => `${qualification.category} ${qualification.ranking}`).join(", ")}</td><td className="px-3 py-2">{formatDate(soa.expiresAt)} <Badge tone={status.tone}>{status.label}</Badge></td></tr>; })}</tbody></Table>
            <Table><thead><tr className="text-left text-xs uppercase text-muted"><th className="px-3 py-2">Gare</th><th className="px-3 py-2">ID opera</th><th className="px-3 py-2">SOA</th><th className="px-3 py-2">RTI</th></tr></thead><tbody className="divide-y divide-line">{tenders.map((tender) => <tr key={tender.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/tenders/${tender.id}`}>{tender.object}</Link><div className="text-xs text-muted">CIG {tender.cig} - {tenderOutcomeLabels[tender.outcome]}</div></td><td className="px-3 py-2">{tender.workRequirements.map((work) => work.workId).join(", ") || "-"}</td><td className="px-3 py-2">{tender.soaRequirements.map((soa) => `${soa.category} ${soa.ranking ?? ""}`).join(", ") || "-"}</td><td className="px-3 py-2">{tender.grouping?.members.map((member) => member.operator?.displayName).filter(Boolean).join(", ") || "-"}</td></tr>)}</tbody></Table>
          </div>
        )}
      </Panel>
    </>
  );
}
