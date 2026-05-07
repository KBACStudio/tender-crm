import { ServiceForm } from "@/components/forms";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export default async function NewServicePage() {
  const [operators, workReferences] = await Promise.all([
    prisma.economicOperator.findMany({ include: { company: true, professional: { include: { person: true } } }, orderBy: { displayName: "asc" } }),
    prisma.workReference.findMany({ orderBy: { code: "asc" } })
  ]);
  return <><PageHeader title="Nuovo servizio" /><ServiceForm operators={operators} workReferences={workReferences} /></>;
}
