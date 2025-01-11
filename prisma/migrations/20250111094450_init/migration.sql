/*
  Warnings:

  - A unique constraint covering the columns `[sport,hostelId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Team_sport_hostelId_key" ON "Team"("sport", "hostelId");
