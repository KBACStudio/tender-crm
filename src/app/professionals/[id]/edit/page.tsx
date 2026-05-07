import { notFound } from "next/navigation";
import { ProfessionalForm } from "@/components/forms";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export default async function EditProfessionalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const professional = await prisma.professional.findUnique({ where: { id } });
  if (!professional) notFound();
  const people = await prisma.person.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] });
  return <><PageHeader title="Modifica professionista" /><ProfessionalForm professional={professional} people={people} /></>;
}
