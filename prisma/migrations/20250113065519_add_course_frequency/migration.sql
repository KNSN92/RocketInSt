/*
  Warnings:

  - You are about to drop the column `campusClassId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `courseFrequency` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LessonSchedule" AS ENUM ('FirstPeriod', 'SecondPeriod', 'ThirdPeriod', 'FourthPeriod', 'FifthPeriod', 'SixthPeriod', 'AfterSchool');

-- CreateEnum
CREATE TYPE "CourseFrequency" AS ENUM ('OncePerWeek', 'ThricePerWeek', 'FiveTimesPerWeek');

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_roomId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_campusClassId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "campusClassId",
ADD COLUMN     "courseFrequency" "CourseFrequency" NOT NULL,
ADD COLUMN     "lessonId" INTEGER;

-- DropTable
DROP TABLE "Course";

-- DropEnum
DROP TYPE "CourseSchedule";

-- CreateTable
CREATE TABLE "Lesson" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "schedule" "LessonSchedule" NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
