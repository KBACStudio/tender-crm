import { TenderForm } from "@/components/forms";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export default async function NewTenderPage() {
  const [workReferences, operators] = await Promise.all([
    prisma.workReference.findMany({ orderBy: { code: "asc" } }),
    prisma.economicOperator.findMany({ include: { company: true, professional: { include: { person: true } } }, orderBy: { displayName: "asc" } })
  ]);
  return <><PageHeader title="Nuova gara" /><TenderForm workReferences={workReferences} operators={operators} /></>;
}
