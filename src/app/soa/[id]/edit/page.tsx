import { notFound } from "next/navigation";
import { SoaForm } from "@/components/forms";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export default async function EditSoaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, companies] = await Promise.all([prisma.soaCertificate.findUnique({ where: { id }, include: { qualifications: true } }), prisma.company.findMany({ where: { subjectType: "construction_company" }, orderBy: { name: "asc" } })]);
  if (!item) notFound();
  return <><PageHeader title="Modifica SOA" /><SoaForm item={item} companies={companies} /></>;
}
