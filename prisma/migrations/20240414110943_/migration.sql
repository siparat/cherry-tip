-- CreateTable
CREATE TABLE "UnitsModel" (
    "weight" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "bloodGlucose" INTEGER,
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UnitsModel_userId_key" ON "UnitsModel"("userId");

-- AddForeignKey
ALTER TABLE "UnitsModel" ADD CONSTRAINT "UnitsModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
