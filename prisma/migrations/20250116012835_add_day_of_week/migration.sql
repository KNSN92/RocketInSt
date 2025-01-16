/*
  Warnings:

  - You are about to drop the column `schedule` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `day` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `period` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday');

-- CreateEnum
CREATE TYPE "LessonPeriod" AS ENUM ('FirstPeriod', 'SecondPeriod', 'ThirdPeriod', 'FourthPeriod', 'FifthPeriod', 'SixthPeriod', 'AfterSchool');

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "schedule",
ADD COLUMN     "day" "DayOfWeek" NOT NULL,
ADD COLUMN     "period" "LessonPeriod" NOT NULL;

-- DropEnum
DROP TYPE "LessonSchedule";
