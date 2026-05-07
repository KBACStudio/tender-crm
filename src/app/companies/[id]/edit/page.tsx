import { notFound } from "next/navigation";
import { CompanyForm } from "@/components/forms";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export default async function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await prisma.company.findUnique({ where: { id } });
  if (!company) notFound();
  return <><PageHeader title="Modifica società" /><CompanyForm company={company} /></>;
}
