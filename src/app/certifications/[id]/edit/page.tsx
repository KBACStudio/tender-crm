import { notFound } from "next/navigation";
import { CertificationForm } from "@/components/forms";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export default async function EditCertificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, operators] = await Promise.all([
    prisma.certification.findUnique({ where: { id } }),
    prisma.economicOperator.findMany({ include: { company: true, professional: { include: { person: true } } }, orderBy: { displayName: "asc" } })
  ]);
  if (!item) notFound();
  return <><PageHeader title="Modifica certificazione" /><CertificationForm item={item} operators={operators} /></>;
}
