/*
  Warnings:

  - You are about to drop the `_LessonToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LessonToUser" DROP CONSTRAINT "_LessonToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_LessonToUser" DROP CONSTRAINT "_LessonToUser_B_fkey";

-- AlterTable
ALTER TABLE "LessonPeriod" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lessonId" TEXT;

-- DropTable
DROP TABLE "_LessonToUser";

-- CreateTable
CREATE TABLE "_LessonPeriodToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LessonPeriodToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LessonPeriodToUser_B_index" ON "_LessonPeriodToUser"("B");

-- AddForeignKey
ALTER TABLE "_LessonPeriodToUser" ADD CONSTRAINT "_LessonPeriodToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "LessonPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonPeriodToUser" ADD CONSTRAINT "_LessonPeriodToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
