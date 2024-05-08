/*
  Warnings:

  - You are about to drop the column `eaten` on the `DayModel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DayModel" DROP COLUMN "eaten";

-- CreateTable
CREATE TABLE "_DayModelToRecipeModel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DayModelToRecipeModel_AB_unique" ON "_DayModelToRecipeModel"("A", "B");

-- CreateIndex
CREATE INDEX "_DayModelToRecipeModel_B_index" ON "_DayModelToRecipeModel"("B");

-- AddForeignKey
ALTER TABLE "_DayModelToRecipeModel" ADD CONSTRAINT "_DayModelToRecipeModel_A_fkey" FOREIGN KEY ("A") REFERENCES "DayModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DayModelToRecipeModel" ADD CONSTRAINT "_DayModelToRecipeModel_B_fkey" FOREIGN KEY ("B") REFERENCES "RecipeModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
