import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import { deleteProfessional } from "@/server/actions";
import { DeleteButton, PageHeader, Panel } from "@/components/ui";

export default async function ProfessionalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const professional = await prisma.professional.findUnique({ where: { id }, include: { person: true, operator: { include: { revenues: { orderBy: { year: "desc" } }, services: { include: { service: { include: { workItems: true } } } } } } } });
  if (!professional) notFound();
  return (
    <>
      <PageHeader title={`${professional.person.lastName} ${professional.person.firstName}`} description={professional.specialization ?? "Professionista"} actionHref={`/professionals/edit/${professional.id}`} actionLabel="Modifica" />
      <div className="mb-4 flex justify-end"><DeleteButton action={deleteProfessional.bind(null, professional.id)} /></div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel className="p-4"><div className="grid gap-2 text-sm md:grid-cols-2"><div>Albo: {professional.register ?? "-"}</div><div>Numero: {professional.registerNumber ?? "-"}</div><div>P.IVA: {professional.vatNumber ?? "-"}</div><div>Polizza: {professional.insured ? "Attiva" : "Non indicata"}</div><div className="md:col-span-2">Note: {professional.notes ?? "-"}</div></div></Panel>
        <Panel className="p-4"><h2 className="mb-3 font-bold">Fatturato storico</h2><div className="grid gap-2 text-sm">{professional.operator?.revenues.map((r) => <div key={r.id}>{r.year}: {formatCurrency(r.revenue.toString())}</div>) || "Nessun dato"}</div></Panel>
      </div>
    </>
  );
}
