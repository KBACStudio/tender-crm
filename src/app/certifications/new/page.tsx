import { CertificationForm } from "@/components/forms";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export default async function NewCertificationPage({ searchParams }: { searchParams: Promise<{ operatorId?: string }> }) {
  const { operatorId } = await searchParams;
  const operators = await prisma.economicOperator.findMany({ include: { company: true, professional: { include: { person: true } } }, orderBy: { displayName: "asc" } });
  return <><PageHeader title="Nuova certificazione" /><CertificationForm operators={operators} defaultOperatorId={operatorId ?? ""} /></>;
}
