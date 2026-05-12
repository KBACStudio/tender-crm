import { ContractMilestoneStatus, ContractStatus, ContractTaskArea, ContractTaskStatus, DesignLevel, GroupMemberRole, PersonCompanyRole, SubjectType, TenderOutcome, TenderTaskArea, TenderTaskStatus, UserRole } from "@prisma/client";

export const subjectTypeLabels: Record<SubjectType, string> = {
  construction_company: "Impresa edile",
  engineering_company: "Societa di ingegneria",
  professional_studio: "Studio professionale",
  consultant: "Consulente",
  other: "Altro"
};

export const personRoleLabels: Record<PersonCompanyRole, string> = {
  administrator: "Amministratore",
  employee: "Dipendente",
  consultant: "Consulente",
  contact: "Referente",
  legal_representative: "Legale rappresentante",
  technical_director: "Direttore tecnico",
  other: "Altro"
};

export const designLevelLabels: Record<DesignLevel, string> = {
  PFTE: "PFTE",
  final_design: "Definitivo",
  executive_design: "Esecutivo",
  CSP: "CSP",
  CSE: "CSE",
  works_management: "Direzione lavori",
  testing: "Collaudo",
  other: "Altro"
};

export const tenderOutcomeLabels: Record<TenderOutcome, string> = {
  draft: "Bozza",
  submitted: "Presentata",
  awarded: "Aggiudicata",
  lost: "Non aggiudicata",
  cancelled: "Annullata",
  unknown: "Non noto"
};

export const groupRoleLabels: Record<GroupMemberRole, string> = {
  leader: "Mandatario",
  member: "Mandante",
  consultant: "Consulente",
  designer: "Progettista",
  young_professional: "Giovane professionista",
  other: "Altro"
};

export const tenderTaskStatusLabels: Record<TenderTaskStatus, string> = {
  todo: "Da fare",
  doing: "In corso",
  done: "Fatto"
};

export const tenderTaskAreaLabels: Record<TenderTaskArea, string> = {
  administrative: "Amministrativa",
  technical_offer: "Offerta tecnica",
  economic_offer: "Offerta economica",
  rtp: "RTP",
  general: "Generale"
};

export const contractStatusLabels: Record<ContractStatus, string> = {
  draft: "Bozza",
  active: "In corso",
  suspended: "Sospeso",
  closed: "Chiuso"
};

export const userRoleLabels: Record<UserRole, string> = {
  admin: "Admin",
  operator: "Operativo",
  viewer: "Sola lettura"
};

export const contractTaskStatusLabels: Record<ContractTaskStatus, string> = {
  todo: "Da fare",
  doing: "In corso",
  done: "Fatto"
};

export const contractTaskAreaLabels: Record<ContractTaskArea, string> = {
  setup: "Setup",
  execution: "Esecuzione",
  accounting: "Contabilita",
  variations: "Varianti",
  closing: "Chiusura",
  general: "Generale"
};

export const contractMilestoneStatusLabels: Record<ContractMilestoneStatus, string> = {
  planned: "Pianificato",
  in_progress: "In corso",
  done: "Completato",
  cancelled: "Annullato"
};

export const soaCategoryDescriptions: Record<string, string> = {
  OG1: "Edifici civili e industriali",
  OG2: "Restauro e manutenzione dei beni immobili sottoposti a tutela",
  OG3: "Strade, autostrade, ponti, viadotti, ferrovie, metropolitane",
  OG4: "Opere d'arte nel sottosuolo",
  OG5: "Dighe",
  OG6: "Acquedotti, gasdotti, oleodotti, opere di irrigazione e di evacuazione",
  OG7: "Opere marittime e lavori di dragaggio",
  OG8: "Opere fluviali, di difesa, di sistemazione idraulica e di bonifica",
  OG9: "Impianti per la produzione di energia elettrica",
  OG10: "Impianti per la trasformazione alta/media tensione e per la distribuzione di energia elettrica in corrente alternata e continua ed impianti di pubblica illuminazione",
  OG11: "Impianti tecnologici",
  OG12: "Opere ed impianti di bonifica e protezione ambientale",
  OG13: "Opere di ingegneria naturalistica",
  OS1: "Lavori in terra",
  "OS2-A": "Superfici decorate di beni immobili del patrimonio culturale e beni culturali mobili di interesse storico, artistico, archeologico ed etnoantropologico",
  "OS2-B": "Beni culturali mobili di interesse archivistico e librario",
  OS3: "Impianti idrico-sanitario, cucine, lavanderie",
  OS4: "Impianti elettromeccanici trasportatori",
  OS5: "Impianti pneumatici e antintrusione",
  OS6: "Finiture di opere generali in materiali lignei, plastici, metallici e vetrosi",
  OS7: "Finiture di opere generali di natura edile e tecnica",
  OS8: "Opere di impermeabilizzazione",
  OS9: "Impianti per la segnaletica luminosa e la sicurezza del traffico",
  OS10: "Segnaletica stradale non luminosa",
  OS11: "Apparecchiature strutturali speciali",
  "OS12-A": "Barriere stradali di sicurezza",
  "OS12-B": "Barriere paramassi, fermaneve e simili",
  OS13: "Strutture prefabbricate in cemento armato",
  OS14: "Impianti di smaltimento e recupero rifiuti",
  OS15: "Pulizia di acque marine, lacustri, fluviali",
  OS16: "Impianti per centrali produzione energia elettrica",
  OS17: "Linee telefoniche ed impianti di telefonia",
  "OS18-A": "Componenti strutturali in acciaio",
  "OS18-B": "Componenti per facciate continue",
  OS19: "Impianti di reti di telecomunicazione e di trasmissioni e trattamento",
  "OS20-A": "Rilevamenti topografici",
  "OS20-B": "Indagini geognostiche",
  OS21: "Opere strutturali speciali",
  OS22: "Impianti di potabilizzazione e depurazione",
  OS23: "Demolizione di opere",
  OS24: "Verde e arredo urbano",
  OS25: "Scavi archeologici",
  OS26: "Pavimentazioni e sovrastrutture speciali",
  OS27: "Impianti per la trazione elettrica",
  OS28: "Impianti termici e di condizionamento",
  OS29: "Armamento ferroviario",
  OS30: "Impianti interni elettrici, telefonici, radiotelefonici e televisivi",
  OS31: "Impianti per la mobilita sospesa",
  OS32: "Strutture in legno",
  OS33: "Coperture speciali",
  OS34: "Sistemi antirumore per infrastrutture di mobilita",
  OS35: "Interventi a basso impatto ambientale"
};

export const soaCategories = Object.keys(soaCategoryDescriptions);

export function soaCategoryLabel(category: string) {
  return `${category} - ${soaCategoryDescriptions[category] ?? category}`;
}

export const soaRankings = ["I", "II", "III", "III-bis", "IV", "IV-bis", "V", "VI", "VII", "VIII"];
