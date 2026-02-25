/*
  Warnings:

  - A unique constraint covering the columns `[campusId]` on the table `TimeTableUploader` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TimeTableUploader_campusId_key" ON "TimeTableUploader"("campusId");
