import {
  Certification,
  Company,
  EconomicOperator,
  Grouping,
  Person,
  Professional,
  Service,
  ServiceDesignLevel,
  ServiceWorkItem,
  SoaCertificate,
  SoaQualification,
  Tender,
  TenderSoaRequirement,
  TenderWorkRequirement,
  WorkReference
} from "@prisma/client";
import { designLevelLabels, groupRoleLabels, subjectTypeLabels, tenderOutcomeLabels } from "@/lib/labels";
import { toDateInput } from "@/lib/format";
import { workReferenceSortValue } from "@/lib/work-references";
import { Field, FormActions, Panel } from "@/components/ui";
import {
  updateEconomicOperator,
  upsertCertification,
  upsertCompany,
  upsertGrouping,
  upsertPerson,
  upsertProfessional,
  upsertService,
  upsertSoa,
  upsertTender
} from "@/server/actions";
import { GroupMemberRows, ServiceWorkRows, SoaQualificationRows, TenderRequirementRows } from "@/components/dynamic-rows";
import { OperatorKindForm } from "@/components/operator-kind-form";

type OperatorOption = EconomicOperator & { company: Company | null; professional: (Professional & { person: Person }) | null };

export function CompanyForm({ company }: { company?: Company }) {
  return (
    <Panel className="p-5">
      <form action={upsertCompany.bind(null, company?.id ?? null)} className="grid gap-4 md:grid-cols-2">
        <Field label="Ragione sociale"><input name="name" required defaultValue={company?.name ?? ""} /></Field>
        <Field label="Tipo soggetto"><select name="subjectType" defaultValue={company?.subjectType ?? "other"}>{Object.entries(subjectTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
        <Field label="Partita IVA"><input name="vatNumber" defaultValue={company?.vatNumber ?? ""} /></Field>
        <Field label="Codice fiscale"><input name="fiscalCode" defaultValue={company?.fiscalCode ?? ""} /></Field>
        <Field label="Email"><input name="email" type="email" defaultValue={company?.email ?? ""} /></Field>
        <Field label="PEC"><input name="pec" defaultValue={company?.pec ?? ""} /></Field>
        <Field label="Telefono"><input name="phone" defaultValue={company?.phone ?? ""} /></Field>
        <Field label="Sito web"><input name="website" defaultValue={company?.website ?? ""} /></Field>
        <Field label="Indirizzo"><input name="address" defaultValue={company?.address ?? ""} /></Field>
        <Field label="Citta"><input name="city" defaultValue={company?.city ?? ""} /></Field>
        <Field label="Provincia"><input name="province" defaultValue={company?.province ?? ""} /></Field>
        <Field label="Tag / parole chiave"><input name="tags" /></Field>
        <label className="mt-7 flex items-center gap-2 text-sm font-medium"><input className="h-4 w-4" type="checkbox" name="availableForAvvalimento" /> Disponibile per avvalimento</label>
        <Field label="Note"><textarea name="notes" defaultValue={company?.notes ?? ""} /></Field>
        <div className="md:col-span-2"><FormActions cancelHref={company ? `/companies/${company.id}` : "/companies"} /></div>
      </form>
    </Panel>
  );
}

export function EconomicOperatorForm() {
  return <OperatorKindForm />;
}

export function EconomicOperatorEditForm({ operator }: { operator: OperatorOption }) {
  const company = operator.company;
  const person = operator.professional?.person;
  return (
    <Panel className="p-5">
      <form action={updateEconomicOperator.bind(null, operator.id)} className="grid gap-4 md:grid-cols-2">
        {company ? (
          <>
            <Field label="Ragione sociale"><input name="name" required defaultValue={company.name} /></Field>
            <Field label="Tipo soggetto"><select name="subjectType" defaultValue={company.subjectType}>{Object.entries(subjectTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
            <Field label="Partita IVA"><input name="vatNumber" defaultValue={company.vatNumber ?? ""} /></Field>
            <Field label="Codice fiscale"><input name="fiscalCode" defaultValue={company.fiscalCode ?? ""} /></Field>
            <Field label="Email"><input name="email" type="email" defaultValue={company.email ?? ""} /></Field>
            <Field label="PEC"><input name="pec" defaultValue={company.pec ?? ""} /></Field>
            <Field label="Telefono"><input name="phone" defaultValue={company.phone ?? ""} /></Field>
            <Field label="Sito web"><input name="website" defaultValue={company.website ?? ""} /></Field>
            <Field label="Sede legale"><input name="address" defaultValue={company.address ?? ""} /></Field>
            <Field label="Citta"><input name="city" defaultValue={company.city ?? ""} /></Field>
            <Field label="Provincia"><input name="province" defaultValue={company.province ?? ""} /></Field>
          </>
        ) : null}
        {person ? (
          <>
            <Field label="Nome"><input name="firstName" required defaultValue={person.firstName} /></Field>
            <Field label="Cognome"><input name="lastName" required defaultValue={person.lastName} /></Field>
            <Field label="Partita IVA"><input name="vatNumber" defaultValue={operator.professional?.vatNumber ?? ""} /></Field>
            <Field label="Codice fiscale"><input name="fiscalCode" defaultValue={person.fiscalCode ?? ""} /></Field>
            <Field label="Email"><input name="email" type="email" defaultValue={person.email ?? ""} /></Field>
            <Field label="PEC"><input name="pec" defaultValue={person.pec ?? ""} /></Field>
            <Field label="Telefono"><input name="phone" defaultValue={person.phone ?? ""} /></Field>
            <Field label="Residenza"><input name="residenceAddress" defaultValue={person.residenceAddress ?? ""} /></Field>
            <Field label="Luogo di nascita"><input name="birthPlace" defaultValue={person.birthPlace ?? ""} /></Field>
            <Field label="Data di nascita"><input name="birthDate" type="date" defaultValue={toDateInput(person.birthDate)} /></Field>
            <Field label="Titolo di studio"><input name="educationTitle" defaultValue={person.educationTitle ?? ""} /></Field>
            <Field label="Universita"><input name="university" defaultValue={person.university ?? ""} /></Field>
            <Field label="Data abilitazione"><input name="qualificationDate" type="date" defaultValue={toDateInput(person.qualificationDate)} /></Field>
            <Field label="Ordine professionale"><input name="professionalOrder" defaultValue={person.professionalOrder ?? ""} /></Field>
            <Field label="Provincia ordine"><input name="professionalOrderProvince" defaultValue={person.professionalOrderProvince ?? ""} /></Field>
            <Field label="N. iscrizione ordine"><input name="professionalOrderNumber" defaultValue={person.professionalOrderNumber ?? ""} /></Field>
            <Field label="Data iscrizione ordine"><input name="professionalOrderRegistrationDate" type="date" defaultValue={toDateInput(person.professionalOrderRegistrationDate)} /></Field>
            <Field label="N. Inarcassa"><input name="inarcassaNumber" defaultValue={person.inarcassaNumber ?? ""} /></Field>
            <Field label="Specializzazione"><input name="specialization" defaultValue={operator.professional?.specialization ?? ""} /></Field>
          </>
        ) : null}
        <Field label="Tag / parole chiave"><input name="tags" defaultValue={operator.tags ?? ""} /></Field>
        <label className="mt-7 flex items-center gap-2 text-sm font-medium"><input className="h-4 w-4" type="checkbox" name="availableForAvvalimento" defaultChecked={operator.availableForAvvalimento} /> Disponibile per avvalimento</label>
        <div className="md:col-span-2"><Field label="Note"><textarea name="notes" defaultValue={operator.notes ?? company?.notes ?? operator.professional?.notes ?? ""} /></Field></div>
        <div className="md:col-span-2"><FormActions cancelHref={`/operators/${operator.id}`} /></div>
      </form>
    </Panel>
  );
}

export function PersonForm({ person, operators = [], defaultOperatorId = "" }: { person?: Person & { professional?: Professional | null }; operators?: OperatorOption[]; defaultOperatorId?: string }) {
  return (
    <Panel className="p-5">
      <form action={upsertPerson.bind(null, person?.id ?? null)} className="grid gap-4 md:grid-cols-2">
        <Field label="Nome"><input name="firstName" required defaultValue={person?.firstName ?? ""} /></Field>
        <Field label="Cognome"><input name="lastName" required defaultValue={person?.lastName ?? ""} /></Field>
        <Field label="Email"><input name="email" type="email" defaultValue={person?.email ?? ""} /></Field>
        <Field label="PEC"><input name="pec" defaultValue={person?.pec ?? ""} /></Field>
        <Field label="Telefono"><input name="phone" defaultValue={person?.phone ?? ""} /></Field>
        <Field label="Codice fiscale"><input name="fiscalCode" defaultValue={person?.fiscalCode ?? ""} /></Field>
        <Field label="Luogo di nascita"><input name="birthPlace" defaultValue={person?.birthPlace ?? ""} /></Field>
        <Field label="Data di nascita"><input name="birthDate" type="date" defaultValue={toDateInput(person?.birthDate ?? null)} /></Field>
        <div className="md:col-span-2"><Field label="Residenza"><input name="residenceAddress" defaultValue={person?.residenceAddress ?? ""} /></Field></div>
        <Field label="Titolo di studio"><input name="educationTitle" defaultValue={person?.educationTitle ?? ""} /></Field>
        <Field label="Universita"><input name="university" defaultValue={person?.university ?? ""} /></Field>
        <Field label="Data laurea"><input name="graduationDate" type="date" defaultValue={toDateInput(person?.graduationDate ?? null)} /></Field>
        <Field label="Data abilitazione"><input name="qualificationDate" type="date" defaultValue={toDateInput(person?.qualificationDate ?? null)} /></Field>
        <Field label="Ordine professionale"><input name="professionalOrder" defaultValue={person?.professionalOrder ?? ""} /></Field>
        <Field label="Provincia ordine"><input name="professionalOrderProvince" defaultValue={person?.professionalOrderProvince ?? ""} /></Field>
        <Field label="N. iscrizione ordine"><input name="professionalOrderNumber" defaultValue={person?.professionalOrderNumber ?? ""} /></Field>
        <Field label="Data iscrizione ordine"><input name="professionalOrderRegistrationDate" type="date" defaultValue={toDateInput(person?.professionalOrderRegistrationDate ?? null)} /></Field>
        <Field label="N. iscrizione Inarcassa"><input name="inarcassaNumber" defaultValue={person?.inarcassaNumber ?? ""} /></Field>
        <label className="mt-7 flex items-center gap-2 text-sm font-medium"><input className="h-4 w-4" type="checkbox" name="markProfessional" defaultChecked={Boolean(person?.professional)} /> Marca come professionista</label>
        <div className="md:col-span-2 border-t border-line pt-4 text-sm font-bold">Collegamento a operatore economico</div>
        <Field label="Operatore"><select name="operatorId" defaultValue={defaultOperatorId}><option value="">Nessuno</option>{operators.map((operator) => <option key={operator.id} value={operator.id}>{operator.displayName}</option>)}</select></Field>
        <Field label="Ruolo"><select name="operatorRole"><option value="contact">Referente</option><option value="employee">Dipendente</option><option value="consultant">Consulente</option><option value="administrator">Amministratore</option><option value="technical_director">Direttore tecnico</option></select></Field>
        <Field label="Qualifica"><input name="operatorTitle" /></Field>
        <div className="md:col-span-2"><Field label="Note"><textarea name="notes" defaultValue={person?.notes ?? ""} /></Field></div>
        <div className="md:col-span-2"><FormActions cancelHref={person ? `/people/${person.id}` : "/people"} /></div>
      </form>
    </Panel>
  );
}

export function ProfessionalForm({ professional, people }: { professional?: Professional; people: Person[] }) {
  return (
    <Panel className="p-5">
      <form action={upsertProfessional.bind(null, professional?.id ?? null)} className="grid gap-4 md:grid-cols-2">
        <Field label="Persona"><select name="personId" defaultValue={professional?.personId ?? ""} required><option value="">Seleziona</option>{people.map((person) => <option key={person.id} value={person.id}>{person.lastName} {person.firstName}</option>)}</select></Field>
        <Field label="Albo / Ordine"><input name="register" defaultValue={professional?.register ?? ""} /></Field>
        <Field label="Numero iscrizione"><input name="registerNumber" defaultValue={professional?.registerNumber ?? ""} /></Field>
        <Field label="Specializzazione"><input name="specialization" defaultValue={professional?.specialization ?? ""} /></Field>
        <Field label="Partita IVA"><input name="vatNumber" defaultValue={professional?.vatNumber ?? ""} /></Field>
        <label className="mt-7 flex items-center gap-2 text-sm font-medium"><input className="h-4 w-4" type="checkbox" name="insured" defaultChecked={professional?.insured ?? false} /> Polizza attiva</label>
        <div className="md:col-span-2"><Field label="Note"><textarea name="notes" defaultValue={professional?.notes ?? ""} /></Field></div>
        <div className="md:col-span-2"><FormActions cancelHref={professional ? `/professionals/${professional.id}` : "/professionals"} /></div>
      </form>
    </Panel>
  );
}

export function CertificationForm({ item, operators, defaultOperatorId = "" }: { item?: Certification; operators: OperatorOption[]; defaultOperatorId?: string }) {
  return <ExpiryForm kind="certification" item={item} operators={operators} defaultOperatorId={defaultOperatorId} />;
}

export function SoaForm({ item, companies }: { item?: SoaCertificate & { qualifications: SoaQualification[] }; companies: Company[] }) {
  return <ExpiryForm kind="soa" item={item} companies={companies} />;
}

function ExpiryForm({ kind, item, companies = [], operators = [], defaultOperatorId = "" }: { kind: "certification" | "soa"; item?: Certification | (SoaCertificate & { qualifications?: SoaQualification[] }); companies?: Company[]; operators?: OperatorOption[]; defaultOperatorId?: string }) {
  const action = kind === "certification" ? upsertCertification : upsertSoa;
  const isSoa = kind === "soa";
  return (
    <Panel className="p-5">
      <form action={action.bind(null, item?.id ?? null)} className="grid gap-4 md:grid-cols-2">
        {isSoa ? (
          <Field label="Societa"><select name="companyId" required defaultValue={item?.companyId ?? ""}><option value="">Seleziona</option>{companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select></Field>
        ) : (
          <Field label="Operatore economico"><select name="operatorId" required defaultValue={(item as Certification | undefined)?.operatorId ?? defaultOperatorId}><option value="">Seleziona</option>{operators.map((operator) => <option key={operator.id} value={operator.id}>{operator.displayName}</option>)}</select></Field>
        )}
        {isSoa ? (
          <Field label="Numero attestazione"><input name="certificateNumber" defaultValue={(item as SoaCertificate | undefined)?.certificateNumber ?? ""} /></Field>
        ) : (
          <>
            <Field label="Tipo"><input name="type" required defaultValue={(item as Certification | undefined)?.type ?? ""} /></Field>
            <Field label="Numero"><input name="number" defaultValue={(item as Certification | undefined)?.number ?? ""} /></Field>
            <label className="mt-7 flex items-center gap-2 text-sm font-medium"><input className="h-4 w-4" type="checkbox" name="availableForAvvalimento" defaultChecked={(item as Certification | undefined)?.availableForAvvalimento ?? false} /> Disponibile per avvalimento</label>
          </>
        )}
        <Field label="Ente / Organismo rilasciante"><input name="issuingBody" defaultValue={item?.issuingBody ?? ""} /></Field>
        <Field label="Data rilascio"><input name="issuedAt" type="date" defaultValue={toDateInput(item?.issuedAt ?? null)} /></Field>
        <Field label="Data scadenza"><input name="expiresAt" type="date" defaultValue={toDateInput(item?.expiresAt ?? null)} /></Field>
        {isSoa ? <div className="md:col-span-2"><SoaQualificationRows name="qualifications" initialRows={((item as SoaCertificate & { qualifications?: SoaQualification[] } | undefined)?.qualifications ?? []).map((row) => ({ category: row.category, ranking: row.ranking }))} /></div> : null}
        <div className="md:col-span-2"><Field label="Note"><textarea name="notes" defaultValue={item?.notes ?? ""} /></Field></div>
        <div className="md:col-span-2"><FormActions cancelHref={item ? `/${isSoa ? "soa" : "certifications"}/${item.id}` : `/${isSoa ? "soa" : "certifications"}`} /></div>
      </form>
    </Panel>
  );
}

export function ServiceForm({ service, operators, workReferences }: { service?: Service & { assignments: { operatorId: string | null; role: string | null; executionPercent: unknown }[]; workItems: ServiceWorkItem[]; levels: ServiceDesignLevel[] }; operators: OperatorOption[]; workReferences: WorkReference[] }) {
  const assignment = service?.assignments[0];
  const selectedLevels = new Set(service?.levels.map((item) => item.level) ?? []);
  const workOptions = [...workReferences].sort((a, b) => workReferenceSortValue(a.code) - workReferenceSortValue(b.code)).map((work) => ({ id: work.id, label: work.code, description: work.description ?? undefined, category: work.category ?? undefined }));
  const initialWorkRows = service?.workItems.map((item) => ({ workReferenceId: item.workReferenceId ?? "", workId: item.workId, workCategory: item.workCategory ?? "", workValue: item.workValue?.toString() ?? "", sharePercent: item.sharePercent?.toString() ?? "" })) ?? [];
  return (
    <Panel className="p-5">
      <form action={upsertService.bind(null, service?.id ?? null)} className="grid gap-4 md:grid-cols-2">
        <Field label="Oggetto"><input name="title" required defaultValue={service?.title ?? ""} /></Field>
        <Field label="Committente"><input name="client" defaultValue={service?.client ?? ""} /></Field>
        <Field label="Parcella €"><input name="feeAmount" inputMode="decimal" defaultValue={service?.feeAmount?.toString() ?? ""} /></Field>
        <Field label="Data inizio"><input name="startedAt" type="date" defaultValue={toDateInput(service?.startedAt ?? null)} /></Field>
        <Field label="Data fine"><input name="endedAt" type="date" defaultValue={toDateInput(service?.endedAt ?? null)} /></Field>
        <Field label="Operatore economico"><select name="operatorId" defaultValue={assignment?.operatorId ?? ""}><option value="">Nessuno</option>{operators.map((operator) => <option key={operator.id} value={operator.id}>{operator.displayName}</option>)}</select></Field>
        <Field label="Ruolo incarico"><input name="assignmentRole" defaultValue={assignment?.role ?? ""} /></Field>
        <Field label="Percentuale eseguita"><input name="executionPercent" inputMode="decimal" defaultValue={assignment?.executionPercent?.toString() ?? ""} /></Field>
        <div className="md:col-span-2"><ServiceWorkRows name="workItems" workOptions={workOptions} initialRows={initialWorkRows} /></div>
        <div className="md:col-span-2 grid gap-2 text-sm font-medium text-ink"><span>Livelli di progettazione</span><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(designLevelLabels).map(([value, label]) => <label key={value} className="flex items-center gap-2"><input className="h-4 w-4" name="levels" type="checkbox" value={value} defaultChecked={selectedLevels.has(value as never)} /> {label}</label>)}</div></div>
        <div className="md:col-span-2"><Field label="Note"><textarea name="notes" defaultValue={service?.notes ?? ""} /></Field></div>
        <div className="md:col-span-2"><FormActions cancelHref={service ? `/services/${service.id}` : "/services"} /></div>
      </form>
    </Panel>
  );
}

export function TenderForm({ tender, workReferences, operators }: { tender?: Tender & { grouping: (Grouping & { members: { operatorId: string | null; role: string; sharePercent: unknown }[] }) | null; workRequirements: TenderWorkRequirement[]; soaRequirements: TenderSoaRequirement[] }; workReferences: WorkReference[]; operators: OperatorOption[] }) {
  const workOptions = [...workReferences].sort((a, b) => workReferenceSortValue(a.code) - workReferenceSortValue(b.code)).map((work) => ({ id: work.id, label: work.code, description: work.description ?? undefined, category: work.category ?? undefined }));
  const operatorOptions = operators.map((operator) => ({ id: operator.id, label: operator.displayName }));
  const initialWorkRows = tender?.workRequirements.map((item) => ({ workReferenceId: item.workReferenceId ?? "", workId: item.workId, category: item.category ?? "", amount: item.amount?.toString() ?? "" })) ?? [];
  const initialSoaRows = tender?.soaRequirements.map((item) => ({ category: item.category, ranking: item.ranking ?? "" })) ?? [];
  const initialGroupRows = tender?.grouping?.members.map((member) => ({ operatorId: member.operatorId ?? "", role: member.role, sharePercent: member.sharePercent?.toString() ?? "" })) ?? [];
  return (
    <Panel className="p-5">
      <form action={upsertTender.bind(null, tender?.id ?? null)} className="grid gap-4 md:grid-cols-2">
        <Field label="Oggetto"><input name="object" required defaultValue={tender?.object ?? ""} /></Field>
        <Field label="CIG"><input name="cig" required defaultValue={tender?.cig ?? ""} /></Field>
        <Field label="CUP"><input name="cup" defaultValue={tender?.cup ?? ""} /></Field>
        <Field label="Luogo"><input name="place" defaultValue={tender?.place ?? ""} /></Field>
        <Field label="Stazione appaltante"><input name="contractingBody" defaultValue={tender?.contractingBody ?? ""} /></Field>
        <Field label="Valore €"><input name="value" inputMode="decimal" defaultValue={tender?.value?.toString() ?? ""} /></Field>
        <Field label="Esito"><select name="outcome" defaultValue={tender?.outcome ?? "draft"}>{Object.entries(tenderOutcomeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
        <Field label="Pubblicazione"><input name="publishedAt" type="date" defaultValue={toDateInput(tender?.publishedAt ?? null)} /></Field>
        <Field label="Scadenza"><input name="deadline" type="date" defaultValue={toDateInput(tender?.deadline ?? null)} /></Field>
        <Field label="Nome RTI"><input name="groupingName" defaultValue={tender?.grouping?.name ?? ""} placeholder="RTI della gara" /></Field>
        <div className="md:col-span-2"><TenderRequirementRows workName="workRequirements" soaName="soaRequirements" workOptions={workOptions} initialWorkRows={initialWorkRows} initialSoaRows={initialSoaRows} /></div>
        <div className="md:col-span-2"><GroupMemberRows name="groupMembers" operatorOptions={operatorOptions} initialRows={initialGroupRows} /></div>
        <div className="md:col-span-2"><Field label="Note"><textarea name="notes" defaultValue={tender?.notes ?? ""} /></Field></div>
        <div className="md:col-span-2"><FormActions cancelHref={tender ? `/tenders/${tender.id}` : "/tenders"} /></div>
      </form>
    </Panel>
  );
}

export function GroupingForm({ grouping, operators }: { grouping?: Grouping; operators: OperatorOption[] }) {
  return (
    <Panel className="p-5">
      <form action={upsertGrouping.bind(null, grouping?.id ?? null)} className="grid gap-4 md:grid-cols-2">
        <Field label="Nome raggruppamento"><input name="name" required defaultValue={grouping?.name ?? ""} /></Field>
        <Field label="Tipo"><input name="type" defaultValue={grouping?.type ?? "RTI"} /></Field>
        <div className="md:col-span-2"><Field label="Note"><textarea name="notes" defaultValue={grouping?.notes ?? ""} /></Field></div>
        <div className="md:col-span-2 border-t border-line pt-4 text-sm font-bold">Aggiungi componente</div>
        <Field label="Operatore economico"><select name="operatorId"><option value="">Nessuno</option>{operators.map((operator) => <option key={operator.id} value={operator.id}>{operator.displayName}</option>)}</select></Field>
        <Field label="Ruolo"><select name="memberRole">{Object.entries(groupRoleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
        <Field label="Quota %"><input name="sharePercent" inputMode="decimal" /></Field>
        <div className="md:col-span-2"><Field label="Note componente"><textarea name="memberNotes" /></Field></div>
        <div className="md:col-span-2"><FormActions cancelHref={grouping ? `/groups/${grouping.id}` : "/groups"} /></div>
      </form>
    </Panel>
  );
}
