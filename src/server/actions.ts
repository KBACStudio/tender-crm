"use server";

import { DesignLevel, GroupMemberRole, PersonCompanyRole, SubjectType, TenderOutcome, TenderTaskArea, TenderTaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { optionalBoolean, optionalDate, optionalDecimal, optionalString, requiredString } from "@/server/form";

function enumValue<T extends Record<string, string>>(source: T, value: FormDataEntryValue | null, fallback: T[keyof T]) {
  return Object.values(source).includes(String(value)) ? (String(value) as T[keyof T]) : fallback;
}

function jsonRows(formData: FormData, key: string): Record<string, string>[] {
  const raw = optionalString(formData, key);
  if (!raw) return [];
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed.filter((row) => row && typeof row === "object") : [];
}

export async function upsertCompany(id: string | null, formData: FormData) {
  const data = {
    name: requiredString(formData, "name"),
    subjectType: enumValue(SubjectType, formData.get("subjectType"), SubjectType.other),
    vatNumber: optionalString(formData, "vatNumber"),
    fiscalCode: optionalString(formData, "fiscalCode"),
    email: optionalString(formData, "email"),
    pec: optionalString(formData, "pec"),
    phone: optionalString(formData, "phone"),
    website: optionalString(formData, "website"),
    address: optionalString(formData, "address"),
    city: optionalString(formData, "city"),
    province: optionalString(formData, "province"),
    notes: optionalString(formData, "notes")
  };
  const company = id ? await prisma.company.update({ where: { id }, data }) : await prisma.company.create({ data });
  await prisma.economicOperator.upsert({
    where: { companyId: company.id },
    create: { companyId: company.id, displayName: company.name, operatorType: "company", availableForAvvalimento: optionalBoolean(formData, "availableForAvvalimento"), tags: optionalString(formData, "tags") },
    update: { displayName: company.name, operatorType: "company", availableForAvvalimento: optionalBoolean(formData, "availableForAvvalimento"), tags: optionalString(formData, "tags") }
  });
  revalidatePath("/companies");
  redirect(`/companies/${company.id}`);
}

export async function createEconomicOperator(formData: FormData) {
  const operatorKind = optionalString(formData, "operatorKind") ?? "company";
  if (operatorKind === "professional") {
    const person = await prisma.person.create({
      data: {
        firstName: requiredString(formData, "firstName"),
        lastName: requiredString(formData, "lastName"),
        email: optionalString(formData, "email"),
        pec: optionalString(formData, "pec"),
        phone: optionalString(formData, "phone"),
        fiscalCode: optionalString(formData, "fiscalCode"),
        birthPlace: optionalString(formData, "birthPlace"),
        birthDate: optionalDate(formData, "birthDate"),
        residenceAddress: optionalString(formData, "residenceAddress"),
        educationTitle: optionalString(formData, "educationTitle"),
        university: optionalString(formData, "university"),
        qualificationDate: optionalDate(formData, "qualificationDate"),
        professionalOrder: optionalString(formData, "professionalOrder"),
        professionalOrderProvince: optionalString(formData, "professionalOrderProvince"),
        professionalOrderNumber: optionalString(formData, "professionalOrderNumber"),
        professionalOrderRegistrationDate: optionalDate(formData, "professionalOrderRegistrationDate"),
        inarcassaNumber: optionalString(formData, "inarcassaNumber"),
        notes: optionalString(formData, "notes")
      }
    });
    const professional = await prisma.professional.create({
      data: {
        personId: person.id,
        register: optionalString(formData, "professionalOrder"),
        registerNumber: optionalString(formData, "professionalOrderNumber"),
        specialization: optionalString(formData, "specialization"),
        vatNumber: optionalString(formData, "vatNumber")
      }
    });
    const operator = await prisma.economicOperator.create({
      data: {
        professionalId: professional.id,
        displayName: `${person.lastName} ${person.firstName}`,
        operatorType: "professional",
        availableForAvvalimento: optionalBoolean(formData, "availableForAvvalimento"),
        tags: optionalString(formData, "tags")
      }
    });
    redirect(`/operators/${operator.id}`);
  }

  const company = await prisma.company.create({
    data: {
      name: requiredString(formData, "name"),
      subjectType: enumValue(SubjectType, formData.get("subjectType"), SubjectType.other),
      vatNumber: optionalString(formData, "vatNumber"),
      fiscalCode: optionalString(formData, "fiscalCode"),
      email: optionalString(formData, "email"),
      pec: optionalString(formData, "pec"),
      phone: optionalString(formData, "phone"),
      website: optionalString(formData, "website"),
      address: optionalString(formData, "address"),
      city: optionalString(formData, "city"),
      province: optionalString(formData, "province"),
      notes: optionalString(formData, "notes")
    }
  });
  const operator = await prisma.economicOperator.create({
    data: {
      companyId: company.id,
      displayName: company.name,
      operatorType: "company",
      availableForAvvalimento: optionalBoolean(formData, "availableForAvvalimento"),
      tags: optionalString(formData, "tags")
    }
  });
  redirect(`/operators/${operator.id}`);
}

export async function updateEconomicOperator(id: string, formData: FormData) {
  const operator = await prisma.economicOperator.findUnique({ where: { id }, include: { company: true, professional: { include: { person: true } } } });
  if (!operator) redirect("/operators");

  const common = {
    availableForAvvalimento: optionalBoolean(formData, "availableForAvvalimento"),
    tags: optionalString(formData, "tags"),
    notes: optionalString(formData, "notes")
  };

  if (operator.operatorType === "professional" && operator.professional?.person) {
    const person = await prisma.person.update({
      where: { id: operator.professional.personId },
      data: {
        firstName: requiredString(formData, "firstName"),
        lastName: requiredString(formData, "lastName"),
        email: optionalString(formData, "email"),
        pec: optionalString(formData, "pec"),
        phone: optionalString(formData, "phone"),
        fiscalCode: optionalString(formData, "fiscalCode"),
        birthPlace: optionalString(formData, "birthPlace"),
        birthDate: optionalDate(formData, "birthDate"),
        residenceAddress: optionalString(formData, "residenceAddress"),
        educationTitle: optionalString(formData, "educationTitle"),
        university: optionalString(formData, "university"),
        qualificationDate: optionalDate(formData, "qualificationDate"),
        professionalOrder: optionalString(formData, "professionalOrder"),
        professionalOrderProvince: optionalString(formData, "professionalOrderProvince"),
        professionalOrderNumber: optionalString(formData, "professionalOrderNumber"),
        professionalOrderRegistrationDate: optionalDate(formData, "professionalOrderRegistrationDate"),
        inarcassaNumber: optionalString(formData, "inarcassaNumber"),
        notes: optionalString(formData, "notes")
      }
    });
    await prisma.professional.update({
      where: { id: operator.professional.id },
      data: {
        register: optionalString(formData, "professionalOrder"),
        registerNumber: optionalString(formData, "professionalOrderNumber"),
        specialization: optionalString(formData, "specialization"),
        vatNumber: optionalString(formData, "vatNumber")
      }
    });
    await prisma.economicOperator.update({ where: { id }, data: { ...common, displayName: `${person.lastName} ${person.firstName}` } });
    revalidatePath(`/operators/${id}`);
    redirect(`/operators/${id}`);
  }

  if (operator.company) {
    const company = await prisma.company.update({
      where: { id: operator.company.id },
      data: {
        name: requiredString(formData, "name"),
        subjectType: enumValue(SubjectType, formData.get("subjectType"), SubjectType.other),
        vatNumber: optionalString(formData, "vatNumber"),
        fiscalCode: optionalString(formData, "fiscalCode"),
        email: optionalString(formData, "email"),
        pec: optionalString(formData, "pec"),
        phone: optionalString(formData, "phone"),
        website: optionalString(formData, "website"),
        address: optionalString(formData, "address"),
        city: optionalString(formData, "city"),
        province: optionalString(formData, "province"),
        notes: optionalString(formData, "notes")
      }
    });
    await prisma.economicOperator.update({ where: { id }, data: { ...common, displayName: company.name } });
  }

  revalidatePath("/operators");
  revalidatePath(`/operators/${id}`);
  redirect(`/operators/${id}`);
}

export async function deleteEconomicOperator(id: string) {
  const operator = await prisma.economicOperator.findUnique({ where: { id }, select: { companyId: true, professional: { select: { personId: true } } } });
  if (operator?.companyId) {
    await prisma.company.delete({ where: { id: operator.companyId } });
  } else if (operator?.professional?.personId) {
    await prisma.person.delete({ where: { id: operator.professional.personId } });
  } else {
    await prisma.economicOperator.delete({ where: { id } });
  }
  revalidatePath("/operators");
  redirect("/operators");
}

export async function deleteCompany(id: string) {
  await prisma.company.delete({ where: { id } });
  revalidatePath("/companies");
  redirect("/companies");
}

export async function upsertPerson(id: string | null, formData: FormData) {
  const markProfessional = optionalBoolean(formData, "markProfessional");
  const data = {
    firstName: requiredString(formData, "firstName"),
    lastName: requiredString(formData, "lastName"),
    email: optionalString(formData, "email"),
    pec: optionalString(formData, "pec"),
    phone: optionalString(formData, "phone"),
    fiscalCode: optionalString(formData, "fiscalCode"),
    birthPlace: optionalString(formData, "birthPlace"),
    birthDate: optionalDate(formData, "birthDate"),
    residenceAddress: optionalString(formData, "residenceAddress"),
    educationTitle: optionalString(formData, "educationTitle"),
    university: optionalString(formData, "university"),
    graduationDate: optionalDate(formData, "graduationDate"),
    qualificationDate: optionalDate(formData, "qualificationDate"),
    professionalOrder: optionalString(formData, "professionalOrder"),
    professionalOrderProvince: optionalString(formData, "professionalOrderProvince"),
    professionalOrderNumber: optionalString(formData, "professionalOrderNumber"),
    professionalOrderRegistrationDate: optionalDate(formData, "professionalOrderRegistrationDate"),
    inarcassaNumber: optionalString(formData, "inarcassaNumber"),
    notes: optionalString(formData, "notes")
  };
  const person = id ? await prisma.person.update({ where: { id }, data }) : await prisma.person.create({ data });
  const operatorId = optionalString(formData, "operatorId");
  if (operatorId) {
    const role = enumValue(PersonCompanyRole, formData.get("operatorRole"), PersonCompanyRole.contact);
    await prisma.personOperator.upsert({
      where: { personId_operatorId_role: { personId: person.id, operatorId, role } },
      create: {
        personId: person.id,
        operatorId,
        role,
        title: optionalString(formData, "operatorTitle")
      },
      update: { title: optionalString(formData, "operatorTitle") }
    });

    const linkedOperator = await prisma.economicOperator.findUnique({ where: { id: operatorId }, select: { companyId: true } });
    if (linkedOperator?.companyId) {
      await prisma.personCompany.upsert({
        where: { personId_companyId_role: { personId: person.id, companyId: linkedOperator.companyId, role } },
        create: { personId: person.id, companyId: linkedOperator.companyId, role, title: optionalString(formData, "operatorTitle") },
        update: { title: optionalString(formData, "operatorTitle") }
      });
    }
  }
  if (markProfessional) {
    await prisma.professional.upsert({
      where: { personId: person.id },
      create: { personId: person.id },
      update: {}
    });
  }
  revalidatePath("/people");
  redirect(`/people/${person.id}`);
}

export async function deletePerson(id: string) {
  await prisma.person.delete({ where: { id } });
  revalidatePath("/people");
  redirect("/people");
}

export async function upsertProfessional(id: string | null, formData: FormData) {
  const personId = requiredString(formData, "personId");
  const data = {
    personId,
    register: optionalString(formData, "register"),
    registerNumber: optionalString(formData, "registerNumber"),
    specialization: optionalString(formData, "specialization"),
    vatNumber: optionalString(formData, "vatNumber"),
    insured: optionalBoolean(formData, "insured"),
    notes: optionalString(formData, "notes")
  };
  const professional = id ? await prisma.professional.update({ where: { id }, data }) : await prisma.professional.create({ data });
  const person = await prisma.person.findUnique({ where: { id: professional.personId } });
  await prisma.economicOperator.upsert({
    where: { professionalId: professional.id },
    create: { professionalId: professional.id, displayName: person ? `${person.lastName} ${person.firstName}` : "Professionista", operatorType: "professional" },
    update: { displayName: person ? `${person.lastName} ${person.firstName}` : "Professionista", operatorType: "professional" }
  });
  revalidatePath("/professionals");
  redirect(`/professionals/${professional.id}`);
}

export async function deleteProfessional(id: string) {
  await prisma.professional.delete({ where: { id } });
  revalidatePath("/professionals");
  redirect("/professionals");
}

export async function upsertCertification(id: string | null, formData: FormData) {
  const operatorId = requiredString(formData, "operatorId");
  const operator = await prisma.economicOperator.findUnique({ where: { id: operatorId }, select: { companyId: true } });
  const data = {
    operatorId,
    companyId: operator?.companyId ?? null,
    type: requiredString(formData, "type"),
    number: optionalString(formData, "number"),
    issuingBody: optionalString(formData, "issuingBody"),
    issuedAt: optionalDate(formData, "issuedAt"),
    expiresAt: optionalDate(formData, "expiresAt"),
    notes: optionalString(formData, "notes"),
    availableForAvvalimento: optionalBoolean(formData, "availableForAvvalimento")
  };
  const item = id ? await prisma.certification.update({ where: { id }, data }) : await prisma.certification.create({ data });
  revalidatePath("/certifications");
  redirect(`/certifications/${item.id}`);
}

export async function addTenderTask(formData: FormData) {
  const tenderId = requiredString(formData, "tenderId");
  const statusRaw = String(formData.get("status") ?? "todo");
  const areaRaw = String(formData.get("area") ?? "general");
  await prisma.tenderTask.create({
    data: {
      tenderId,
      operatorId: optionalString(formData, "operatorId"),
      title: requiredString(formData, "title"),
      area: Object.values(TenderTaskArea).includes(areaRaw as TenderTaskArea) ? (areaRaw as TenderTaskArea) : TenderTaskArea.general,
      status: Object.values(TenderTaskStatus).includes(statusRaw as TenderTaskStatus) ? (statusRaw as TenderTaskStatus) : TenderTaskStatus.todo,
      dueDate: optionalDate(formData, "dueDate"),
      notes: optionalString(formData, "notes")
    }
  });
  revalidatePath(`/tenders/${tenderId}`);
  redirect(`/tenders/${tenderId}`);
}

export async function updateTenderTaskStatus(taskId: string, tenderId: string, status: TenderTaskStatus) {
  await prisma.tenderTask.update({ where: { id: taskId }, data: { status } });
  revalidatePath(`/tenders/${tenderId}`);
}

export async function deleteCertification(id: string) {
  await prisma.certification.delete({ where: { id } });
  revalidatePath("/certifications");
  redirect("/certifications");
}

export async function upsertSoa(id: string | null, formData: FormData) {
  const qualifications = jsonRows(formData, "qualifications").filter((row) => row.category && row.ranking);
  const data = {
    companyId: requiredString(formData, "companyId"),
    certificateNumber: optionalString(formData, "certificateNumber"),
    issuingBody: optionalString(formData, "issuingBody"),
    issuedAt: optionalDate(formData, "issuedAt"),
    expiresAt: optionalDate(formData, "expiresAt"),
    notes: optionalString(formData, "notes")
  };
  const item = id ? await prisma.soaCertificate.update({ where: { id }, data }) : await prisma.soaCertificate.create({ data });
  await prisma.soaQualification.deleteMany({ where: { soaCertificateId: item.id } });
  if (qualifications.length) {
    await prisma.soaQualification.createMany({
      data: qualifications.map((row) => ({ soaCertificateId: item.id, category: row.category, ranking: row.ranking, notes: row.notes || null }))
    });
  }
  revalidatePath("/soa");
  redirect(`/soa/${item.id}`);
}

export async function deleteSoa(id: string) {
  await prisma.soaCertificate.delete({ where: { id } });
  revalidatePath("/soa");
  redirect("/soa");
}

export async function upsertService(id: string | null, formData: FormData) {
  const operatorId = optionalString(formData, "operatorId");
  const levels = formData.getAll("levels").map(String).filter((value) => Object.values(DesignLevel).includes(value as DesignLevel)) as DesignLevel[];
  const workRows = jsonRows(formData, "workItems").filter((row) => row.workReferenceId || row.workId);
  const data = {
    title: requiredString(formData, "title"),
    client: optionalString(formData, "client"),
    feeAmount: optionalDecimal(formData, "feeAmount"),
    startedAt: optionalDate(formData, "startedAt"),
    endedAt: optionalDate(formData, "endedAt"),
    notes: optionalString(formData, "notes")
  };
  const service = id ? await prisma.service.update({ where: { id }, data }) : await prisma.service.create({ data });
  await prisma.serviceAssignment.deleteMany({ where: { serviceId: service.id } });
  await prisma.serviceWorkItem.deleteMany({ where: { serviceId: service.id } });
  await prisma.serviceDesignLevel.deleteMany({ where: { serviceId: service.id } });
  if (operatorId) {
    await prisma.serviceAssignment.create({
      data: {
        serviceId: service.id,
        operatorId,
        role: optionalString(formData, "assignmentRole"),
        executionPercent: optionalDecimal(formData, "executionPercent")
      }
    });
  }
  if (workRows.length) {
    await prisma.serviceWorkItem.createMany({
      data: workRows.map((row) => ({
        serviceId: service.id,
        workReferenceId: row.workReferenceId || null,
        workId: row.workId,
        workCategory: row.workCategory || null,
        workValue: row.workValue ? row.workValue.replace(",", ".") : null,
        sharePercent: row.sharePercent ? row.sharePercent.replace(",", ".") : null
      }))
    });
  }
  if (levels.length) await prisma.serviceDesignLevel.createMany({ data: levels.map((level) => ({ serviceId: service.id, level })), skipDuplicates: true });
  revalidatePath("/services");
  redirect(`/services/${service.id}`);
}

export async function deleteService(id: string) {
  await prisma.service.delete({ where: { id } });
  revalidatePath("/services");
  redirect("/services");
}

export async function upsertTender(id: string | null, formData: FormData) {
  const workRows = jsonRows(formData, "workRequirements").filter((row) => row.workReferenceId || row.workId);
  const soaRows = jsonRows(formData, "soaRequirements").filter((row) => row.category);
  const groupRows = jsonRows(formData, "groupMembers").filter((row) => row.operatorId);
  const data = {
    object: requiredString(formData, "object"),
    cig: requiredString(formData, "cig"),
    cup: optionalString(formData, "cup"),
    place: optionalString(formData, "place"),
    contractingBody: optionalString(formData, "contractingBody"),
    value: optionalDecimal(formData, "value"),
    publishedAt: optionalDate(formData, "publishedAt"),
    deadline: optionalDate(formData, "deadline"),
    outcome: enumValue(TenderOutcome, formData.get("outcome"), TenderOutcome.draft),
    notes: optionalString(formData, "notes")
  };
  const tender = id ? await prisma.tender.update({ where: { id }, data }) : await prisma.tender.create({ data });
  await prisma.tenderWorkRequirement.deleteMany({ where: { tenderId: tender.id } });
  await prisma.tenderSoaRequirement.deleteMany({ where: { tenderId: tender.id } });
  if (workRows.length) {
    await prisma.tenderWorkRequirement.createMany({
      data: workRows.map((row) => ({
        tenderId: tender.id,
        workReferenceId: row.workReferenceId || null,
        workId: row.workId,
        category: row.category || null,
        amount: row.amount ? row.amount.replace(",", ".") : null
      }))
    });
  }
  if (soaRows.length) await prisma.tenderSoaRequirement.createMany({ data: soaRows.map((row) => ({ tenderId: tender.id, category: row.category, ranking: row.ranking || null })) });
  if (groupRows.length) {
    const grouping = await prisma.grouping.upsert({
      where: { tenderId: tender.id },
      create: { tenderId: tender.id, name: optionalString(formData, "groupingName") ?? `RTI ${tender.cig}`, type: "RTI" },
      update: { name: optionalString(formData, "groupingName") ?? `RTI ${tender.cig}` }
    });
    await prisma.groupMember.deleteMany({ where: { groupingId: grouping.id } });
    await prisma.groupMember.createMany({
      data: groupRows.map((row) => ({
        groupingId: grouping.id,
        operatorId: row.operatorId,
        role: Object.values(GroupMemberRole).includes(row.role as GroupMemberRole) ? (row.role as GroupMemberRole) : GroupMemberRole.member,
        sharePercent: row.sharePercent ? row.sharePercent.replace(",", ".") : null,
        notes: row.notes || null
      }))
    });
  }
  revalidatePath("/tenders");
  redirect(`/tenders/${tender.id}`);
}

export async function deleteTender(id: string) {
  await prisma.tender.delete({ where: { id } });
  revalidatePath("/tenders");
  redirect("/tenders");
}

export async function upsertGrouping(id: string | null, formData: FormData) {
  const operatorId = optionalString(formData, "operatorId");
  const tenderId = id ? null : requiredString(formData, "tenderId");
  const data = {
    name: requiredString(formData, "name"),
    type: optionalString(formData, "type") ?? "RTI",
    notes: optionalString(formData, "notes")
  };
  const grouping = id ? await prisma.grouping.update({ where: { id }, data }) : await prisma.grouping.create({ data: { ...data, tenderId: tenderId as string } });
  if (operatorId) {
    await prisma.groupMember.create({
      data: {
        groupingId: grouping.id,
        operatorId,
        role: enumValue(GroupMemberRole, formData.get("memberRole"), GroupMemberRole.member),
        sharePercent: optionalDecimal(formData, "sharePercent"),
        notes: optionalString(formData, "memberNotes")
      }
    });
  }
  revalidatePath("/groups");
  redirect(`/groups/${grouping.id}`);
}

export async function addRevenueHistory(formData: FormData) {
  const operatorId = requiredString(formData, "operatorId");
  await prisma.revenueHistory.upsert({
    where: { operatorId_year: { operatorId, year: Number(requiredString(formData, "year")) } },
    create: {
      operatorId,
      year: Number(requiredString(formData, "year")),
      revenue: requiredString(formData, "revenue").replace(",", "."),
      source: optionalString(formData, "source"),
      notes: optionalString(formData, "notes")
    },
    update: {
      revenue: requiredString(formData, "revenue").replace(",", "."),
      source: optionalString(formData, "source"),
      notes: optionalString(formData, "notes")
    }
  });
  revalidatePath("/operators");
  revalidatePath(`/operators/${operatorId}`);
  redirect(`/operators/${operatorId}`);
}

export async function createWorkReference(formData: FormData) {
  await prisma.workReference.create({
    data: {
      code: requiredString(formData, "code"),
      category: optionalString(formData, "category"),
      description: optionalString(formData, "description"),
      notes: optionalString(formData, "notes")
    }
  });
  revalidatePath("/works");
  redirect("/works");
}

export async function deleteWorkReference(id: string) {
  await prisma.workReference.delete({ where: { id } });
  revalidatePath("/works");
  redirect("/works");
}

export async function deleteGrouping(id: string) {
  await prisma.grouping.delete({ where: { id } });
  revalidatePath("/groups");
  redirect("/groups");
}

export async function addPersonCompany(formData: FormData) {
  const companyId = requiredString(formData, "companyId");
  await prisma.personCompany.create({
    data: {
      companyId,
      personId: requiredString(formData, "personId"),
      role: enumValue(PersonCompanyRole, formData.get("role"), PersonCompanyRole.contact),
      title: optionalString(formData, "title"),
      notes: optionalString(formData, "notes")
    }
  });
  revalidatePath(`/companies/${companyId}`);
  redirect(`/companies/${companyId}`);
}
