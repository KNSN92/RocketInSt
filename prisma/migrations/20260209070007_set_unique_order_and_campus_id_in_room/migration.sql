/*
  Warnings:

  - A unique constraint covering the columns `[order,campusId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Room_order_campusId_key" ON "Room"("order", "campusId");
