-- DropForeignKey
ALTER TABLE "Campus" DROP CONSTRAINT "Campus_mainRoomId_fkey";

-- AlterTable
ALTER TABLE "Campus" ALTER COLUMN "mainRoomId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Campus" ADD CONSTRAINT "Campus_mainRoomId_fkey" FOREIGN KEY ("mainRoomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
