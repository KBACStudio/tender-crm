import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { designLevelLabels } from "@/lib/labels";
import { formatCurrency, formatDate } from "@/lib/format";
import { PageHeader, SearchBar, Table } from "@/components/ui";

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const items = await prisma.service.findMany({
    where: q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { client: { contains: q, mode: "insensitive" } }, { workItems: { some: { OR: [{ workId: { contains: q, mode: "insensitive" } }, { workCategory: { contains: q, mode: "insensitive" } }] } } }, { assignments: { some: { operator: { displayName: { contains: q, mode: "insensitive" } } } } }] } : undefined,
    include: { assignments: { include: { operator: true } }, workItems: true, levels: true },
    orderBy: { createdAt: "desc" }
  });
  return <><PageHeader title="Servizi svolti" description="Referenze e incarichi svolti da operatori economici, con ID opera multipli, quote e livelli multipli." actionHref="/services/new" actionLabel="Nuovo servizio" /><SearchBar placeholder="Cerca per oggetto, operatore, ID opera o categoria" /><Table><thead><tr className="text-left text-xs uppercase text-muted"><th className="px-3 py-2">Oggetto</th><th className="px-3 py-2">Operatore</th><th className="px-3 py-2">Livelli</th><th className="px-3 py-2">ID opera</th><th className="px-3 py-2">Lavori</th><th className="px-3 py-2">Parcella</th></tr></thead><tbody className="divide-y divide-line">{items.map((s) => <tr key={s.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/services/${s.id}`}>{s.title}</Link><div className="text-xs text-muted">{s.client ?? "-"} · {formatDate(s.startedAt)} - {formatDate(s.endedAt)}</div></td><td className="px-3 py-2">{s.assignments.map((a) => a.operator?.displayName).filter(Boolean).join(", ") || "-"}</td><td className="px-3 py-2">{s.levels.map((l) => designLevelLabels[l.level]).join(", ") || "-"}</td><td className="px-3 py-2">{s.workItems.map((w) => w.workId).join(", ") || "-"}</td><td className="px-3 py-2">{formatCurrency(s.workItems.reduce((sum, w) => sum + Number(w.workValue ?? 0), 0))}</td><td className="px-3 py-2">{formatCurrency(s.feeAmount?.toString())}</td></tr>)}</tbody></Table></>;
}
