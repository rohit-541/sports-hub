/*
  Warnings:

  - You are about to drop the `_PoolTeam` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `poolId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PoolTeam" DROP CONSTRAINT "_PoolTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_PoolTeam" DROP CONSTRAINT "_PoolTeam_B_fkey";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "poolId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_PoolTeam";

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "Categeory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
