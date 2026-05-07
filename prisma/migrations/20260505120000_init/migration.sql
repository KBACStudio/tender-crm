-- CreateEnum
CREATE TYPE "SubjectType" AS ENUM ('construction_company', 'engineering_company', 'professional_studio', 'consultant', 'other');

-- CreateEnum
CREATE TYPE "OperatorType" AS ENUM ('company', 'professional');

-- CreateEnum
CREATE TYPE "PersonCompanyRole" AS ENUM ('administrator', 'employee', 'consultant', 'contact', 'legal_representative', 'technical_director', 'other');

-- CreateEnum
CREATE TYPE "DesignLevel" AS ENUM ('PFTE', 'final_design', 'executive_design', 'CSP', 'CSE', 'works_management', 'testing', 'other');

-- CreateEnum
CREATE TYPE "TenderOutcome" AS ENUM ('draft', 'submitted', 'awarded', 'lost', 'cancelled', 'unknown');

-- CreateEnum
CREATE TYPE "GroupMemberRole" AS ENUM ('leader', 'member', 'consultant', 'designer', 'young_professional', 'other');

-- CreateEnum
CREATE TYPE "TenderTaskStatus" AS ENUM ('todo', 'doing', 'done');

-- CreateEnum
CREATE TYPE "TenderTaskArea" AS ENUM ('administrative', 'technical_offer', 'economic_offer', 'rtp', 'general');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subjectType" "SubjectType" NOT NULL DEFAULT 'other',
    "vatNumber" TEXT,
    "fiscalCode" TEXT,
    "email" TEXT,
    "pec" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "address" TEXT,
    "city" TEXT,
    "province" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "pec" TEXT,
    "phone" TEXT,
    "fiscalCode" TEXT,
    "birthPlace" TEXT,
    "birthDate" TIMESTAMP(3),
    "residenceAddress" TEXT,
    "educationTitle" TEXT,
    "university" TEXT,
    "graduationDate" TIMESTAMP(3),
    "qualificationDate" TIMESTAMP(3),
    "professionalOrder" TEXT,
    "professionalOrderProvince" TEXT,
    "professionalOrderNumber" TEXT,
    "professionalOrderRegistrationDate" TIMESTAMP(3),
    "inarcassaNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonCompany" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "role" "PersonCompanyRole" NOT NULL DEFAULT 'contact',
    "title" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "PersonCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professional" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "register" TEXT,
    "registerNumber" TEXT,
    "specialization" TEXT,
    "vatNumber" TEXT,
    "insured" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Professional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalCertification" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "PersonalCertification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EconomicOperator" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "operatorType" "OperatorType" NOT NULL,
    "companyId" TEXT,
    "professionalId" TEXT,
    "notes" TEXT,
    "availableForAvvalimento" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EconomicOperator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenueHistory" (
    "id" TEXT NOT NULL,
    "operatorId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "revenue" DECIMAL(14,2) NOT NULL,
    "source" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RevenueHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonOperator" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "operatorId" TEXT NOT NULL,
    "role" "PersonCompanyRole" NOT NULL DEFAULT 'contact',
    "title" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "PersonOperator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "operatorId" TEXT NOT NULL,
    "companyId" TEXT,
    "type" TEXT NOT NULL,
    "number" TEXT,
    "issuingBody" TEXT,
    "issuedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "notes" TEXT,
    "availableForAvvalimento" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoaCertificate" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "certificateNumber" TEXT,
    "issuingBody" TEXT,
    "issuedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SoaCertificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoaQualification" (
    "id" TEXT NOT NULL,
    "soaCertificateId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "ranking" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "SoaQualification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkReference" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "notes" TEXT,

    CONSTRAINT "WorkReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "client" TEXT,
    "feeAmount" DECIMAL(14,2),
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceAssignment" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "operatorId" TEXT,
    "role" TEXT,
    "executionPercent" DECIMAL(5,2),
    "notes" TEXT,

    CONSTRAINT "ServiceAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceWorkItem" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "workReferenceId" TEXT,
    "workId" TEXT NOT NULL,
    "workCategory" TEXT,
    "workValue" DECIMAL(14,2),
    "sharePercent" DECIMAL(5,2),
    "notes" TEXT,

    CONSTRAINT "ServiceWorkItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceDesignLevel" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "level" "DesignLevel" NOT NULL,

    CONSTRAINT "ServiceDesignLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tender" (
    "id" TEXT NOT NULL,
    "object" TEXT NOT NULL,
    "cig" TEXT NOT NULL,
    "cup" TEXT,
    "place" TEXT,
    "contractingBody" TEXT,
    "value" DECIMAL(14,2),
    "publishedAt" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "outcome" "TenderOutcome" NOT NULL DEFAULT 'draft',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenderTask" (
    "id" TEXT NOT NULL,
    "tenderId" TEXT NOT NULL,
    "operatorId" TEXT,
    "title" TEXT NOT NULL,
    "area" "TenderTaskArea" NOT NULL DEFAULT 'general',
    "status" "TenderTaskStatus" NOT NULL DEFAULT 'todo',
    "dueDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenderTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grouping" (
    "id" TEXT NOT NULL,
    "tenderId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'RTI',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grouping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMember" (
    "id" TEXT NOT NULL,
    "groupingId" TEXT NOT NULL,
    "operatorId" TEXT,
    "role" "GroupMemberRole" NOT NULL DEFAULT 'member',
    "sharePercent" DECIMAL(5,2),
    "notes" TEXT,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenderWorkRequirement" (
    "id" TEXT NOT NULL,
    "tenderId" TEXT NOT NULL,
    "workReferenceId" TEXT,
    "workId" TEXT NOT NULL,
    "category" TEXT,
    "amount" DECIMAL(14,2),
    "notes" TEXT,

    CONSTRAINT "TenderWorkRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenderSoaRequirement" (
    "id" TEXT NOT NULL,
    "tenderId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "ranking" TEXT,
    "notes" TEXT,

    CONSTRAINT "TenderSoaRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "companyId" TEXT,
    "personId" TEXT,
    "serviceId" TEXT,
    "tenderId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "companyId" TEXT,
    "personId" TEXT,
    "serviceId" TEXT,
    "tenderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Company_subjectType_idx" ON "Company"("subjectType");

-- CreateIndex
CREATE INDEX "Person_lastName_firstName_idx" ON "Person"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "PersonCompany_companyId_idx" ON "PersonCompany"("companyId");

-- CreateIndex
CREATE INDEX "PersonCompany_personId_idx" ON "PersonCompany"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonCompany_personId_companyId_role_key" ON "PersonCompany"("personId", "companyId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "Professional_personId_key" ON "Professional"("personId");

-- CreateIndex
CREATE INDEX "PersonalCertification_personId_idx" ON "PersonalCertification"("personId");

-- CreateIndex
CREATE INDEX "PersonalCertification_name_idx" ON "PersonalCertification"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EconomicOperator_companyId_key" ON "EconomicOperator"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "EconomicOperator_professionalId_key" ON "EconomicOperator"("professionalId");

-- CreateIndex
CREATE INDEX "EconomicOperator_displayName_idx" ON "EconomicOperator"("displayName");

-- CreateIndex
CREATE INDEX "EconomicOperator_operatorType_idx" ON "EconomicOperator"("operatorType");

-- CreateIndex
CREATE INDEX "RevenueHistory_year_idx" ON "RevenueHistory"("year");

-- CreateIndex
CREATE UNIQUE INDEX "RevenueHistory_operatorId_year_key" ON "RevenueHistory"("operatorId", "year");

-- CreateIndex
CREATE INDEX "PersonOperator_operatorId_idx" ON "PersonOperator"("operatorId");

-- CreateIndex
CREATE INDEX "PersonOperator_personId_idx" ON "PersonOperator"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonOperator_personId_operatorId_role_key" ON "PersonOperator"("personId", "operatorId", "role");

-- CreateIndex
CREATE INDEX "Certification_operatorId_idx" ON "Certification"("operatorId");

-- CreateIndex
CREATE INDEX "Certification_companyId_idx" ON "Certification"("companyId");

-- CreateIndex
CREATE INDEX "Certification_expiresAt_idx" ON "Certification"("expiresAt");

-- CreateIndex
CREATE INDEX "SoaCertificate_companyId_idx" ON "SoaCertificate"("companyId");

-- CreateIndex
CREATE INDEX "SoaCertificate_expiresAt_idx" ON "SoaCertificate"("expiresAt");

-- CreateIndex
CREATE INDEX "SoaQualification_soaCertificateId_idx" ON "SoaQualification"("soaCertificateId");

-- CreateIndex
CREATE INDEX "SoaQualification_category_idx" ON "SoaQualification"("category");

-- CreateIndex
CREATE INDEX "SoaQualification_ranking_idx" ON "SoaQualification"("ranking");

-- CreateIndex
CREATE UNIQUE INDEX "WorkReference_code_key" ON "WorkReference"("code");

-- CreateIndex
CREATE INDEX "WorkReference_code_idx" ON "WorkReference"("code");

-- CreateIndex
CREATE INDEX "WorkReference_category_idx" ON "WorkReference"("category");

-- CreateIndex
CREATE INDEX "ServiceAssignment_serviceId_idx" ON "ServiceAssignment"("serviceId");

-- CreateIndex
CREATE INDEX "ServiceAssignment_operatorId_idx" ON "ServiceAssignment"("operatorId");

-- CreateIndex
CREATE INDEX "ServiceWorkItem_serviceId_idx" ON "ServiceWorkItem"("serviceId");

-- CreateIndex
CREATE INDEX "ServiceWorkItem_workReferenceId_idx" ON "ServiceWorkItem"("workReferenceId");

-- CreateIndex
CREATE INDEX "ServiceWorkItem_workId_idx" ON "ServiceWorkItem"("workId");

-- CreateIndex
CREATE INDEX "ServiceWorkItem_workCategory_idx" ON "ServiceWorkItem"("workCategory");

-- CreateIndex
CREATE INDEX "ServiceDesignLevel_level_idx" ON "ServiceDesignLevel"("level");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceDesignLevel_serviceId_level_key" ON "ServiceDesignLevel"("serviceId", "level");

-- CreateIndex
CREATE UNIQUE INDEX "Tender_cig_key" ON "Tender"("cig");

-- CreateIndex
CREATE INDEX "Tender_cig_idx" ON "Tender"("cig");

-- CreateIndex
CREATE INDEX "Tender_place_idx" ON "Tender"("place");

-- CreateIndex
CREATE INDEX "Tender_contractingBody_idx" ON "Tender"("contractingBody");

-- CreateIndex
CREATE INDEX "Tender_deadline_idx" ON "Tender"("deadline");

-- CreateIndex
CREATE INDEX "TenderTask_tenderId_idx" ON "TenderTask"("tenderId");

-- CreateIndex
CREATE INDEX "TenderTask_operatorId_idx" ON "TenderTask"("operatorId");

-- CreateIndex
CREATE INDEX "TenderTask_status_idx" ON "TenderTask"("status");

-- CreateIndex
CREATE INDEX "TenderTask_dueDate_idx" ON "TenderTask"("dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "Grouping_tenderId_key" ON "Grouping"("tenderId");

-- CreateIndex
CREATE INDEX "GroupMember_groupingId_idx" ON "GroupMember"("groupingId");

-- CreateIndex
CREATE INDEX "GroupMember_operatorId_idx" ON "GroupMember"("operatorId");

-- CreateIndex
CREATE INDEX "TenderWorkRequirement_tenderId_idx" ON "TenderWorkRequirement"("tenderId");

-- CreateIndex
CREATE INDEX "TenderWorkRequirement_workReferenceId_idx" ON "TenderWorkRequirement"("workReferenceId");

-- CreateIndex
CREATE INDEX "TenderWorkRequirement_workId_idx" ON "TenderWorkRequirement"("workId");

-- CreateIndex
CREATE INDEX "TenderWorkRequirement_category_idx" ON "TenderWorkRequirement"("category");

-- CreateIndex
CREATE INDEX "TenderSoaRequirement_tenderId_idx" ON "TenderSoaRequirement"("tenderId");

-- CreateIndex
CREATE INDEX "TenderSoaRequirement_category_idx" ON "TenderSoaRequirement"("category");

-- AddForeignKey
ALTER TABLE "PersonCompany" ADD CONSTRAINT "PersonCompany_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonCompany" ADD CONSTRAINT "PersonCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalCertification" ADD CONSTRAINT "PersonalCertification_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EconomicOperator" ADD CONSTRAINT "EconomicOperator_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EconomicOperator" ADD CONSTRAINT "EconomicOperator_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueHistory" ADD CONSTRAINT "RevenueHistory_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "EconomicOperator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonOperator" ADD CONSTRAINT "PersonOperator_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonOperator" ADD CONSTRAINT "PersonOperator_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "EconomicOperator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "EconomicOperator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoaCertificate" ADD CONSTRAINT "SoaCertificate_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoaQualification" ADD CONSTRAINT "SoaQualification_soaCertificateId_fkey" FOREIGN KEY ("soaCertificateId") REFERENCES "SoaCertificate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAssignment" ADD CONSTRAINT "ServiceAssignment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAssignment" ADD CONSTRAINT "ServiceAssignment_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "EconomicOperator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceWorkItem" ADD CONSTRAINT "ServiceWorkItem_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceWorkItem" ADD CONSTRAINT "ServiceWorkItem_workReferenceId_fkey" FOREIGN KEY ("workReferenceId") REFERENCES "WorkReference"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceDesignLevel" ADD CONSTRAINT "ServiceDesignLevel_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenderTask" ADD CONSTRAINT "TenderTask_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "Tender"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenderTask" ADD CONSTRAINT "TenderTask_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "EconomicOperator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grouping" ADD CONSTRAINT "Grouping_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "Tender"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_groupingId_fkey" FOREIGN KEY ("groupingId") REFERENCES "Grouping"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "EconomicOperator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenderWorkRequirement" ADD CONSTRAINT "TenderWorkRequirement_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "Tender"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenderWorkRequirement" ADD CONSTRAINT "TenderWorkRequirement_workReferenceId_fkey" FOREIGN KEY ("workReferenceId") REFERENCES "WorkReference"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenderSoaRequirement" ADD CONSTRAINT "TenderSoaRequirement_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "Tender"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "Tender"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "Tender"("id") ON DELETE CASCADE ON UPDATE CASCADE;
