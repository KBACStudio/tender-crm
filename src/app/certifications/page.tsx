import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { expirationStatus, formatDate } from "@/lib/format";
import { Badge, PageHeader, SearchBar, Table } from "@/components/ui";

export default async function CertificationsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const items = await prisma.certification.findMany({
    where: q ? { OR: [{ type: { contains: q, mode: "insensitive" } }, { operator: { displayName: { contains: q, mode: "insensitive" } } }] } : undefined,
    include: { operator: true },
    orderBy: { expiresAt: "asc" }
  });

  return (
    <>
      <PageHeader title="Certificazioni" description="Certificazioni degli operatori economici con evidenza delle scadenze." actionHref="/certifications/new" actionLabel="Nuova certificazione" />
      <SearchBar placeholder="Cerca per tipo o operatore" />
      <Table>
        <thead><tr className="text-left text-xs uppercase text-muted"><th className="px-3 py-2">Tipo</th><th className="px-3 py-2">Operatore</th><th className="px-3 py-2">Numero</th><th className="px-3 py-2">Scadenza</th><th className="px-3 py-2">Stato</th></tr></thead>
        <tbody className="divide-y divide-line">
          {items.map((item) => {
            const status = expirationStatus(item.expiresAt);
            return <tr key={item.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/certifications/${item.id}`}>{item.type}</Link></td><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/operators/${item.operator.id}`}>{item.operator.displayName}</Link></td><td className="px-3 py-2">{item.number ?? "-"}</td><td className="px-3 py-2">{formatDate(item.expiresAt)}</td><td className="px-3 py-2"><Badge tone={status.tone}>{status.label}</Badge></td></tr>;
          })}
        </tbody>
      </Table>
    </>
  );
}
