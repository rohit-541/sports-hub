/*
  Warnings:

  - Made the column `team1` on table `Match` required. This step will fail if there are existing NULL values in that column.
  - Made the column `team2` on table `Match` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "team1" SET NOT NULL,
ALTER COLUMN "team2" SET NOT NULL;
