import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader, SearchBar, Table } from "@/components/ui";

export default async function ProfessionalsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const professionals = await prisma.professional.findMany({
    where: q ? { OR: [{ person: { firstName: { contains: q, mode: "insensitive" } } }, { person: { lastName: { contains: q, mode: "insensitive" } } }, { specialization: { contains: q, mode: "insensitive" } }] } : undefined,
    include: { person: true },
    orderBy: { person: { lastName: "asc" } }
  });
  return (
    <>
      <PageHeader title="Professionisti" description="Dati professionali dei consulenti esterni e dei tecnici iscritti ad albi." actionHref="/professionals/new" actionLabel="Nuovo professionista" />
      <SearchBar placeholder="Cerca per nome o specializzazione" />
      <Table><thead><tr className="text-left text-xs uppercase text-muted"><th className="px-3 py-2">Professionista</th><th className="px-3 py-2">Albo</th><th className="px-3 py-2">Specializzazione</th><th className="px-3 py-2">P.IVA</th></tr></thead><tbody className="divide-y divide-line">{professionals.map((p) => <tr key={p.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/professionals/${p.id}`}>{p.person.lastName} {p.person.firstName}</Link></td><td className="px-3 py-2">{p.register ?? "-"} {p.registerNumber ?? ""}</td><td className="px-3 py-2">{p.specialization ?? "-"}</td><td className="px-3 py-2">{p.vatNumber ?? "-"}</td></tr>)}</tbody></Table>
    </>
  );
}
