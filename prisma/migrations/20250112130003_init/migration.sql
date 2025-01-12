/*
  Warnings:

  - You are about to drop the column `poolId` on the `Team` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_poolId_fkey";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "poolId";

-- CreateTable
CREATE TABLE "_PoolTeam" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PoolTeam_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PoolTeam_B_index" ON "_PoolTeam"("B");

-- AddForeignKey
ALTER TABLE "_PoolTeam" ADD CONSTRAINT "_PoolTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "Categeory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PoolTeam" ADD CONSTRAINT "_PoolTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
