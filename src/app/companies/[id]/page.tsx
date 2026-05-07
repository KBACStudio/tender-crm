import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { designLevelLabels, groupRoleLabels, personRoleLabels, subjectTypeLabels } from "@/lib/labels";
import { expirationStatus, formatCurrency, formatDate } from "@/lib/format";
import { addPersonCompany, deleteCompany } from "@/server/actions";
import { Badge, DeleteButton, Field, PageHeader, Panel, Table } from "@/components/ui";

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [company, people] = await Promise.all([
    prisma.company.findUnique({
      where: { id },
      include: {
        operator: {
          include: {
            revenues: { orderBy: { year: "desc" } },
            services: { include: { service: { include: { workItems: true, levels: true } } } },
            groupMembers: { include: { grouping: true } }
          }
        },
        people: { include: { person: true } },
        certifications: true,
        soaCertificates: { include: { qualifications: true } }
      }
    }),
    prisma.person.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] })
  ]);
  if (!company) notFound();
  return (
    <>
      <PageHeader title={company.name} description={subjectTypeLabels[company.subjectType]} actionHref={`/companies/edit/${company.id}`} actionLabel="Modifica" />
      <div className="mb-4 flex justify-end"><DeleteButton action={deleteCompany.bind(null, company.id)} /></div>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Panel className="p-4"><h2 className="mb-3 font-bold">Dati base</h2><dl className="grid gap-2 text-sm md:grid-cols-2"><div>Email: {company.email ?? "-"}</div><div>PEC: {company.pec ?? "-"}</div><div>Telefono: {company.phone ?? "-"}</div><div>P.IVA: {company.vatNumber ?? "-"}</div><div>Città: {company.city ?? "-"}</div><div>Indirizzo: {company.address ?? "-"}</div></dl>{company.notes ? <p className="mt-3 text-sm text-muted">{company.notes}</p> : null}</Panel>
          <Panel className="p-4"><h2 className="mb-3 font-bold">Persone collegate</h2><Table><tbody className="divide-y divide-line">{company.people.map((r) => <tr key={r.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/people/${r.person.id}`}>{r.person.lastName} {r.person.firstName}</Link></td><td className="px-3 py-2">{personRoleLabels[r.role]}</td><td className="px-3 py-2">{r.title ?? "-"}</td></tr>)}</tbody></Table></Panel>
          <Panel className="p-4"><h2 className="mb-3 font-bold">Certificazioni</h2><Table><tbody className="divide-y divide-line">{company.certifications.map((c) => { const s = expirationStatus(c.expiresAt); return <tr key={c.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/certifications/${c.id}`}>{c.type}</Link></td><td className="px-3 py-2">{formatDate(c.expiresAt)}</td><td className="px-3 py-2"><Badge tone={s.tone}>{s.label}</Badge></td></tr>; })}</tbody></Table></Panel>
          <Panel className="p-4"><h2 className="mb-3 font-bold">SOA</h2><Table><tbody className="divide-y divide-line">{company.soaCertificates.map((s) => { const status = expirationStatus(s.expiresAt); return <tr key={s.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/soa/${s.id}`}>{s.qualifications.map((q) => `${q.category} ${q.ranking}`).join(", ")}</Link></td><td className="px-3 py-2">{formatDate(s.expiresAt)}</td><td className="px-3 py-2"><Badge tone={status.tone}>{status.label}</Badge></td></tr>; })}</tbody></Table></Panel>
          <Panel className="p-4"><h2 className="mb-3 font-bold">Fatturato storico</h2><Table><tbody className="divide-y divide-line">{company.operator?.revenues.map((r) => <tr key={r.id}><td className="px-3 py-2">{r.year}</td><td className="px-3 py-2">{formatCurrency(r.revenue.toString())}</td><td className="px-3 py-2">{r.source ?? "-"}</td></tr>)}</tbody></Table></Panel>
          <Panel className="p-4"><h2 className="mb-3 font-bold">Servizi</h2><Table><tbody className="divide-y divide-line">{company.operator?.services.map((a) => <tr key={a.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/services/${a.service.id}`}>{a.service.title}</Link></td><td className="px-3 py-2">{a.service.levels.map((l) => designLevelLabels[l.level]).join(", ") || "-"}</td><td className="px-3 py-2">{a.service.workItems.map((w) => w.workId).join(", ") || "-"}</td></tr>)}</tbody></Table></Panel>
          <Panel className="p-4"><h2 className="mb-3 font-bold">Partecipazioni RTI</h2><Table><tbody className="divide-y divide-line">{company.operator?.groupMembers.map((m) => <tr key={m.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/groups/${m.grouping.id}`}>{m.grouping.name}</Link></td><td className="px-3 py-2">{groupRoleLabels[m.role]}</td></tr>)}</tbody></Table></Panel>
        </div>
        <Panel className="p-4">
          <h2 className="mb-3 font-bold">Collega persona</h2>
          <form action={addPersonCompany} className="grid gap-3">
            <input type="hidden" name="companyId" value={company.id} />
            <Field label="Persona"><select name="personId" required><option value="">Seleziona</option>{people.map((p) => <option key={p.id} value={p.id}>{p.lastName} {p.firstName}</option>)}</select></Field>
            <Field label="Ruolo"><select name="role">{Object.entries(personRoleLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
            <Field label="Qualifica"><input name="title" /></Field>
            <Field label="Note"><textarea name="notes" /></Field>
            <button className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white" type="submit">Collega</button>
          </form>
        </Panel>
      </div>
    </>
  );
}
