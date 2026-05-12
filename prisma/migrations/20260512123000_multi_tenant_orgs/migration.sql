-- CreateEnum
CREATE TYPE "OrganizationPlan" AS ENUM ('starter', 'pro', 'enterprise');

-- CreateEnum
CREATE TYPE "OrganizationModule" AS ENUM ('design', 'dl', 'cse', 'contractor');

-- CreateEnum
CREATE TYPE "OrganizationMemberRole" AS ENUM ('owner', 'admin', 'member', 'viewer');

-- DropIndex
DROP INDEX "Tender_cig_key";

-- DropIndex
DROP INDEX "WorkReference_code_key";

-- AlterTable
ALTER TABLE "AppUser" ADD COLUMN     "defaultOrganizationId" UUID;

-- AlterTable
ALTER TABLE "Certification" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "ContractMilestone" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "ContractTask" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "EconomicOperator" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "GroupMember" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "Grouping" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "PersonCompany" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "PersonOperator" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "PersonalCertification" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "Professional" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "RevenueHistory" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "ServiceAssignment" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "ServiceDesignLevel" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "ServiceWorkItem" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "SoaCertificate" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "SoaQualification" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "Tender" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "TenderSoaRequirement" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "TenderTask" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "TenderWorkRequirement" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- AlterTable
ALTER TABLE "WorkReference" ADD COLUMN     "organizationId" UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001'::uuid;

-- CreateTable
CREATE TABLE "Organization" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "plan" "OrganizationPlan" NOT NULL DEFAULT 'starter',
    "modules" "OrganizationModule"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "id" TEXT NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "OrganizationMemberRole" NOT NULL DEFAULT 'member',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

INSERT INTO "Organization" ("id", "slug", "name", "plan", "modules", "createdAt", "updatedAt")
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 'default', 'Default', 'starter', ARRAY[]::"OrganizationModule"[], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- CreateIndex
CREATE INDEX "OrganizationMember_userId_idx" ON "OrganizationMember"("userId");

-- CreateIndex
CREATE INDEX "OrganizationMember_organizationId_idx" ON "OrganizationMember"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMember_organizationId_userId_key" ON "OrganizationMember"("organizationId", "userId");

-- CreateIndex
CREATE INDEX "Certification_organizationId_idx" ON "Certification"("organizationId");

-- CreateIndex
CREATE INDEX "Company_organizationId_idx" ON "Company"("organizationId");

-- CreateIndex
CREATE INDEX "Contract_organizationId_idx" ON "Contract"("organizationId");

-- CreateIndex
CREATE INDEX "ContractMilestone_organizationId_idx" ON "ContractMilestone"("organizationId");

-- CreateIndex
CREATE INDEX "ContractTask_organizationId_idx" ON "ContractTask"("organizationId");

-- CreateIndex
CREATE INDEX "Document_organizationId_idx" ON "Document"("organizationId");

-- CreateIndex
CREATE INDEX "EconomicOperator_organizationId_idx" ON "EconomicOperator"("organizationId");

-- CreateIndex
CREATE INDEX "GroupMember_organizationId_idx" ON "GroupMember"("organizationId");

-- CreateIndex
CREATE INDEX "Grouping_organizationId_idx" ON "Grouping"("organizationId");

-- CreateIndex
CREATE INDEX "Note_organizationId_idx" ON "Note"("organizationId");

-- CreateIndex
CREATE INDEX "Person_organizationId_idx" ON "Person"("organizationId");

-- CreateIndex
CREATE INDEX "PersonCompany_organizationId_idx" ON "PersonCompany"("organizationId");

-- CreateIndex
CREATE INDEX "PersonOperator_organizationId_idx" ON "PersonOperator"("organizationId");

-- CreateIndex
CREATE INDEX "PersonalCertification_organizationId_idx" ON "PersonalCertification"("organizationId");

-- CreateIndex
CREATE INDEX "Professional_organizationId_idx" ON "Professional"("organizationId");

-- CreateIndex
CREATE INDEX "RevenueHistory_organizationId_idx" ON "RevenueHistory"("organizationId");

-- CreateIndex
CREATE INDEX "Service_organizationId_idx" ON "Service"("organizationId");

-- CreateIndex
CREATE INDEX "ServiceAssignment_organizationId_idx" ON "ServiceAssignment"("organizationId");

-- CreateIndex
CREATE INDEX "ServiceDesignLevel_organizationId_idx" ON "ServiceDesignLevel"("organizationId");

-- CreateIndex
CREATE INDEX "ServiceWorkItem_organizationId_idx" ON "ServiceWorkItem"("organizationId");

-- CreateIndex
CREATE INDEX "SoaCertificate_organizationId_idx" ON "SoaCertificate"("organizationId");

-- CreateIndex
CREATE INDEX "SoaQualification_organizationId_idx" ON "SoaQualification"("organizationId");

-- CreateIndex
CREATE INDEX "Tender_organizationId_idx" ON "Tender"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Tender_organizationId_cig_key" ON "Tender"("organizationId", "cig");

-- CreateIndex
CREATE INDEX "TenderSoaRequirement_organizationId_idx" ON "TenderSoaRequirement"("organizationId");

-- CreateIndex
CREATE INDEX "TenderTask_organizationId_idx" ON "TenderTask"("organizationId");

-- CreateIndex
CREATE INDEX "TenderWorkRequirement_organizationId_idx" ON "TenderWorkRequirement"("organizationId");

-- CreateIndex
CREATE INDEX "WorkReference_organizationId_idx" ON "WorkReference"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkReference_organizationId_code_key" ON "WorkReference"("organizationId", "code");

-- AddForeignKey
ALTER TABLE "AppUser" ADD CONSTRAINT "AppUser_defaultOrganizationId_fkey" FOREIGN KEY ("defaultOrganizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AppUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonCompany" ADD CONSTRAINT "PersonCompany_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalCertification" ADD CONSTRAINT "PersonalCertification_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EconomicOperator" ADD CONSTRAINT "EconomicOperator_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueHistory" ADD CONSTRAINT "RevenueHistory_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonOperator" ADD CONSTRAINT "PersonOperator_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoaCertificate" ADD CONSTRAINT "SoaCertificate_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoaQualification" ADD CONSTRAINT "SoaQualification_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkReference" ADD CONSTRAINT "WorkReference_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAssignment" ADD CONSTRAINT "ServiceAssignment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceWorkItem" ADD CONSTRAINT "ServiceWorkItem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceDesignLevel" ADD CONSTRAINT "ServiceDesignLevel_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tender" ADD CONSTRAINT "Tender_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractTask" ADD CONSTRAINT "ContractTask_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractMilestone" ADD CONSTRAINT "ContractMilestone_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenderTask" ADD CONSTRAINT "TenderTask_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grouping" ADD CONSTRAINT "Grouping_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenderWorkRequirement" ADD CONSTRAINT "TenderWorkRequirement_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenderSoaRequirement" ADD CONSTRAINT "TenderSoaRequirement_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
