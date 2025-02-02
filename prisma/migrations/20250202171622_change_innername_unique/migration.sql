/*
  Warnings:

  - A unique constraint covering the columns `[innername]` on the table `Period` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Period_innername_key" ON "Period"("innername");
