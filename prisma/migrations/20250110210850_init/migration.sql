/*
  Warnings:

  - Added the required column `sportType` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "sportType" AS ENUM ('Singles', 'Doubles', 'l100', 'l200', 'l1500');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "sportType" "sportType" NOT NULL,
ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL;
