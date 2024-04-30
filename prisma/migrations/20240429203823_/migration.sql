-- CreateEnum
CREATE TYPE "GoalTypeEnum" AS ENUM ('Stay', 'Gain', 'Lose');

-- CreateEnum
CREATE TYPE "ActivityEnum" AS ENUM ('Low', 'Medium', 'High');

-- CreateTable
CREATE TABLE "GoalModel" (
    "type" "GoalTypeEnum" NOT NULL,
    "activity" "ActivityEnum" NOT NULL,
    "calorieGoal" INTEGER NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GoalModel_userId_key" ON "GoalModel"("userId");

-- AddForeignKey
ALTER TABLE "GoalModel" ADD CONSTRAINT "GoalModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
