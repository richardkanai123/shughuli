/*
  Warnings:

  - Made the column `description` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('OPEN', 'ONGOING', 'COMPLETED');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'OPEN',
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "description" SET NOT NULL;
