-- CreateEnum
CREATE TYPE "DifficultyEnum" AS ENUM ('Easy', 'Normal', 'Hard');

-- CreateTable
CREATE TABLE "RecipeModel" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "video" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "cookingTime" INTEGER NOT NULL,
    "difficulty" "DifficultyEnum" NOT NULL,
    "protein" INTEGER NOT NULL,
    "fat" INTEGER NOT NULL,
    "carbs" INTEGER NOT NULL,
    "categoryId" INTEGER,
    "dietsTypeId" INTEGER,
    "preparationId" INTEGER,

    CONSTRAINT "RecipeModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryModel" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "CategoryModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreparationModel" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "PreparationModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DietTypeModel" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "DietTypeModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecipeModel" ADD CONSTRAINT "RecipeModel_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeModel" ADD CONSTRAINT "RecipeModel_dietsTypeId_fkey" FOREIGN KEY ("dietsTypeId") REFERENCES "DietTypeModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeModel" ADD CONSTRAINT "RecipeModel_preparationId_fkey" FOREIGN KEY ("preparationId") REFERENCES "PreparationModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
