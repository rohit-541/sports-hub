/*
  Warnings:

  - A unique constraint covering the columns `[sport,name]` on the table `Categeory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "score" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Categeory_sport_name_key" ON "Categeory"("sport", "name");
