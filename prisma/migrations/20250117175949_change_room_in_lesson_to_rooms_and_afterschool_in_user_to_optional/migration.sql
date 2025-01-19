/*
  Warnings:

  - You are about to drop the column `roomId` on the `Lesson` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_roomId_fkey";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "roomId";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "afterSchool" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_LessonToRoom" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_LessonToRoom_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LessonToRoom_B_index" ON "_LessonToRoom"("B");

-- AddForeignKey
ALTER TABLE "_LessonToRoom" ADD CONSTRAINT "_LessonToRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonToRoom" ADD CONSTRAINT "_LessonToRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
