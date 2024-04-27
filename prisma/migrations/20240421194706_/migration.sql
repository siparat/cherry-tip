-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('Started', 'Canceled', 'Finished');

-- CreateTable
CREATE TABLE "ChallengeModel" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "difficulty" "DifficultyEnum" NOT NULL DEFAULT 'Easy',
    "tips" TEXT[],

    CONSTRAINT "ChallengeModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChallengeModel" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT 'Started',
    "userId" TEXT NOT NULL,
    "challengeid" INTEGER NOT NULL,

    CONSTRAINT "UserChallengeModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserChallengeModel" ADD CONSTRAINT "UserChallengeModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChallengeModel" ADD CONSTRAINT "UserChallengeModel_challengeid_fkey" FOREIGN KEY ("challengeid") REFERENCES "ChallengeModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
