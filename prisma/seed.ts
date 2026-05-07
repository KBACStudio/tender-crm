import { PrismaClient, SubjectType } from "@prisma/client";

const prisma = new PrismaClient();

function daysFromNow(days: number) {
  return new Date(Date.now() + days * 86_400_000);
}

async function main() {
  await prisma.tenderSoaRequirement.deleteMany();
  await prisma.tenderWorkRequirement.deleteMany();
  await prisma.tenderTask.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.grouping.deleteMany();
  await prisma.tender.deleteMany();
  await prisma.serviceAssignment.deleteMany();
  await prisma.serviceDesignLevel.deleteMany();
  await prisma.serviceWorkItem.deleteMany();
  await prisma.note.deleteMany();
  await prisma.document.deleteMany();
  await prisma.service.deleteMany();
  await prisma.revenueHistory.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.personOperator.deleteMany();
  await prisma.soaQualification.deleteMany();
  await prisma.soaCertificate.deleteMany();
  await prisma.workReference.deleteMany();
  await prisma.economicOperator.deleteMany();
  await prisma.personCompany.deleteMany();
  await prisma.personalCertification.deleteMany();
  await prisma.professional.deleteMany();
  await prisma.person.deleteMany();
  await prisma.company.deleteMany();

  const buildCo = await prisma.company.create({
    data: {
      name: "Edilstrade Centro S.r.l.",
      subjectType: SubjectType.construction_company,
      vatNumber: "02844120548",
      email: "info@edilstrade-centro.test",
      pec: "edilstradecentro@pec.test",
      city: "Perugia",
      province: "PG",
      notes: "Impresa edile partner per opere viarie e urbanizzazioni."
    }
  });
  const engCo = await prisma.company.create({
    data: {
      name: "Studio Tecnico Prisma Engineering S.r.l.",
      subjectType: SubjectType.engineering_company,
      vatNumber: "03488270122",
      email: "segreteria@prisma-engineering.test",
      city: "Bologna",
      province: "BO"
    }
  });
  const studio = await prisma.company.create({
    data: {
      name: "Studio Associato Architettura Nord",
      subjectType: SubjectType.professional_studio,
      vatNumber: "01934530981",
      city: "Milano",
      province: "MI"
    }
  });

  const buildOp = await prisma.economicOperator.create({ data: { companyId: buildCo.id, displayName: buildCo.name, operatorType: "company", availableForAvvalimento: true, tags: "OG3, OG1, appalto integrato, lavori stradali" } });
  const engOp = await prisma.economicOperator.create({ data: { companyId: engCo.id, displayName: engCo.name, operatorType: "company", tags: "PFTE, strutture, sicurezza, E.08" } });
  const studioOp = await prisma.economicOperator.create({ data: { companyId: studio.id, displayName: studio.name, operatorType: "company", tags: "architettura, restauro, E.22" } });

  const anna = await prisma.person.create({ data: { firstName: "Anna", lastName: "Rinaldi", email: "anna.rinaldi@test.local", pec: "anna.rinaldi@pec.test", phone: "+39 051 000001", fiscalCode: "RNLNNA82A41A944X", birthPlace: "Bologna", birthDate: daysFromNow(-16000), residenceAddress: "Via Emilia 20, Bologna", educationTitle: "Laurea in Ingegneria Civile", university: "Universita di Bologna", graduationDate: daysFromNow(-7000), qualificationDate: daysFromNow(-6800), professionalOrder: "Ordine Ingegneri", professionalOrderProvince: "BO", professionalOrderNumber: "B-7810", professionalOrderRegistrationDate: daysFromNow(-6700), inarcassaNumber: "987654" } });
  const marco = await prisma.person.create({ data: { firstName: "Marco", lastName: "Conti", email: "marco.conti@test.local", pec: "marco.conti@pec.test", phone: "+39 02 000002", fiscalCode: "CNTMRC79C10F205Z", birthPlace: "Milano", birthDate: daysFromNow(-17000), residenceAddress: "Via Manzoni 8, Milano", educationTitle: "Laurea in Architettura", university: "Politecnico di Milano", qualificationDate: daysFromNow(-7200), professionalOrder: "Ordine Architetti", professionalOrderProvince: "MI", professionalOrderNumber: "A-18422", professionalOrderRegistrationDate: daysFromNow(-7100), inarcassaNumber: "123456" } });
  const luca = await prisma.person.create({ data: { firstName: "Luca", lastName: "Ferretti", email: "luca.ferretti@test.local" } });

  await prisma.personCompany.createMany({
    data: [
      { personId: anna.id, companyId: engCo.id, role: "administrator", title: "Amministratrice unica" },
      { personId: marco.id, companyId: studio.id, role: "consultant", title: "Architetto senior" },
      { personId: luca.id, companyId: buildCo.id, role: "technical_director", title: "Direttore tecnico" }
    ]
  });
  await prisma.personOperator.createMany({
    data: [
      { personId: anna.id, operatorId: engOp.id, role: "administrator", title: "Amministratrice unica" },
      { personId: marco.id, operatorId: studioOp.id, role: "consultant", title: "Architetto senior" },
      { personId: luca.id, operatorId: buildOp.id, role: "technical_director", title: "Direttore tecnico" }
    ]
  });

  const marcoPro = await prisma.professional.create({ data: { personId: marco.id, register: "Ordine Architetti Milano", registerNumber: "A-18422", specialization: "Restauro e progettazione architettonica", vatNumber: "11223344550", insured: true } });
  const annaPro = await prisma.professional.create({ data: { personId: anna.id, register: "Ordine Ingegneri Bologna", registerNumber: "B-7810", specialization: "Strutture e coordinamento sicurezza", insured: true } });
  const marcoOp = await prisma.economicOperator.create({ data: { professionalId: marcoPro.id, displayName: "Conti Marco", operatorType: "professional", tags: "E.22, chiese, restauro" } });
  const annaOp = await prisma.economicOperator.create({ data: { professionalId: annaPro.id, displayName: "Rinaldi Anna", operatorType: "professional", availableForAvvalimento: true, tags: "CSP, CSE, strutture" } });

  await prisma.revenueHistory.createMany({
    data: [
      { operatorId: buildOp.id, year: 2025, revenue: "4200000.00", source: "Bilancio 2025" },
      { operatorId: buildOp.id, year: 2024, revenue: "3850000.00", source: "Bilancio 2024" },
      { operatorId: engOp.id, year: 2025, revenue: "1250000.00", source: "Bilancio 2025" },
      { operatorId: studioOp.id, year: 2025, revenue: "680000.00", source: "Bilancio 2025" },
      { operatorId: marcoOp.id, year: 2025, revenue: "145000.00", source: "Dichiarazione professionista" }
    ]
  });

  await prisma.certification.createMany({
    data: [
      { operatorId: engOp.id, companyId: engCo.id, type: "ISO 9001", number: "Q-2044-IT", issuingBody: "CertiQuality", issuedAt: daysFromNow(-320), expiresAt: daysFromNow(45), notes: "Sistema qualita progettazione.", availableForAvvalimento: true },
      { operatorId: engOp.id, companyId: engCo.id, type: "Parita di genere UNI/PdR 125", number: "PG-1201", issuingBody: "Rina", issuedAt: daysFromNow(-100), expiresAt: daysFromNow(500), availableForAvvalimento: true },
      { operatorId: buildOp.id, companyId: buildCo.id, type: "ISO 14001", number: "E-1880", issuingBody: "Bureau Veritas", issuedAt: daysFromNow(-700), expiresAt: daysFromNow(140) },
      { operatorId: marcoOp.id, type: "ISO 9001", number: "Q-PRO-778", issuingBody: "CertiQuality", issuedAt: daysFromNow(-120), expiresAt: daysFromNow(820), notes: "Certificazione personale di studio professionale." }
    ]
  });

  await prisma.soaCertificate.create({
    data: {
      companyId: buildCo.id,
      certificateNumber: "SOA-2025-8841",
      issuingBody: "SOA Italia",
      issuedAt: daysFromNow(-900),
      expiresAt: daysFromNow(60),
      notes: "Attestazione unica con categorie lavori.",
      qualifications: { create: [{ category: "OG3", ranking: "IV-bis" }, { category: "OG1", ranking: "III" }] }
    }
  });

  const workA = await prisma.workReference.create({ data: { code: "OP-2025-014-A", category: "E.08 edilizia scolastica", description: "Corpo scuola primaria" } });
  const workB = await prisma.workReference.create({ data: { code: "OP-2025-014-B", category: "S.03 strutture", description: "Adeguamento strutturale" } });
  const workTender = await prisma.workReference.create({ data: { code: "OP-2026-002", category: "E.08", description: "Nuovo polo civico" } });

  const service = await prisma.service.create({
    data: {
      title: "Riqualificazione scuola primaria Don Milani",
      client: "Comune di Faenza",
      feeAmount: "185000.00",
      startedAt: daysFromNow(-210),
      endedAt: daysFromNow(-30),
      assignments: {
        create: [
          { operatorId: engOp.id, role: "Progettazione strutturale", executionPercent: "60.00" },
          { operatorId: marcoOp.id, role: "Progettazione architettonica", executionPercent: "40.00" }
        ]
      },
      workItems: {
        create: [
          { workReferenceId: workA.id, workId: workA.code, workCategory: workA.category, workValue: "820000.00", sharePercent: "65.00" },
          { workReferenceId: workB.id, workId: workB.code, workCategory: workB.category, workValue: "430000.00", sharePercent: "35.00" }
        ]
      },
      levels: {
        create: [{ level: "PFTE" }, { level: "executive_design" }, { level: "CSP" }]
      }
    }
  });

  await prisma.tender.create({
    data: {
      object: "Progettazione e lavori per nuovo polo civico",
      cig: "B123456789",
      cup: "J11B25000010004",
      place: "Rimini",
      contractingBody: "Comune di Rimini",
      value: "2450000.00",
      publishedAt: daysFromNow(-10),
      deadline: daysFromNow(25),
      outcome: "submitted",
      grouping: {
        create: {
          name: "RTI Prisma - Edilstrade - Rinaldi",
          type: "RTI costituendo",
          members: { create: [{ operatorId: engOp.id, role: "leader", sharePercent: "45.00" }, { operatorId: buildOp.id, role: "member", sharePercent: "35.00" }, { operatorId: annaOp.id, role: "young_professional", sharePercent: "20.00" }] }
        }
      },
      workRequirements: { create: [{ workReferenceId: workTender.id, workId: workTender.code, category: workTender.category, amount: "2450000.00" }] },
      soaRequirements: { create: [{ category: "OG3", ranking: "IV-bis" }] },
      tasks: { create: [{ title: "Richiedere DGUE ai componenti RTP", area: "administrative", status: "todo", dueDate: daysFromNow(7) }, { title: "Preparare matrice criteri offerta tecnica", area: "technical_offer", status: "doing", dueDate: daysFromNow(12), operatorId: engOp.id }, { title: "Verificare attestazione SOA OG3", area: "rtp", status: "done", dueDate: daysFromNow(3), operatorId: buildOp.id }] }
    }
  });

  await prisma.note.create({ data: { serviceId: service.id, body: "Referenza utile per gare edilizia scolastica e adeguamento sismico." } });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
