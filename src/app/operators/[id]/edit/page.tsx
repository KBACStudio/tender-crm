import { notFound } from "next/navigation";
import { EconomicOperatorEditForm } from "@/components/forms";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export default async function EditOperatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const operator = await prisma.economicOperator.findUnique({
    where: { id },
    include: { company: true, professional: { include: { person: true } } }
  });
  if (!operator) notFound();
  return <><PageHeader title="Modifica operatore economico" description={operator.displayName} /><EconomicOperatorEditForm operator={operator} /></>;
}
