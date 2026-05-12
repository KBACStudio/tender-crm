-- CreateEnum
CREATE TYPE "ContractTaskStatus" AS ENUM ('todo', 'doing', 'done');

-- CreateEnum
CREATE TYPE "ContractTaskArea" AS ENUM ('setup', 'execution', 'accounting', 'variations', 'closing', 'general');

-- CreateEnum
CREATE TYPE "ContractMilestoneStatus" AS ENUM ('planned', 'in_progress', 'done', 'cancelled');

-- CreateTable
CREATE TABLE "ContractTask" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "area" "ContractTaskArea" NOT NULL DEFAULT 'general',
    "status" "ContractTaskStatus" NOT NULL DEFAULT 'todo',
    "dueDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractMilestone" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "plannedAt" TIMESTAMP(3),
    "amount" DECIMAL(14,2),
    "status" "ContractMilestoneStatus" NOT NULL DEFAULT 'planned',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContractTask_contractId_idx" ON "ContractTask"("contractId");

-- CreateIndex
CREATE INDEX "ContractTask_status_idx" ON "ContractTask"("status");

-- CreateIndex
CREATE INDEX "ContractTask_dueDate_idx" ON "ContractTask"("dueDate");

-- CreateIndex
CREATE INDEX "ContractTask_area_idx" ON "ContractTask"("area");

-- CreateIndex
CREATE INDEX "ContractMilestone_contractId_idx" ON "ContractMilestone"("contractId");

-- CreateIndex
CREATE INDEX "ContractMilestone_status_idx" ON "ContractMilestone"("status");

-- CreateIndex
CREATE INDEX "ContractMilestone_plannedAt_idx" ON "ContractMilestone"("plannedAt");

-- AddForeignKey
ALTER TABLE "ContractTask" ADD CONSTRAINT "ContractTask_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractMilestone" ADD CONSTRAINT "ContractMilestone_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
