import { SoaForm } from "@/components/forms";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export default async function NewSoaPage() {
  const companies = await prisma.company.findMany({ where: { subjectType: "construction_company" }, orderBy: { name: "asc" } });
  return <><PageHeader title="Nuova SOA" /><SoaForm companies={companies} /></>;
}
