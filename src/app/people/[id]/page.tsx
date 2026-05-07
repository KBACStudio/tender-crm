import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { personRoleLabels } from "@/lib/labels";
import { deletePerson } from "@/server/actions";
import { DeleteButton, PageHeader, Panel, Table } from "@/components/ui";

export default async function PersonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = await prisma.person.findUnique({ where: { id }, include: { professional: true, operators: { include: { operator: true } } } });
  if (!person) notFound();
  return (
    <>
      <PageHeader title={`${person.lastName} ${person.firstName}`} description={person.professional ? "Persona e professionista" : "Persona"} actionHref={`/people/edit/${person.id}`} actionLabel="Modifica" />
      <div className="mb-4 flex justify-end"><DeleteButton action={deletePerson.bind(null, person.id)} /></div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel className="p-4"><h2 className="mb-3 font-bold">Dati base</h2><div className="grid gap-2 text-sm"><div>Email: {person.email ?? "-"}</div><div>Telefono: {person.phone ?? "-"}</div><div>Codice fiscale: {person.fiscalCode ?? "-"}</div><div>PEC: {person.pec ?? "-"}</div><div>Note: {person.notes ?? "-"}</div></div></Panel>
        <Panel className="p-4"><h2 className="mb-3 font-bold">Ruoli negli operatori</h2><Table><tbody className="divide-y divide-line">{person.operators.map((rel) => <tr key={rel.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/operators/${rel.operator.id}`}>{rel.operator.displayName}</Link></td><td className="px-3 py-2">{personRoleLabels[rel.role]}</td><td className="px-3 py-2">{rel.title ?? "-"}</td></tr>)}</tbody></Table></Panel>
      </div>
    </>
  );
}
