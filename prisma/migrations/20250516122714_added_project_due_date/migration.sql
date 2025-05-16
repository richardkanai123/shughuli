-- First, add the column as nullable
-- AlterTable
ALTER TABLE "Project" ADD COLUMN "dueDate" TIMESTAMP(3);

-- Update existing rows with a default value (1 month from now)
UPDATE "Project" SET "dueDate" = NOW() + INTERVAL '1 month';

-- Make the column non-nullable (required)
ALTER TABLE "Project" ALTER COLUMN "dueDate" SET NOT NULL;
