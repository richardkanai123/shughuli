/*
  Warnings:

  - You are about to drop the column `userId` on the `Team` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_userId_fkey";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "userId",
ADD COLUMN     "lead" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_lead_fkey" FOREIGN KEY ("lead") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
