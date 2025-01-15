-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin');

-- CreateEnum
CREATE TYPE "CampusClassTime" AS ENUM ('FirstClassTime', 'SecondClassTime', 'ThirdClassTime', 'ForthClassTime', 'FifthClassTime', 'SixthClassTime', 'AfterSchool');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "campusId" INTEGER,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'User';

-- CreateTable
CREATE TABLE "Campus" (
    "id" SERIAL NOT NULL,
    "campusName" TEXT NOT NULL,

    CONSTRAINT "Campus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampusRoom" (
    "id" SERIAL NOT NULL,
    "roomName" TEXT NOT NULL,
    "campusId" INTEGER NOT NULL,

    CONSTRAINT "CampusRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserClassSchedule" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "classTime" "CampusClassTime" NOT NULL,
    "campusRoomId" INTEGER NOT NULL,

    CONSTRAINT "UserClassSchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampusRoom" ADD CONSTRAINT "CampusRoom_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClassSchedule" ADD CONSTRAINT "UserClassSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClassSchedule" ADD CONSTRAINT "UserClassSchedule_campusRoomId_fkey" FOREIGN KEY ("campusRoomId") REFERENCES "CampusRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
