/*
  Warnings:

  - You are about to drop the column `day` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `period` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `afterSchool` on the `User` table. All the data in the column will be lost.
  - Added the required column `periodId` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "day",
DROP COLUMN "period",
ADD COLUMN     "periodId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "afterSchool";

-- DropEnum
DROP TYPE "AfterSchool";

-- DropEnum
DROP TYPE "DayOfWeek";

-- DropEnum
DROP TYPE "LessonPeriod";

-- CreateTable
CREATE TABLE "Period" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "weekday" "WeekDay" NOT NULL,
    "beginTime" INTEGER NOT NULL,
    "endTime" INTEGER NOT NULL,

    CONSTRAINT "Period_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
