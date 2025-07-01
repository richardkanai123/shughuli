/*
  Warnings:

  - Added the required column `key` to the `Attachments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attachments" ADD COLUMN     "key" TEXT NOT NULL;
