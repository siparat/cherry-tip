/*
  Warnings:

  - A unique constraint covering the columns `[tgId]` on the table `UserModel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserModel" ADD COLUMN     "tgId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_tgId_key" ON "UserModel"("tgId");
