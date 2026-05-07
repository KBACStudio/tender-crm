import { prisma } from "@/lib/prisma";
import { soaCategories, soaCategoryDescriptions } from "@/lib/labels";
import { workReferenceSortValue } from "@/lib/work-references";
import { PageHeader, Panel, Table } from "@/components/ui";

function soaDisplayCode(category: string) {
  return category.replace(/^(OG|OS)(\d)/, "$1 $2");
}

export default async function WorksPage() {
  const workReferences = await prisma.workReference.findMany();
  const works = [...workReferences].sort((a, b) => workReferenceSortValue(a.code) - workReferenceSortValue(b.code));
  const generalSoa = soaCategories.filter((category) => category.startsWith("OG"));
  const specialSoa = soaCategories.filter((category) => category.startsWith("OS"));

  return (
    <>
      <PageHeader title="Categorie / ID Opera" description="Archivio informativo degli ID opera e delle categorie SOA usati nei menu a tendina di servizi, gare e attestazioni." />
      <Panel className="p-4">
        <h2 className="mb-3 font-bold">ID opera</h2>
        <Table>
          <thead><tr className="text-left text-xs uppercase text-muted"><th className="px-3 py-2">ID opera</th><th className="px-3 py-2">Descrizione</th><th className="px-3 py-2">Grado complessita</th></tr></thead>
          <tbody className="divide-y divide-line">
            {works.map((work) => <tr key={work.id}><td className="px-3 py-2 font-semibold">{work.code}</td><td className="px-3 py-2">{work.description ?? "-"}</td><td className="px-3 py-2">{work.category ?? "-"}</td></tr>)}
          </tbody>
        </Table>
      </Panel>
      <Panel className="mt-6 p-4">
        <h2 className="mb-3 font-bold">Categorie SOA - Opere generali</h2>
        <Table>
          <thead><tr className="text-left text-xs uppercase text-muted"><th className="px-3 py-2">Categoria</th><th className="px-3 py-2">Descrizione</th></tr></thead>
          <tbody className="divide-y divide-line">
            {generalSoa.map((category) => <tr key={category}><td className="px-3 py-2 font-semibold">{soaDisplayCode(category)}</td><td className="px-3 py-2">{soaCategoryDescriptions[category]}</td></tr>)}
          </tbody>
        </Table>
      </Panel>
      <Panel className="mt-6 p-4">
        <h2 className="mb-3 font-bold">Categorie SOA - Opere specializzate</h2>
        <Table>
          <thead><tr className="text-left text-xs uppercase text-muted"><th className="px-3 py-2">Categoria</th><th className="px-3 py-2">Descrizione</th></tr></thead>
          <tbody className="divide-y divide-line">
            {specialSoa.map((category) => <tr key={category}><td className="px-3 py-2 font-semibold">{soaDisplayCode(category)}</td><td className="px-3 py-2">{soaCategoryDescriptions[category]}</td></tr>)}
          </tbody>
        </Table>
      </Panel>
    </>
  );
}
