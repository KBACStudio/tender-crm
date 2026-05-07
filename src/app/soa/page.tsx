import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { expirationStatus, formatDate } from "@/lib/format";
import { Badge, PageHeader, SearchBar, Table } from "@/components/ui";

export default async function SoaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const items = await prisma.soaCertificate.findMany({
    where: q ? { OR: [{ certificateNumber: { contains: q, mode: "insensitive" } }, { qualifications: { some: { category: { contains: q, mode: "insensitive" } } } }, { company: { name: { contains: q, mode: "insensitive" } } }] } : undefined,
    include: { company: true, qualifications: true },
    orderBy: { expiresAt: "asc" }
  });
  return <><PageHeader title="SOA" description="Attestazioni SOA per imprese edili, con piu categorie e classifiche nello stesso certificato." actionHref="/soa/new" actionLabel="Nuova SOA" /><SearchBar placeholder="Cerca per categoria o societa" /><Table><thead><tr className="text-left text-xs uppercase text-muted"><th className="px-3 py-2">Attestazione</th><th className="px-3 py-2">Categorie</th><th className="px-3 py-2">Societa</th><th className="px-3 py-2">Scadenza</th><th className="px-3 py-2">Stato</th></tr></thead><tbody className="divide-y divide-line">{items.map((i) => { const s = expirationStatus(i.expiresAt); return <tr key={i.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/soa/${i.id}`}>{i.certificateNumber ?? "SOA"}</Link></td><td className="px-3 py-2">{i.qualifications.map((q) => `${q.category} ${q.ranking}`).join(", ") || "-"}</td><td className="px-3 py-2">{i.company.name}</td><td className="px-3 py-2">{formatDate(i.expiresAt)}</td><td className="px-3 py-2"><Badge tone={s.tone}>{s.label}</Badge></td></tr>; })}</tbody></Table></>;
}
