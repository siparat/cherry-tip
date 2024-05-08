/*
  Warnings:

  - You are about to drop the `_DayModelToRecipeModel` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CategoryEnum" AS ENUM ('Breakfast', 'Lunch', 'Dinner', 'Snack');

-- DropForeignKey
ALTER TABLE "_DayModelToRecipeModel" DROP CONSTRAINT "_DayModelToRecipeModel_A_fkey";

-- DropForeignKey
ALTER TABLE "_DayModelToRecipeModel" DROP CONSTRAINT "_DayModelToRecipeModel_B_fkey";

-- DropTable
DROP TABLE "_DayModelToRecipeModel";

-- CreateTable
CREATE TABLE "DayRecipesModel" (
    "id" SERIAL NOT NULL,
    "category" "CategoryEnum" NOT NULL,
    "dayId" INTEGER NOT NULL,

    CONSTRAINT "DayRecipesModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DayRecipesModelToRecipeModel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DayRecipesModelToRecipeModel_AB_unique" ON "_DayRecipesModelToRecipeModel"("A", "B");

-- CreateIndex
CREATE INDEX "_DayRecipesModelToRecipeModel_B_index" ON "_DayRecipesModelToRecipeModel"("B");

-- AddForeignKey
ALTER TABLE "DayRecipesModel" ADD CONSTRAINT "DayRecipesModel_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "DayModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DayRecipesModelToRecipeModel" ADD CONSTRAINT "_DayRecipesModelToRecipeModel_A_fkey" FOREIGN KEY ("A") REFERENCES "DayRecipesModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DayRecipesModelToRecipeModel" ADD CONSTRAINT "_DayRecipesModelToRecipeModel_B_fkey" FOREIGN KEY ("B") REFERENCES "RecipeModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
