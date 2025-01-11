-- CreateEnum
CREATE TYPE "Sports" AS ENUM ('Badminton', 'Cricket', 'Football', 'Chess', 'TT', 'Volleyball', 'Hockey', 'Athletics', 'Squash');

-- CreateEnum
CREATE TYPE "Hostels" AS ENUM ('Aaravali', 'Karakoram', 'Nilgiri', 'Jawalamukhi', 'Kumaon', 'Satpura', 'Udaygiri', 'Dronagiri', 'Vindyanchal', 'Shivalik', 'Saptagiri', 'Zanskar');

-- CreateEnum
CREATE TYPE "MatchType" AS ENUM ('PoolA', 'PoolB', 'PoolC', 'PoolD', 'Quarterfinal', 'Semifinal', 'Final');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('Scheduled', 'Ongoing', 'Completed');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "kerbros" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hostel" (
    "id" SERIAL NOT NULL,
    "hostelName" "Hostels" NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Hostel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "hostelId" INTEGER NOT NULL,
    "sport" "Sports" NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categeory" (
    "id" SERIAL NOT NULL,
    "name" "MatchType" NOT NULL,
    "sport" "Sports" NOT NULL,

    CONSTRAINT "Categeory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "team1Id" INTEGER NOT NULL,
    "team2Id" INTEGER NOT NULL,
    "poolId" INTEGER,
    "type" "MatchType" NOT NULL,
    "sport" "Sports" NOT NULL,
    "winnerId" INTEGER,
    "scoreA" INTEGER,
    "scoreB" INTEGER,
    "status" "MatchStatus" NOT NULL DEFAULT 'Scheduled',
    "dateStart" TIMESTAMP NOT NULL,
    "dateEnd" TIMESTAMP NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 28.5444201360911,
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 77.18893289553354,
    "location" TEXT NOT NULL DEFAULT 'Cricket Ground',

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PlayerTeam" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PlayerTeam_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PoolTeam" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PoolTeam_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_poolWinner" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_poolWinner_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_kerbros_key" ON "User"("kerbros");

-- CreateIndex
CREATE UNIQUE INDEX "Hostel_hostelName_key" ON "Hostel"("hostelName");

-- CreateIndex
CREATE INDEX "_PlayerTeam_B_index" ON "_PlayerTeam"("B");

-- CreateIndex
CREATE INDEX "_PoolTeam_B_index" ON "_PoolTeam"("B");

-- CreateIndex
CREATE INDEX "_poolWinner_B_index" ON "_poolWinner"("B");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_team1Id_fkey" FOREIGN KEY ("team1Id") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_team2Id_fkey" FOREIGN KEY ("team2Id") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "Categeory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerTeam" ADD CONSTRAINT "_PlayerTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayerTeam" ADD CONSTRAINT "_PlayerTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PoolTeam" ADD CONSTRAINT "_PoolTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "Categeory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PoolTeam" ADD CONSTRAINT "_PoolTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_poolWinner" ADD CONSTRAINT "_poolWinner_A_fkey" FOREIGN KEY ("A") REFERENCES "Categeory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_poolWinner" ADD CONSTRAINT "_poolWinner_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
