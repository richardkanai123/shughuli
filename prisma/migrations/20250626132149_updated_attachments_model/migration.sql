/*
  Warnings:

  - Added the required column `fileName` to the `Attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileType` to the `Attachments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attachments" ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "fileType" TEXT NOT NULL;
