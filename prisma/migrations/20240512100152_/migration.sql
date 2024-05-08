-- DropForeignKey
ALTER TABLE "DayRecipesModel" DROP CONSTRAINT "DayRecipesModel_dayId_fkey";

-- AddForeignKey
ALTER TABLE "DayRecipesModel" ADD CONSTRAINT "DayRecipesModel_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "DayModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
