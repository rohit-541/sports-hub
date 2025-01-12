-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_CategeoryID_fkey";

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_CategeoryID_fkey" FOREIGN KEY ("CategeoryID") REFERENCES "Categeory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
