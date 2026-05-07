import { notFound } from "next/navigation";
import { TenderForm } from "@/components/forms";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export default async function EditTenderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [tender, workReferences, operators] = await Promise.all([
    prisma.tender.findUnique({ where: { id }, include: { grouping: { include: { members: true } }, workRequirements: true, soaRequirements: true } }),
    prisma.workReference.findMany({ orderBy: { code: "asc" } }),
    prisma.economicOperator.findMany({ include: { company: true, professional: { include: { person: true } } }, orderBy: { displayName: "asc" } })
  ]);
  if (!tender) notFound();
  return <><PageHeader title="Modifica gara" /><TenderForm tender={tender} workReferences={workReferences} operators={operators} /></>;
}
