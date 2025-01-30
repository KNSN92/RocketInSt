/*
  Warnings:

  - Added the required column `allMember` to the `Campus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campus" ADD COLUMN     "allMember" INTEGER NOT NULL;
