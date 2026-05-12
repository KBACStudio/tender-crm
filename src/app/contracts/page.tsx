import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { contractStatusLabels, tenderOutcomeLabels } from "@/lib/labels";
import { formatCurrency, formatDate } from "@/lib/format";
import { PageHeader, SearchBar, Table } from "@/components/ui";
import { requireOrganization } from "@/server/auth";

export default async function ContractsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const { organization } = await requireOrganization();
  const organizationId = organization.id;
  const contracts = await prisma.contract.findMany({
    where: {
      organizationId,
      ...(q
        ? {
            tender: {
              OR: [
                { cig: { contains: q, mode: "insensitive" } },
                { object: { contains: q, mode: "insensitive" } },
                { place: { contains: q, mode: "insensitive" } },
                { contractingBody: { contains: q, mode: "insensitive" } }
              ]
            }
          }
        : {})
    },
    include: { tender: true },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <>
      <PageHeader title="Appalti" description="Appalti aggiudicati (creati automaticamente dalle gare aggiudicate)." />
      <SearchBar placeholder="Cerca per CIG, oggetto, luogo o stazione appaltante" />
      <Table>
        <thead>
          <tr className="text-left text-xs uppercase text-muted">
            <th className="px-3 py-2">Gara</th>
            <th className="px-3 py-2">Stato</th>
            <th className="px-3 py-2">Importo</th>
            <th className="px-3 py-2">Aggiudicazione</th>
            <th className="px-3 py-2">Gara (esito)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {contracts.map((contract) => (
            <tr key={contract.id}>
              <td className="px-3 py-2">
                <Link className="font-semibold text-teal" href={`/contracts/${contract.id}`}>
                  {contract.tender.object}
                </Link>
                <div className="text-xs text-muted">CIG {contract.tender.cig}</div>
              </td>
              <td className="px-3 py-2">{contractStatusLabels[contract.status]}</td>
              <td className="px-3 py-2">{formatCurrency((contract.awardedValue ?? contract.tender.value)?.toString())}</td>
              <td className="px-3 py-2">{formatDate(contract.awardedAt)}</td>
              <td className="px-3 py-2">{tenderOutcomeLabels[contract.tender.outcome]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
