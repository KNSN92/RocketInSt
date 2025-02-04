/*
  Warnings:

  - You are about to drop the column `periodId` on the `Lesson` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_periodId_fkey";

-- DropIndex
DROP INDEX "Lesson_title_periodId_key";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "periodId";

-- CreateTable
CREATE TABLE "_LessonToPeriod" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LessonToPeriod_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LessonToPeriod_B_index" ON "_LessonToPeriod"("B");

-- AddForeignKey
ALTER TABLE "_LessonToPeriod" ADD CONSTRAINT "_LessonToPeriod_A_fkey" FOREIGN KEY ("A") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonToPeriod" ADD CONSTRAINT "_LessonToPeriod_B_fkey" FOREIGN KEY ("B") REFERENCES "Period"("id") ON DELETE CASCADE ON UPDATE CASCADE;
