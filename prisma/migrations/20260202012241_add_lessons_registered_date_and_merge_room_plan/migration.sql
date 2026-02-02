/*
  Warnings:

  - You are about to drop the column `allMember` on the `Campus` table. All the data in the column will be lost.
  - You are about to drop the column `courseFrequency` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `RoomPlan` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `memberCount` to the `Campus` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Course" AS ENUM ('OncePerWeek', 'ThricePerWeek', 'FiveTimesPerWeek');

-- DropForeignKey
ALTER TABLE "RoomPlan" DROP CONSTRAINT "RoomPlan_roomId_fkey";

-- AlterTable
ALTER TABLE "Campus" DROP COLUMN "allMember",
ADD COLUMN     "memberCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "roomPlan" JSONB;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "courseFrequency",
ADD COLUMN     "course" "Course",
ADD COLUMN     "lessonsRegisteredDate" TIMESTAMP(3);

-- DropTable
DROP TABLE "RoomPlan";

-- DropEnum
DROP TYPE "CourseFrequency";
