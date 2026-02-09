/*
  Warnings:

  - A unique constraint covering the columns `[campusId,name]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Room_campusId_name_key" ON "Room"("campusId", "name");
