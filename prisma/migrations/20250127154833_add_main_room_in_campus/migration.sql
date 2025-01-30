/*
  Warnings:

  - A unique constraint covering the columns `[mainRoomId]` on the table `Campus` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mainRoomId` to the `Campus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campus" ADD COLUMN     "mainRoomId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Campus_mainRoomId_key" ON "Campus"("mainRoomId");

-- AddForeignKey
ALTER TABLE "Campus" ADD CONSTRAINT "Campus_mainRoomId_fkey" FOREIGN KEY ("mainRoomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
