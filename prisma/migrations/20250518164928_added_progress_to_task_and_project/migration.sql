-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "attachments" TEXT[],
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0;
