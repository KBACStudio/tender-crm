import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { personRoleLabels } from "@/lib/labels";
import { PageHeader, SearchBar, Table } from "@/components/ui";

export default async function PeoplePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const people = await prisma.person.findMany({
    where: q ? { OR: [{ firstName: { contains: q, mode: "insensitive" } }, { lastName: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] } : undefined,
    include: { professional: true, operators: { include: { operator: true } } },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }]
  });
  return (
    <>
      <PageHeader title="Persone" description="Referenti, amministratori, dipendenti e consulenti collegati agli operatori economici." actionHref="/people/new" actionLabel="Nuova persona" />
      <SearchBar placeholder="Cerca per nome, cognome o email" />
      <Table><thead><tr className="text-left text-xs uppercase text-muted"><th className="px-3 py-2">Persona</th><th className="px-3 py-2">Contatti</th><th className="px-3 py-2">Professionista</th><th className="px-3 py-2">Ruoli operatori</th></tr></thead><tbody className="divide-y divide-line">{people.map((person) => <tr key={person.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/people/${person.id}`}>{person.lastName} {person.firstName}</Link></td><td className="px-3 py-2">{person.email ?? person.phone ?? "-"}</td><td className="px-3 py-2">{person.professional ? "Si" : "No"}</td><td className="px-3 py-2">{person.operators.map((rel) => `${rel.operator.displayName} (${personRoleLabels[rel.role]})`).join(", ") || "-"}</td></tr>)}</tbody></Table>
    </>
  );
}
