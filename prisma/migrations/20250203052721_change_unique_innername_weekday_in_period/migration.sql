/*
  Warnings:

  - A unique constraint covering the columns `[innername,weekday]` on the table `Period` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Period_innername_key";

-- CreateIndex
CREATE UNIQUE INDEX "Period_innername_weekday_key" ON "Period"("innername", "weekday");
