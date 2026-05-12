import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";
import { PageHeader, Table } from "@/components/ui";
import { requireOrganization } from "@/server/auth";

export default async function OperatorsPage() {
  const { organization } = await requireOrganization();
  const organizationId = organization.id;
  const operators = await prisma.economicOperator.findMany({
    where: { organizationId },
    include: { revenues: { orderBy: { year: "desc" } } },
    orderBy: { displayName: "asc" }
  });

  return (
    <>
      <PageHeader title="Operatori economici" description="Il faldone digitale di societa, studi, imprese e liberi professionisti." actionHref="/operators/new" actionLabel="Nuovo operatore" />
      <Table>
        <thead><tr className="text-left text-xs uppercase text-muted"><th className="px-3 py-2">Operatore</th><th className="px-3 py-2">Tipo</th><th className="px-3 py-2">Avvalimento</th><th className="px-3 py-2">Fatturati</th></tr></thead>
        <tbody className="divide-y divide-line">{operators.map((operator) => <tr key={operator.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={`/operators/${operator.id}`}>{operator.displayName}</Link><div className="text-xs text-muted">{operator.tags ?? "-"}</div></td><td className="px-3 py-2">{operator.operatorType === "company" ? "Societa" : "Professionista"}</td><td className="px-3 py-2">{operator.availableForAvvalimento ? "Si" : "No"}</td><td className="px-3 py-2">{operator.revenues.map((r) => `${r.year}: ${formatCurrency(r.revenue.toString())}`).join(" - ") || "-"}</td></tr>)}</tbody>
      </Table>
    </>
  );
}
