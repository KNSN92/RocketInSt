/*
  Warnings:

  - The required column `id` was added to the `RoomPlan` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "RoomPlan" DROP CONSTRAINT "RoomPlan_roomId_fkey";

-- AlterTable
ALTER TABLE "RoomPlan" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "RoomPlan_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "RoomPlan" ADD CONSTRAINT "RoomPlan_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
