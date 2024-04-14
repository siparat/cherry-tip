-- DropForeignKey
ALTER TABLE "ProfileModel" DROP CONSTRAINT "ProfileModel_userId_fkey";

-- AddForeignKey
ALTER TABLE "ProfileModel" ADD CONSTRAINT "ProfileModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
