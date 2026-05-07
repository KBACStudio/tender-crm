export type StandardWorkReference = {
  code: string;
  description: string;
  complexity: string;
};

export const workReferenceGroupOrder = ["E", "S", "IA", "IB", "V", "D", "T", "P", "U"];

export const standardWorkReferences: StandardWorkReference[] = [
  { code: "E.01", description: "Edifici rurali per l'attivita agricola con corredi tecnici semplici; edifici industriali o artigianali di importanza costruttiva corrente", complexity: "0,65" },
  { code: "E.02", description: "Edifici rurali, industriali o artigianali con organizzazione e corredi tecnici di tipo complesso", complexity: "0,95" },
  { code: "E.03", description: "Ostelli, pensioni, case albergo, ristoranti, motel, stazioni di servizio, negozi e mercati coperti semplici", complexity: "0,95" },
  { code: "E.04", description: "Alberghi, villaggi turistici, mercati e centri commerciali complessi", complexity: "1,20" },
  { code: "E.05", description: "Edifici, pertinenze e autorimesse semplici senza particolari esigenze tecniche; edifici provvisori di modesta importanza", complexity: "0,65" },
  { code: "E.06", description: "Edilizia residenziale privata e pubblica corrente con costi medi e tipologie standardizzate", complexity: "0,95" },
  { code: "E.07", description: "Edifici residenziali di pregio con costi eccedenti la media e tipologie diversificate", complexity: "1,20" },
  { code: "E.08", description: "Sanita, istruzione e ricerca di base: distretti sanitari, ambulatori, asili, scuole fino alle soglie ordinarie", complexity: "0,95" },
  { code: "E.09", description: "Scuole oltre soglie ordinarie e case di cura", complexity: "1,15" },
  { code: "E.10", description: "Poliambulatori, ospedali, istituti di ricerca, centri di riabilitazione, poli scolastici e universita", complexity: "1,20" },
  { code: "E.11", description: "Padiglioni provvisori, opere cimiteriali normali, case parrocchiali, oratori, stabilimenti balneari, sport all'aperto semplice", complexity: "0,95" },
  { code: "E.12", description: "Aree sportive complesse, palestre e piscine coperte", complexity: "1,15" },
  { code: "E.13", description: "Biblioteche, cinema, teatri, musei, gallerie, auditorium, opere monumentali, palasport, stadi e chiese", complexity: "1,20" },
  { code: "E.14", description: "Edifici provvisori di modesta importanza a servizio di caserme", complexity: "0,65" },
  { code: "E.15", description: "Caserme con corredi tecnici di importanza corrente", complexity: "0,95" },
  { code: "E.16", description: "Sedi e uffici pubblici, giudiziari e delle forze dell'ordine con corredi tecnici di importanza maggiore", complexity: "1,20" },
  { code: "E.17", description: "Verde e arredo urbano di grande semplicita, pertinenziali a edifici e viabilita; campeggi e simili", complexity: "0,65" },
  { code: "E.18", description: "Arredamenti di mercato, giardini, parchi gioco, piazze e spazi pubblici all'aperto", complexity: "0,95" },
  { code: "E.19", description: "Arredamenti singolari, parchi urbani, giardini storici, piazze storiche e riqualificazioni paesaggistiche urbane", complexity: "1,20" },
  { code: "E.20", description: "Manutenzione straordinaria, ristrutturazione e riqualificazione di edifici e manufatti esistenti", complexity: "0,95" },
  { code: "E.21", description: "Manutenzione, restauro, ristrutturazione e riqualificazione di manufatti di interesse storico non soggetti a tutela", complexity: "1,20" },
  { code: "E.22", description: "Interventi su edifici e manufatti storico-artistici soggetti a tutela o di particolare importanza", complexity: "1,55" },
  { code: "S.01", description: "Strutture in cemento armato non soggette ad azioni sismiche, riparazioni/interventi locali, verifiche e opere provvisionali brevi", complexity: "0,70" },
  { code: "S.02", description: "Strutture in muratura, legno o metallo non soggette ad azioni sismiche; riparazioni/interventi locali e verifiche", complexity: "0,50" },
  { code: "S.03", description: "Strutture o parti di strutture in cemento armato, verifiche, ponteggi e opere provvisionali di durata superiore a due anni", complexity: "0,95" },
  { code: "S.04", description: "Strutture in muratura, legno o metallo; consolidamenti, ponti, paratie, tiranti e consolidamento pendii di tipo corrente", complexity: "0,90" },
  { code: "S.05", description: "Dighe, conche, elevatori, opere di ritenuta e difesa, gallerie, opere sotterranee/subacquee e fondazioni speciali", complexity: "1,05" },
  { code: "S.06", description: "Opere strutturali di notevole importanza con calcolazioni particolari e modellazioni normative complesse", complexity: "1,15" },
  { code: "IA.01", description: "Impianti idrico-sanitari, fognari, combustibili, aria compressa, gas medicali e reti antincendio", complexity: "0,75" },
  { code: "IA.02", description: "Impianti di riscaldamento, raffrescamento, climatizzazione, trattamento aria, distribuzione fluidi e solare termico", complexity: "0,85" },
  { code: "IA.03", description: "Impianti elettrici, illuminazione, telefonici, rivelazione incendi e fotovoltaici di importanza corrente", complexity: "1,15" },
  { code: "IA.04", description: "Impianti elettrici, sicurezza, rivelazione incendi, fotovoltaici, cablaggi e fibra ottica per costruzioni complesse", complexity: "1,30" },
  { code: "IB.04", description: "Depositi e discariche senza trattamento dei rifiuti", complexity: "0,55" },
  { code: "IB.05", description: "Impianti per industrie molitorie, cartarie, alimentari, fibre tessili naturali, legno, cuoio e simili", complexity: "0,70" },
  { code: "IB.06", description: "Impianti industriali complessi, chimici, siderurgici, cantieri navali, cementifici, trattamento rifiuti e metallurgia", complexity: "0,70" },
  { code: "IB.07", description: "Impianti industriali di complessita particolarmente rilevante o con rischi e problematiche ambientali molto rilevanti", complexity: "0,75" },
  { code: "IB.08", description: "Linee e reti per trasmissione e distribuzione di energia elettrica, telegrafia e telefonia", complexity: "0,50" },
  { code: "IB.09", description: "Centrali idroelettriche ordinarie e stazioni di trasformazione/conversione per trazione elettrica", complexity: "0,60" },
  { code: "IB.10", description: "Impianti termoelettrici, elettrochimica, elettrometallurgia e laboratori con ridotte problematiche tecniche", complexity: "0,75" },
  { code: "IB.11", description: "Campi fotovoltaici e parchi eolici", complexity: "0,90" },
  { code: "IB.12", description: "Micro centrali idroelettriche, impianti termoelettrici ed elettrometallurgici di tipo complesso", complexity: "1,00" },
  { code: "V.01", description: "Interventi di manutenzione su viabilita ordinaria", complexity: "0,40" },
  { code: "V.02", description: "Strade, tramvie, ferrovie e piste ciclabili di tipo ordinario, escluse opere d'arte", complexity: "0,45" },
  { code: "V.03", description: "Infrastrutture di mobilita con particolari difficolta di studio, impianti teleferici/funicolari e piste aeroportuali", complexity: "0,75" },
  { code: "D.01", description: "Opere di navigazione interna e portuali", complexity: "0,65" },
  { code: "D.02", description: "Bonifiche, irrigazioni a deflusso naturale, sistemazione corsi d'acqua e bacini montani", complexity: "0,45" },
  { code: "D.03", description: "Bonifiche e irrigazioni con sollevamento meccanico; derivazioni d'acqua per forza motrice ed energia elettrica", complexity: "0,55" },
  { code: "D.04", description: "Impianti semplici per provvista, condotta e distribuzione d'acqua; fognature urbane semplici e condotte ordinarie", complexity: "0,65" },
  { code: "D.05", description: "Impianti idrici, fognari, condotte subacquee, metanodotti e gasdotti con problemi tecnici speciali", complexity: "0,80" },
  { code: "T.01", description: "Sistemi informativi, gestione documentale, dematerializzazione, processi, data center e server farm", complexity: "0,95" },
  { code: "T.02", description: "Reti locali/geografiche, cablaggi, fibra ottica, videosorveglianza, controllo accessi, wireless, wifi e ponti radio", complexity: "0,70" },
  { code: "T.03", description: "Elettronica industriale, sistemi a controllo numerico, automazione e robotica", complexity: "1,20" },
  { code: "P.01", description: "Sistemazione naturalistica o paesaggistica, aree protette, restauro paesaggistico e assetto paesaggistico", complexity: "0,85" },
  { code: "P.02", description: "Opere a verde su piccola o grande scala e opere per attivita ricreativa o sportiva", complexity: "0,85" },
  { code: "P.03", description: "Riqualificazione e risanamento ambientale di ambiti naturali, rurali, forestali o urbani", complexity: "0,85" },
  { code: "P.04", description: "Interventi di sfruttamento di cave e torbiere", complexity: "0,85" },
  { code: "P.05", description: "Assetto e utilizzazione forestale, piste forestali, percorsi naturalistici e meccanizzazione forestale", complexity: "0,85" },
  { code: "P.06", description: "Infrastrutture e interventi di miglioramento dell'assetto rurale", complexity: "0,85" },
  { code: "U.01", description: "Opere e infrastrutture complesse per valorizzazione delle filiere agroalimentari e zootecniche", complexity: "0,90" },
  { code: "U.02", description: "Interventi di valorizzazione degli ambiti naturali di tipo vegetazionale e faunistico", complexity: "0,95" },
  { code: "U.03", description: "Strumenti di pianificazione generale, attuativa e di settore", complexity: "1,00" }
];

export function workReferenceSortValue(code: string) {
  const normalized = code.trim().toUpperCase().replace(/\s+/g, "");
  const match = normalized.match(/^([A-Z]+)\.?(\d+)/);
  const prefix = match?.[1] ?? normalized;
  const groupIndex = workReferenceGroupOrder.indexOf(prefix);
  const numeric = Number(match?.[2] ?? "0");
  return (groupIndex === -1 ? 999 : groupIndex) * 100 + numeric;
}

export function workReferenceLabel(work: { code: string; description?: string | null; category?: string | null }) {
  return `${work.code}${work.description ? ` - ${work.description}` : ""}${work.category ? ` - G ${work.category}` : ""}`;
}
