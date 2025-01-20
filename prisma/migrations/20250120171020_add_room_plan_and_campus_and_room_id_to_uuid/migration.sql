/*
  Warnings:

  - The primary key for the `Campus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Room` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_LessonToRoom` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_campusId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_campusId_fkey";

-- DropForeignKey
ALTER TABLE "_LessonToRoom" DROP CONSTRAINT "_LessonToRoom_B_fkey";

-- AlterTable
ALTER TABLE "Campus" DROP CONSTRAINT "Campus_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Campus_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Campus_id_seq";

-- AlterTable
ALTER TABLE "Room" DROP CONSTRAINT "Room_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "campusId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Room_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Room_id_seq";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "campusId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_LessonToRoom" DROP CONSTRAINT "_LessonToRoom_AB_pkey",
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_LessonToRoom_AB_pkey" PRIMARY KEY ("A", "B");

-- CreateTable
CREATE TABLE "RoomPlan" (
    "roomId" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "w" INTEGER NOT NULL,
    "h" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomPlan_roomId_key" ON "RoomPlan"("roomId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomPlan" ADD CONSTRAINT "RoomPlan_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonToRoom" ADD CONSTRAINT "_LessonToRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
