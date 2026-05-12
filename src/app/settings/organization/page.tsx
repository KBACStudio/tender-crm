import { OrganizationModule, OrganizationPlan } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireOrganization } from "@/server/auth";
import { updateOrganizationSettings } from "@/server/actions";
import { Field, PageHeader, Panel } from "@/components/ui";

const moduleLabels: Record<OrganizationModule, string> = {
  design: "Progettazione",
  dl: "Direzione Lavori",
  cse: "Sicurezza (CSE)",
  contractor: "Impresa / Commesse"
};

const planLabels: Record<OrganizationPlan, string> = {
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise"
};

export default async function OrganizationSettingsPage() {
  const { organization } = await requireOrganization();
  const org = await prisma.organization.findUnique({ where: { id: organization.id } });
  if (!org) return null;

  return (
    <>
      <PageHeader title="Organizzazione" description="Impostazioni prodotto: piano e moduli attivi (feature flags)." />
      <Panel className="p-4">
        <form action={updateOrganizationSettings} className="grid gap-4">
          <Field label="Nome organizzazione">
            <input name="name" defaultValue={org.name} required />
          </Field>
          <Field label="Piano">
            <select name="plan" defaultValue={org.plan}>
              {Object.values(OrganizationPlan).map((plan) => (
                <option key={plan} value={plan}>
                  {planLabels[plan]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Moduli attivi">
            <div className="grid gap-2 text-sm">
              {Object.values(OrganizationModule).map((module) => (
                <label key={module} className="flex items-center gap-2">
                  <input type="checkbox" name="modules" value={module} defaultChecked={org.modules.includes(module)} />
                  <span className="font-semibold">{moduleLabels[module]}</span>
                </label>
              ))}
            </div>
          </Field>
          <button className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white" type="submit">
            Salva
          </button>
        </form>
      </Panel>
    </>
  );
}
