-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winner_fkey" FOREIGN KEY ("winner") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;