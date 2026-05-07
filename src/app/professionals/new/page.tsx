import { ProfessionalForm } from "@/components/forms";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export default async function NewProfessionalPage() {
  const people = await prisma.person.findMany({ where: { professional: null }, orderBy: [{ lastName: "asc" }, { firstName: "asc" }] });
  return <><PageHeader title="Nuovo professionista" /><ProfessionalForm people={people} /></>;
}
