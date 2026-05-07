import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { expirationStatus, formatCurrency, formatDate } from "@/lib/format";
import { designLevelLabels, groupRoleLabels, personRoleLabels, subjectTypeLabels, tenderOutcomeLabels } from "@/lib/labels";
import { addRevenueHistory, deleteEconomicOperator } from "@/server/actions";
import { Badge, DeleteButton, Field, PageHeader, Panel, Table } from "@/components/ui";

export default async function OperatorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const operator = await prisma.economicOperator.findUnique({
    where: { id },
    include: {
      revenues: { orderBy: { year: "desc" } },
      company: { include: { people: { include: { person: true } }, certifications: true, soaCertificates: { include: { qualifications: true } } } },
      professional: { include: { person: true } },
      people: { include: { person: true }, orderBy: { role: "asc" } },
      certifications: { orderBy: { expiresAt: "asc" } },
      services: { include: { service: { include: { workItems: true, levels: true } } } },
      groupMembers: { include: { grouping: { include: { tender: true } } } }
    }
  });
  if (!operator) notFound();

  const company = operator.company;
  const professionalPerson = operator.professional?.person;
  const isCompany = operator.operatorType === "company" && company;

  return (
    <>
      <PageHeader title={operator.displayName} description={isCompany ? subjectTypeLabels[company.subjectType] : "Libero professionista"} />
      <div className="mb-5 flex flex-col gap-3 rounded-lg border border-line bg-panel p-3 shadow-soft xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-xs font-bold uppercase text-muted">Azioni fascicolo</span>
          <Link className="rounded-lg border border-line px-3 py-2 text-sm font-semibold" href={`/people/new?operatorId=${operator.id}`}>Aggiungi persona</Link>
          <Link className="rounded-lg border border-line px-3 py-2 text-sm font-semibold" href={`/certifications/new?operatorId=${operator.id}`}>Aggiungi certificazione</Link>
          {isCompany ? <Link className="rounded-lg border border-line px-3 py-2 text-sm font-semibold" href="/soa/new">Aggiungi SOA</Link> : null}
          <Link className="rounded-lg border border-line px-3 py-2 text-sm font-semibold" href="/services/new">Aggiungi servizio</Link>
          <a className="rounded-lg border border-line px-3 py-2 text-sm font-semibold" href="#fatturato">Aggiorna fatturato</a>
        </div>
        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          <Link className="rounded-lg border border-line px-3 py-2 text-sm font-semibold" href={`/operators/edit/${operator.id}`}>Modifica dati</Link>
          <DeleteButton action={deleteEconomicOperator.bind(null, operator.id)} message={`Eliminare definitivamente ${operator.displayName}?`} />
        </div>
      </div>

      <div className="space-y-6">
        <Panel className="p-4">
          <h2 className="mb-3 font-bold">Dati generali</h2>
          <div className="grid gap-2 text-sm md:grid-cols-2">
            <div>P.IVA: {company?.vatNumber ?? operator.professional?.vatNumber ?? "-"}</div>
            <div>CF: {company?.fiscalCode ?? professionalPerson?.fiscalCode ?? "-"}</div>
            <div>Email: {company?.email ?? professionalPerson?.email ?? "-"}</div>
            <div>PEC: {company?.pec ?? professionalPerson?.pec ?? "-"}</div>
            <div>Telefono: {company?.phone ?? professionalPerson?.phone ?? "-"}</div>
            <div>Avvalimento: {operator.availableForAvvalimento ? "Disponibile" : "Non indicato"}</div>
            <div className="md:col-span-2">Tag: {operator.tags ?? "-"}</div>
            <div className="md:col-span-2">Note: {operator.notes ?? company?.notes ?? operator.professional?.notes ?? "-"}</div>
          </div>
        </Panel>

        {professionalPerson ? (
          <Panel className="p-4">
            <h2 className="mb-3 font-bold">Dati professionali</h2>
            <div className="grid gap-2 text-sm md:grid-cols-2">
              <div>Nascita: {professionalPerson.birthPlace ?? "-"} {formatDate(professionalPerson.birthDate)}</div>
              <div>Residenza: {professionalPerson.residenceAddress ?? "-"}</div>
              <div>Titolo di studio: {professionalPerson.educationTitle ?? "-"}</div>
              <div>Abilitazione: {formatDate(professionalPerson.qualificationDate)}</div>
              <div>Ordine: {professionalPerson.professionalOrder ?? "-"}</div>
              <div>Provincia ordine: {professionalPerson.professionalOrderProvince ?? "-"}</div>
              <div>N. iscrizione: {professionalPerson.professionalOrderNumber ?? "-"}</div>
              <div>Data iscrizione: {formatDate(professionalPerson.professionalOrderRegistrationDate)}</div>
              <div>N. Inarcassa: {professionalPerson.inarcassaNumber ?? "-"}</div>
              <div>Specializzazione: {operator.professional?.specialization ?? "-"}</div>
            </div>
          </Panel>
        ) : null}

        {(isCompany || operator.people.length > 0) ? (
          <Panel className="p-4">
            <h2 className="mb-3 font-bold">Persone collegate</h2>
            <Table>
              <tbody className="divide-y divide-line">
                {operator.people.map((rel) => (
                  <tr key={rel.id}>
                    <td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/people/${rel.person.id}`}>{rel.person.lastName} {rel.person.firstName}</Link></td>
                    <td className="px-3 py-2">{personRoleLabels[rel.role]}</td>
                    <td className="px-3 py-2">{rel.title ?? "-"}</td>
                  </tr>
                ))}
                {isCompany ? company.people.filter((rel) => !operator.people.some((link) => link.personId === rel.personId && link.role === rel.role)).map((rel) => (
                  <tr key={rel.id}>
                    <td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/people/${rel.person.id}`}>{rel.person.lastName} {rel.person.firstName}</Link></td>
                    <td className="px-3 py-2">{personRoleLabels[rel.role]}</td>
                    <td className="px-3 py-2">{rel.title ?? "-"}</td>
                  </tr>
                )) : null}
              </tbody>
            </Table>
          </Panel>
        ) : null}

        <Panel className="p-4">
          <h2 className="mb-3 font-bold">Certificazioni</h2>
          <Table>
            <tbody className="divide-y divide-line">
              {operator.certifications.map((cert) => {
                const status = expirationStatus(cert.expiresAt);
                return (
                  <tr key={cert.id}>
                    <td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/certifications/${cert.id}`}>{cert.type}</Link></td>
                    <td className="px-3 py-2">{formatDate(cert.expiresAt)}</td>
                    <td className="px-3 py-2"><Badge tone={status.tone}>{status.label}</Badge></td>
                    <td className="px-3 py-2">{cert.availableForAvvalimento ? "Avvalimento" : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Panel>
        {isCompany ? (
          <Panel className="p-4">
            <h2 className="mb-3 font-bold">SOA</h2>
            <Table>
              <tbody className="divide-y divide-line">
                {company.soaCertificates.map((soa) => {
                  const status = expirationStatus(soa.expiresAt);
                  return (
                    <tr key={soa.id}>
                      <td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/soa/${soa.id}`}>{soa.certificateNumber ?? "SOA"}</Link></td>
                      <td className="px-3 py-2">{soa.qualifications.map((q) => `${q.category} ${q.ranking}`).join(", ")}</td>
                      <td className="px-3 py-2"><Badge tone={status.tone}>{status.label}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Panel>
        ) : null}

        <Panel className="p-4">
          <h2 className="mb-3 font-bold">Servizi e referenze</h2>
          <Table>
            <tbody className="divide-y divide-line">
              {operator.services.map((assignment) => (
                <tr key={assignment.id}>
                  <td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/services/${assignment.service.id}`}>{assignment.service.title}</Link><div className="text-xs text-muted">{assignment.service.levels.map((level) => designLevelLabels[level.level]).join(", ")}</div></td>
                  <td className="px-3 py-2">{assignment.service.workItems.map((work) => `${work.workCategory ?? work.workId}: ${formatCurrency(work.workValue?.toString())}`).join(", ")}</td>
                  <td className="px-3 py-2">{assignment.executionPercent?.toString() ?? "-"}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Panel>

        <Panel className="p-4">
          <h2 className="mb-3 font-bold">Gare</h2>
          <Table>
            <tbody className="divide-y divide-line">
              {operator.groupMembers.map((member) => (
                <tr key={member.id}>
                  <td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/tenders/${member.grouping.tender.id}`}>{member.grouping.tender.object}</Link><div className="text-xs text-muted">CIG {member.grouping.tender.cig}</div></td>
                  <td className="px-3 py-2">{groupRoleLabels[member.role]}</td>
                  <td className="px-3 py-2">{member.sharePercent?.toString() ?? "-"}%</td>
                  <td className="px-3 py-2">{tenderOutcomeLabels[member.grouping.tender.outcome]}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Panel>

        <Panel id="fatturato" className="p-4">
          <h2 className="mb-3 font-bold">Fatturato storico</h2>
          <Table>
            <tbody className="divide-y divide-line">
              {operator.revenues.map((revenue) => (
                <tr key={revenue.id}>
                  <td className="px-3 py-2">{revenue.year}</td>
                  <td className="px-3 py-2">{formatCurrency(revenue.revenue.toString())}</td>
                  <td className="px-3 py-2">{revenue.source ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <form action={addRevenueHistory} className="mt-4 grid gap-3 border-t border-line pt-4 md:grid-cols-[160px_1fr_1fr_auto]">
            <input type="hidden" name="operatorId" value={operator.id} />
            <Field label="Anno"><input name="year" type="number" required /></Field>
            <Field label="Fatturato €"><input name="revenue" inputMode="decimal" required /></Field>
            <Field label="Fonte"><input name="source" /></Field>
            <button className="self-end rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white" type="submit">Salva</button>
          </form>
        </Panel>
      </div>
    </>
  );
}
