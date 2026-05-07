import { EconomicOperatorForm } from "@/components/forms";
import { PageHeader } from "@/components/ui";

export default function NewOperatorPage() {
  return <><PageHeader title="Nuovo operatore economico" description="Compila il fascicolo iniziale. Potrai aggiungere fatturati, persone, certificazioni, SOA e servizi dalla scheda operatore." /><EconomicOperatorForm /></>;
}
