/*
  Warnings:

  - You are about to drop the column `userId` on the `Membership` table. All the data in the column will be lost.
  - Added the required column `kerbrosId` to the `Membership` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_userId_fkey";

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "userId",
ADD COLUMN     "kerbrosId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_kerbrosId_fkey" FOREIGN KEY ("kerbrosId") REFERENCES "User"("kerbrosId") ON DELETE CASCADE ON UPDATE CASCADE;
