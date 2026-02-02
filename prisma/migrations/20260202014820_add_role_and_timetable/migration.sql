-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'Moderator';
ALTER TYPE "Role" ADD VALUE 'Mentor';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "moderatorOrMentorCampusId" TEXT;

-- CreateTable
CREATE TABLE "TimeTable" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "rawTable" JSONB NOT NULL,

    CONSTRAINT "TimeTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeTableFixReport" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "byId" TEXT NOT NULL,
    "reason" TEXT,
    "tableId" TEXT NOT NULL,
    "fixedTable" JSONB NOT NULL,

    CONSTRAINT "TimeTableFixReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_moderatorOrMentorCampusId_fkey" FOREIGN KEY ("moderatorOrMentorCampusId") REFERENCES "Campus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeTableFixReport" ADD CONSTRAINT "TimeTableFixReport_byId_fkey" FOREIGN KEY ("byId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeTableFixReport" ADD CONSTRAINT "TimeTableFixReport_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "TimeTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
