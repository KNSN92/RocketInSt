/*
  Warnings:

  - You are about to drop the column `campusName` on the `Campus` table. All the data in the column will be lost.
  - You are about to drop the `CampusRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserClassSchedule` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Campus` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CourseSchedule" AS ENUM ('FirstPeriod', 'SecondPeriod', 'ThirdPeriod', 'FourthPeriod', 'FifthPeriod', 'SixthPeriod', 'AfterSchool');

-- DropForeignKey
ALTER TABLE "CampusRoom" DROP CONSTRAINT "CampusRoom_campusId_fkey";

-- DropForeignKey
ALTER TABLE "UserClassSchedule" DROP CONSTRAINT "UserClassSchedule_campusRoomId_fkey";

-- DropForeignKey
ALTER TABLE "UserClassSchedule" DROP CONSTRAINT "UserClassSchedule_userId_fkey";

-- AlterTable
ALTER TABLE "Campus" DROP COLUMN "campusName",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "campusClassId" INTEGER;

-- DropTable
DROP TABLE "CampusRoom";

-- DropTable
DROP TABLE "UserClassSchedule";

-- DropEnum
DROP TYPE "CampusClassTime";

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "campusId" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "schedule" "CourseSchedule" NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_campusClassId_fkey" FOREIGN KEY ("campusClassId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
