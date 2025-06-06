/*
  Warnings:

  - Changed the type of `type` on the `Activity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('PROJECT_CREATED', 'PROJECT_UPDATED', 'PROJECT_DELETED', 'TASK_CREATED', 'TASK_UPDATED', 'TASK_DELETED', 'COMMENT_ADDED', 'COMMENT_UPDATED', 'COMMENT_DELETED', 'USER_JOINED_PROJECT', 'USER_LEFT_PROJECT');

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "type",
ADD COLUMN     "type" "ActivityType" NOT NULL;
