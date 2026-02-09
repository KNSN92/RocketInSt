/*
  Warnings:

  - A unique constraint covering the columns `[name,campusId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Room_campusId_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_campusId_key" ON "Room"("name", "campusId");
