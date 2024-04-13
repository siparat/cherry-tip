-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('Male', 'Female');

-- CreateTable
CREATE TABLE "Profile" (
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "birth" TIMESTAMP(3) NOT NULL,
    "city" TEXT,
    "sex" "Sex" NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
