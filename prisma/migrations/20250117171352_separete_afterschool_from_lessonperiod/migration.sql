/*
  Warnings:

  - The values [AfterSchool] on the enum `LessonPeriod` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `afterSchool` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AfterSchool" AS ENUM ('LeaveImmediately', 'StayForAWhile', 'StayUntilEnd');

-- AlterEnum
BEGIN;
CREATE TYPE "LessonPeriod_new" AS ENUM ('FirstPeriod', 'SecondPeriod', 'ThirdPeriod', 'FourthPeriod', 'FifthPeriod', 'SixthPeriod');
ALTER TABLE "Lesson" ALTER COLUMN "period" TYPE "LessonPeriod_new" USING ("period"::text::"LessonPeriod_new");
ALTER TYPE "LessonPeriod" RENAME TO "LessonPeriod_old";
ALTER TYPE "LessonPeriod_new" RENAME TO "LessonPeriod";
DROP TYPE "LessonPeriod_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "afterSchool" "AfterSchool" NOT NULL;
