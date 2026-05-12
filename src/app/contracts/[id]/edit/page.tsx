import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContractForm } from "@/components/forms";
import { PageHeader } from "@/components/ui";

export default async function ContractEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contract = await prisma.contract.findUnique({ where: { id }, include: { tender: true } });
  if (!contract) notFound();
  return (
    <>
      <PageHeader title="Modifica appalto" description={`Da gara CIG ${contract.tender.cig}`} />
      <ContractForm contract={contract} />
    </>
  );
}
