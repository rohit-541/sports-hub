-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "ocMatchId" INTEGER;

-- CreateTable
CREATE TABLE "OCMatch" (
    "id" SERIAL NOT NULL,
    "sport" "Sports" NOT NULL,
    "sportType" "sportType",
    "status" "MatchStatus" NOT NULL DEFAULT 'Scheduled',
    "dateStart" TIMESTAMP NOT NULL,
    "dateEnd" TIMESTAMP NOT NULL,
    "latitude" DOUBLE PRECISION DEFAULT 28.5444201360911,
    "longitude" DOUBLE PRECISION DEFAULT 77.18893289553354,
    "location" TEXT NOT NULL DEFAULT 'Cricket Ground',

    CONSTRAINT "OCMatch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_ocMatchId_fkey" FOREIGN KEY ("ocMatchId") REFERENCES "OCMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_id_fkey" FOREIGN KEY ("id") REFERENCES "OCMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
