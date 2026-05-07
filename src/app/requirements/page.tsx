import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { expirationStatus, formatCurrency, formatDate } from "@/lib/format";
import { designLevelLabels, tenderOutcomeLabels } from "@/lib/labels";
import { Badge, PageHeader, Panel, Table } from "@/components/ui";

export default async function SearchDashboardPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q?.trim();

  const [operators, services, certifications, soaEntries, tenders] = query
    ? await Promise.all([
        prisma.economicOperator.findMany({
          where: { displayName: { contains: query, mode: "insensitive" } },
          include: { company: true, professional: { include: { person: true } }, revenues: { orderBy: { year: "desc" }, take: 3 } },
          take: 20
        }),
        prisma.service.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { client: { contains: query, mode: "insensitive" } },
              { workItems: { some: { OR: [{ workId: { contains: query, mode: "insensitive" } }, { workCategory: { contains: query, mode: "insensitive" } }] } } },
              { assignments: { some: { operator: { displayName: { contains: query, mode: "insensitive" } } } } }
            ]
          },
          include: { workItems: true, levels: true, assignments: { include: { operator: true } } },
          take: 30
        }),
        prisma.certification.findMany({
          where: { OR: [{ type: { contains: query, mode: "insensitive" } }, { number: { contains: query, mode: "insensitive" } }, { operator: { displayName: { contains: query, mode: "insensitive" } } }] },
          include: { operator: true },
          take: 30
        }),
        prisma.soaCertificate.findMany({
          where: { OR: [{ certificateNumber: { contains: query, mode: "insensitive" } }, { qualifications: { some: { OR: [{ category: { contains: query, mode: "insensitive" } }, { ranking: { contains: query, mode: "insensitive" } }] } } }, { company: { name: { contains: query, mode: "insensitive" } } }] },
          include: { company: true, qualifications: true },
          take: 30
        }),
        prisma.tender.findMany({
          where: {
            OR: [
              { cig: { contains: query, mode: "insensitive" } },
              { object: { contains: query, mode: "insensitive" } },
              { contractingBody: { contains: query, mode: "insensitive" } },
              { workRequirements: { some: { workId: { contains: query, mode: "insensitive" } } } },
              { soaRequirements: { some: { category: { contains: query, mode: "insensitive" } } } },
              { grouping: { members: { some: { operator: { displayName: { contains: query, mode: "insensitive" } } } } } }
            ]
          },
          include: { workRequirements: true, soaRequirements: true, grouping: { include: { members: { include: { operator: true } } } } },
          take: 30
        })
      ])
    : [[], [], [], [], []];

  return (
    <>
      <PageHeader title="Ricerca operativa" description="Cerca ID opera, SOA, certificazioni, CIG o operatori economici. I risultati si popolano solo in base alla richiesta." />
      <form className="mb-6 flex flex-col gap-3 rounded-lg border border-line bg-panel p-4 shadow-soft md:flex-row">
        <input name="q" defaultValue={query ?? ""} placeholder="Es. OP-2026-002, OG3, ISO 9001, B123456789, Prisma" />
        <button className="rounded-lg bg-teal px-5 py-2 text-sm font-semibold text-white" type="submit">Cerca</button>
      </form>
      {!query ? (
        <Panel className="p-5 text-sm text-muted">Inserisci una chiave di ricerca per interrogare operatori, servizi, certificazioni, SOA e gare.</Panel>
      ) : (
        <div className="space-y-6">
          <Panel className="p-4"><h2 className="mb-3 font-bold">Operatori economici</h2><Table><tbody className="divide-y divide-line">{operators.map((o) => <tr key={o.id}><td className="px-3 py-2 font-semibold">{o.displayName}</td><td className="px-3 py-2">{o.operatorType === "company" ? "Societa" : "Libero professionista"}</td><td className="px-3 py-2">{o.revenues.map((r) => `${r.year}: ${formatCurrency(r.revenue.toString())}`).join(" - ") || "-"}</td></tr>)}</tbody></Table></Panel>
          <Panel className="p-4"><h2 className="mb-3 font-bold">Servizi e ID opera</h2><Table><tbody className="divide-y divide-line">{services.map((s) => <tr key={s.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/services/${s.id}`}>{s.title}</Link><div className="text-xs text-muted">{s.assignments.map((a) => a.operator?.displayName).filter(Boolean).join(", ") || "-"}</div></td><td className="px-3 py-2">{s.workItems.map((w) => `${w.workId} (${formatCurrency(w.workValue?.toString())}, ${w.sharePercent?.toString() ?? "-"}%)`).join(", ") || "-"}</td><td className="px-3 py-2">{s.levels.map((l) => designLevelLabels[l.level]).join(", ") || "-"}</td><td className="px-3 py-2">Parcella {formatCurrency(s.feeAmount?.toString())}</td></tr>)}</tbody></Table></Panel>
          <Panel className="p-4"><h2 className="mb-3 font-bold">Certificazioni</h2><Table><tbody className="divide-y divide-line">{certifications.map((c) => { const status = expirationStatus(c.expiresAt); return <tr key={c.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/certifications/${c.id}`}>{c.type}</Link></td><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/operators/${c.operator.id}`}>{c.operator.displayName}</Link></td><td className="px-3 py-2">{formatDate(c.expiresAt)}</td><td className="px-3 py-2"><Badge tone={status.tone}>{status.label}</Badge></td></tr>; })}</tbody></Table></Panel>
          <Panel className="p-4"><h2 className="mb-3 font-bold">SOA</h2><Table><tbody className="divide-y divide-line">{soaEntries.map((s) => { const status = expirationStatus(s.expiresAt); return <tr key={s.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/soa/${s.id}`}>{s.certificateNumber ?? "SOA"}</Link></td><td className="px-3 py-2">{s.company.name}</td><td className="px-3 py-2">{s.qualifications.map((q) => `${q.category} ${q.ranking}`).join(", ")}</td><td className="px-3 py-2">{formatDate(s.expiresAt)} <Badge tone={status.tone}>{status.label}</Badge></td></tr>; })}</tbody></Table></Panel>
          <Panel className="p-4"><h2 className="mb-3 font-bold">Gare e raggruppamenti</h2><Table><tbody className="divide-y divide-line">{tenders.map((t) => <tr key={t.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/tenders/${t.id}`}>{t.object}</Link><div className="text-xs text-muted">CIG {t.cig} - {tenderOutcomeLabels[t.outcome]}</div></td><td className="px-3 py-2">ID opera: {t.workRequirements.map((w) => w.workId).join(", ") || "-"}</td><td className="px-3 py-2">SOA: {t.soaRequirements.map((s) => `${s.category} ${s.ranking ?? ""}`).join(", ") || "-"}</td><td className="px-3 py-2">{t.grouping?.members.map((m) => m.operator?.displayName).filter(Boolean).join(", ") || "-"}</td></tr>)}</tbody></Table></Panel>
        </div>
      )}
    </>
  );
}
