/*
  Warnings:

  - You are about to drop the `_LessonToPeriod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LessonToRoom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LessonToPeriod" DROP CONSTRAINT "_LessonToPeriod_A_fkey";

-- DropForeignKey
ALTER TABLE "_LessonToPeriod" DROP CONSTRAINT "_LessonToPeriod_B_fkey";

-- DropForeignKey
ALTER TABLE "_LessonToRoom" DROP CONSTRAINT "_LessonToRoom_A_fkey";

-- DropForeignKey
ALTER TABLE "_LessonToRoom" DROP CONSTRAINT "_LessonToRoom_B_fkey";

-- DropTable
DROP TABLE "_LessonToPeriod";

-- DropTable
DROP TABLE "_LessonToRoom";

-- CreateTable
CREATE TABLE "LessonPeriod" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,

    CONSTRAINT "LessonPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LessonPeriodToRoom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LessonPeriodToRoom_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "LessonPeriod_lessonId_periodId_key" ON "LessonPeriod"("lessonId", "periodId");

-- CreateIndex
CREATE INDEX "_LessonPeriodToRoom_B_index" ON "_LessonPeriodToRoom"("B");

-- AddForeignKey
ALTER TABLE "LessonPeriod" ADD CONSTRAINT "LessonPeriod_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonPeriod" ADD CONSTRAINT "LessonPeriod_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonPeriodToRoom" ADD CONSTRAINT "_LessonPeriodToRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "LessonPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonPeriodToRoom" ADD CONSTRAINT "_LessonPeriodToRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
