"use client";

import { useState } from "react";
import { createEconomicOperator } from "@/server/actions";
import { subjectTypeLabels } from "@/lib/labels";
import { Field, FormActions, Panel } from "@/components/ui";

export function OperatorKindForm() {
  const [kind, setKind] = useState<"company" | "professional">("company");

  return (
    <Panel className="p-5">
      <form action={createEconomicOperator} className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tipo operatore">
            <select name="operatorKind" value={kind} onChange={(event) => setKind(event.target.value as "company" | "professional")}>
              <option value="company">Societa / studio / impresa</option>
              <option value="professional">Libero professionista</option>
            </select>
          </Field>
          <Field label="Tag / parole chiave"><input name="tags" placeholder="E.22, chiese, OG1, avvalimento" /></Field>
        </div>

        {kind === "company" ? (
          <section className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2 border-b border-line pb-2 text-sm font-bold">Dati societari</div>
            <Field label="Ragione sociale"><input name="name" required /></Field>
            <Field label="Tipologia soggetto">
              <select name="subjectType">
                {Object.entries(subjectTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </Field>
            <Field label="Partita IVA"><input name="vatNumber" /></Field>
            <Field label="Codice fiscale"><input name="fiscalCode" /></Field>
            <Field label="Email"><input name="email" type="email" /></Field>
            <Field label="PEC"><input name="pec" /></Field>
            <Field label="Telefono"><input name="phone" /></Field>
            <Field label="Sito web"><input name="website" /></Field>
            <Field label="Sede legale"><input name="address" /></Field>
            <Field label="Citta"><input name="city" /></Field>
            <Field label="Provincia"><input name="province" /></Field>
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2 border-b border-line pb-2 text-sm font-bold">Dati libero professionista</div>
            <Field label="Nome"><input name="firstName" required /></Field>
            <Field label="Cognome"><input name="lastName" required /></Field>
            <Field label="Partita IVA"><input name="vatNumber" /></Field>
            <Field label="Codice fiscale"><input name="fiscalCode" /></Field>
            <Field label="Email"><input name="email" type="email" /></Field>
            <Field label="PEC"><input name="pec" /></Field>
            <Field label="Telefono"><input name="phone" /></Field>
            <Field label="Residenza"><input name="residenceAddress" /></Field>
            <Field label="Luogo di nascita"><input name="birthPlace" /></Field>
            <Field label="Data di nascita"><input name="birthDate" type="date" /></Field>
            <Field label="Titolo di studio"><input name="educationTitle" /></Field>
            <Field label="Universita"><input name="university" /></Field>
            <Field label="Data abilitazione"><input name="qualificationDate" type="date" /></Field>
            <Field label="Ordine professionale"><input name="professionalOrder" /></Field>
            <Field label="Provincia ordine"><input name="professionalOrderProvince" /></Field>
            <Field label="N. iscrizione ordine"><input name="professionalOrderNumber" /></Field>
            <Field label="Data iscrizione ordine"><input name="professionalOrderRegistrationDate" type="date" /></Field>
            <Field label="N. Inarcassa"><input name="inarcassaNumber" /></Field>
            <Field label="Specializzazione"><input name="specialization" /></Field>
          </section>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-2 text-sm font-medium"><input className="h-4 w-4" type="checkbox" name="availableForAvvalimento" /> Disponibile per avvalimento</label>
          <div className="md:col-span-2"><Field label="Note"><textarea name="notes" /></Field></div>
        </div>
        <FormActions cancelHref="/operators" />
      </form>
    </Panel>
  );
}
