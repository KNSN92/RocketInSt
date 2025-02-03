/*
  Warnings:

  - A unique constraint covering the columns `[title,periodId]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Lesson_title_periodId_key" ON "Lesson"("title", "periodId");
