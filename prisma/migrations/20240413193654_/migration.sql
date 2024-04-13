/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SexEnum" AS ENUM ('Male', 'Female');

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropTable
DROP TABLE "Profile";

-- DropEnum
DROP TYPE "Sex";

-- CreateTable
CREATE TABLE "ProfileModel" (
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "birth" TIMESTAMP(3) NOT NULL,
    "city" TEXT,
    "sex" "SexEnum" NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileModel_userId_key" ON "ProfileModel"("userId");

-- AddForeignKey
ALTER TABLE "ProfileModel" ADD CONSTRAINT "ProfileModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
