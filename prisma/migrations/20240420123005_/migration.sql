-- AlterTable
ALTER TABLE "RecipeModel" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "RecipeModel" ADD CONSTRAINT "RecipeModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
