-- DropForeignKey
ALTER TABLE "UserChallengeModel" DROP CONSTRAINT "UserChallengeModel_challengeId_fkey";

-- DropForeignKey
ALTER TABLE "UserChallengeModel" DROP CONSTRAINT "UserChallengeModel_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserChallengeModel" ADD CONSTRAINT "UserChallengeModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChallengeModel" ADD CONSTRAINT "UserChallengeModel_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "ChallengeModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
