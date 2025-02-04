/*
  Warnings:

  - You are about to drop the column `title` on the `Period` table. All the data in the column will be lost.
  - Added the required column `innername` to the `Period` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Period` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Period" DROP COLUMN "title",
ADD COLUMN     "innername" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
