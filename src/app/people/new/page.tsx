import { PersonForm } from "@/components/forms";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export default async function NewPersonPage({ searchParams }: { searchParams: Promise<{ operatorId?: string }> }) {
  const { operatorId } = await searchParams;
  const operators = await prisma.economicOperator.findMany({ include: { company: true, professional: { include: { person: true } } }, orderBy: { displayName: "asc" } });
  return <><PageHeader title="Nuova persona" /><PersonForm operators={operators} defaultOperatorId={operatorId ?? ""} /></>;
}
