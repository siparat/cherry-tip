/*
  Warnings:

  - You are about to drop the column `challengeid` on the `UserChallengeModel` table. All the data in the column will be lost.
  - Added the required column `challengeId` to the `UserChallengeModel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserChallengeModel" DROP CONSTRAINT "UserChallengeModel_challengeid_fkey";

-- AlterTable
ALTER TABLE "UserChallengeModel" DROP COLUMN "challengeid",
ADD COLUMN     "challengeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserChallengeModel" ADD CONSTRAINT "UserChallengeModel_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "ChallengeModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
