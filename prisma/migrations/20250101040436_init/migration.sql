/*
  Warnings:

  - A unique constraint covering the columns `[kerbrosId]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Membership_kerbrosId_key" ON "Membership"("kerbrosId");
