/*
  Warnings:

  - Added the required column `tag` to the `Period` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PeriodTag" AS ENUM ('Lesson', 'Meeting', 'Event', 'Other');

-- AlterTable
ALTER TABLE "Period" ADD COLUMN     "tag" "PeriodTag" NOT NULL;
