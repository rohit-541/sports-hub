/*
  Warnings:

  - You are about to drop the column `poolId` on the `Match` table. All the data in the column will be lost.
  - Added the required column `CategeoryID` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "MatchType" ADD VALUE 'OpenCategeory';

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_poolId_fkey";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "poolId",
ADD COLUMN     "CategeoryID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "score" INTEGER NOT NULL,
ADD COLUMN     "sportsType" "sportType";

-- CreateTable
CREATE TABLE "GamePoint" (
    "id" SERIAL NOT NULL,
    "name" "Sports" NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "hostelId" INTEGER NOT NULL,

    CONSTRAINT "GamePoint_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GamePoint" ADD CONSTRAINT "GamePoint_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_CategeoryID_fkey" FOREIGN KEY ("CategeoryID") REFERENCES "Categeory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
