-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_id_fkey";

-- CreateTable
CREATE TABLE "_OCMatchWinners" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_OCMatchWinners_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OCMatchWinners_B_index" ON "_OCMatchWinners"("B");

-- AddForeignKey
ALTER TABLE "_OCMatchWinners" ADD CONSTRAINT "_OCMatchWinners_A_fkey" FOREIGN KEY ("A") REFERENCES "OCMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OCMatchWinners" ADD CONSTRAINT "_OCMatchWinners_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
