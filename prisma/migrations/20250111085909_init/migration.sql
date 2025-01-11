/*
  Warnings:

  - The values [Aaravali,Jawalamukhi,Udaygiri] on the enum `Hostels` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Hostels_new" AS ENUM ('Aravali', 'Karakoram', 'Nilgiri', 'Jwalamukhi', 'Kumaon', 'Satpura', 'Udaigiri', 'Dronagiri', 'Vindyanchal', 'Shivalik', 'Saptagiri', 'Zanskar', 'Girnar');
ALTER TABLE "Hostel" ALTER COLUMN "hostelName" TYPE "Hostels_new" USING ("hostelName"::text::"Hostels_new");
ALTER TYPE "Hostels" RENAME TO "Hostels_old";
ALTER TYPE "Hostels_new" RENAME TO "Hostels";
DROP TYPE "Hostels_old";
COMMIT;

-- AlterEnum
ALTER TYPE "Sports" ADD VALUE 'Weightlifting';

-- AlterEnum
ALTER TYPE "sportType" ADD VALUE 'l400';
