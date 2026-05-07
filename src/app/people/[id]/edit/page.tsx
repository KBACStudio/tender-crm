import { notFound } from "next/navigation";
import { PersonForm } from "@/components/forms";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export default async function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [person, operators] = await Promise.all([
    prisma.person.findUnique({ where: { id }, include: { professional: true } }),
    prisma.economicOperator.findMany({ include: { company: true, professional: { include: { person: true } } }, orderBy: { displayName: "asc" } })
  ]);
  if (!person) notFound();
  return <><PageHeader title="Modifica persona" /><PersonForm person={person} operators={operators} /></>;
}
