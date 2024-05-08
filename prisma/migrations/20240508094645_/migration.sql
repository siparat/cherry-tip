/*
  Warnings:

  - You are about to drop the `CalendarModel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CalendarModel" DROP CONSTRAINT "CalendarModel_userId_fkey";

-- DropTable
DROP TABLE "CalendarModel";

-- CreateTable
CREATE TABLE "DayModel" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "goal" "GoalTypeEnum" NOT NULL,
    "eaten" INTEGER NOT NULL DEFAULT 0,
    "needCalories" INTEGER NOT NULL,
    "protein" INTEGER NOT NULL,
    "carbs" INTEGER NOT NULL,
    "fat" INTEGER NOT NULL,
    "breakfast" INTEGER NOT NULL,
    "lunch" INTEGER NOT NULL,
    "dinner" INTEGER NOT NULL,
    "snack" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DayModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DayModel" ADD CONSTRAINT "DayModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
