import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/forms";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [service, operators, workReferences] = await Promise.all([
    prisma.service.findUnique({ where: { id }, include: { assignments: true, workItems: true, levels: true } }),
    prisma.economicOperator.findMany({ include: { company: true, professional: { include: { person: true } } }, orderBy: { displayName: "asc" } }),
    prisma.workReference.findMany({ orderBy: { code: "asc" } })
  ]);
  if (!service) notFound();
  return <><PageHeader title="Modifica servizio" /><ServiceForm service={service} operators={operators} workReferences={workReferences} /></>;
}
