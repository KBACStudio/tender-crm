import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { tenderOutcomeLabels } from "@/lib/labels";
import { formatCurrency, formatDate } from "@/lib/format";
import { PageHeader, SearchBar, Table } from "@/components/ui";

export default async function TendersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const tenders = await prisma.tender.findMany({
    where: q ? { OR: [{ cig: { contains: q, mode: "insensitive" } }, { object: { contains: q, mode: "insensitive" } }, { place: { contains: q, mode: "insensitive" } }, { contractingBody: { contains: q, mode: "insensitive" } }, { workRequirements: { some: { workId: { contains: q, mode: "insensitive" } } } }, { soaRequirements: { some: { category: { contains: q, mode: "insensitive" } } } }] } : undefined,
    include: { grouping: true, workRequirements: true, soaRequirements: true },
    orderBy: { deadline: "asc" }
  });
  return <><PageHeader title="Gare" description="Gare d'appalto, requisiti ID opera/SOA, esiti e RTI creato dentro la gara." actionHref="/tenders/new" actionLabel="Nuova gara" /><SearchBar placeholder="Cerca per CIG, luogo, stazione appaltante, ID opera o SOA" /><Table><thead><tr className="text-left text-xs uppercase text-muted"><th className="px-3 py-2">Oggetto</th><th className="px-3 py-2">CIG</th><th className="px-3 py-2">ID opera / SOA</th><th className="px-3 py-2">Valore</th><th className="px-3 py-2">Scadenza</th><th className="px-3 py-2">Esito</th><th className="px-3 py-2">RTI</th></tr></thead><tbody className="divide-y divide-line">{tenders.map((t) => <tr key={t.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/tenders/${t.id}`}>{t.object}</Link><div className="text-xs text-muted">{t.contractingBody ?? "-"}</div></td><td className="px-3 py-2">{t.cig}</td><td className="px-3 py-2">{t.workRequirements.map((w) => w.workId).join(", ") || "-"}<div className="text-xs text-muted">{t.soaRequirements.map((s) => `${s.category} ${s.ranking ?? ""}`).join(", ")}</div></td><td className="px-3 py-2">{formatCurrency(t.value?.toString())}</td><td className="px-3 py-2">{formatDate(t.deadline)}</td><td className="px-3 py-2">{tenderOutcomeLabels[t.outcome]}</td><td className="px-3 py-2">{t.grouping?.name ?? "-"}</td></tr>)}</tbody></Table></>;
}
