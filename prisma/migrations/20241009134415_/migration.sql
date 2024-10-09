/*
  Warnings:

  - You are about to drop the `DayRecipesModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DayRecipesModelToRecipeModel` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `ChallengeModel` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DayRecipesModel" DROP CONSTRAINT "DayRecipesModel_dayId_fkey";

-- DropForeignKey
ALTER TABLE "_DayRecipesModelToRecipeModel" DROP CONSTRAINT "_DayRecipesModelToRecipeModel_A_fkey";

-- DropForeignKey
ALTER TABLE "_DayRecipesModelToRecipeModel" DROP CONSTRAINT "_DayRecipesModelToRecipeModel_B_fkey";

-- AlterTable
ALTER TABLE "ChallengeModel" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "DayRecipesModel";

-- DropTable
DROP TABLE "_DayRecipesModelToRecipeModel";

-- CreateTable
CREATE TABLE "DayMealModelToRecipeModel" (
    "id" SERIAL NOT NULL,
    "dayMealId" INTEGER NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "DayMealModelToRecipeModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayMealModel" (
    "id" SERIAL NOT NULL,
    "category" "CategoryEnum" NOT NULL,
    "dayId" INTEGER NOT NULL,

    CONSTRAINT "DayMealModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DayMealModelToRecipeModel" ADD CONSTRAINT "DayMealModelToRecipeModel_dayMealId_fkey" FOREIGN KEY ("dayMealId") REFERENCES "DayMealModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DayMealModelToRecipeModel" ADD CONSTRAINT "DayMealModelToRecipeModel_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "RecipeModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DayMealModel" ADD CONSTRAINT "DayMealModel_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "DayModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
