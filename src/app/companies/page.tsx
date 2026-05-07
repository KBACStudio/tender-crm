import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { subjectTypeLabels } from "@/lib/labels";
import { PageHeader, SearchBar, Table } from "@/components/ui";

export default async function CompaniesPage({ searchParams }: { searchParams: Promise<{ q?: string; subjectType?: string }> }) {
  const params = await searchParams;
  const q = params.q?.trim();
  const companies = await prisma.company.findMany({
    where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { city: { contains: q, mode: "insensitive" } }, { vatNumber: { contains: q } }] } : undefined,
    orderBy: { name: "asc" },
    include: { people: true, certifications: true, soaCertificates: true }
  });
  return (
    <>
      <PageHeader title="Società" description="Anagrafica soggetti, imprese edili, società di ingegneria e studi professionali." actionHref="/companies/new" actionLabel="Nuova società" />
      <SearchBar placeholder="Cerca per ragione sociale, città o P.IVA" />
      <Table>
        <thead><tr className="text-left text-xs uppercase text-muted"><th className="px-3 py-2">Società</th><th className="px-3 py-2">Tipo</th><th className="px-3 py-2">Città</th><th className="px-3 py-2">Persone</th><th className="px-3 py-2">Scadenze</th></tr></thead>
        <tbody className="divide-y divide-line">{companies.map((c) => <tr key={c.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/companies/${c.id}`}>{c.name}</Link><div className="text-xs text-muted">{c.email ?? c.pec ?? "-"}</div></td><td className="px-3 py-2">{subjectTypeLabels[c.subjectType]}</td><td className="px-3 py-2">{c.city ?? "-"}</td><td className="px-3 py-2">{c.people.length}</td><td className="px-3 py-2">{c.certifications.length + c.soaCertificates.length}</td></tr>)}</tbody>
      </Table>
    </>
  );
}
