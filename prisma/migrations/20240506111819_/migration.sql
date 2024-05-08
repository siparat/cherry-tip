-- CreateTable
CREATE TABLE "CalendarModel" (
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

    CONSTRAINT "CalendarModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CalendarModel" ADD CONSTRAINT "CalendarModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
