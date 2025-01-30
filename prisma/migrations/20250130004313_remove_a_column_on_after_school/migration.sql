/*
  Warnings:

  - The values [LeaveImmediately,StayForAWhile,StayUntilEnd] on the enum `AfterSchool` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AfterSchool_new" AS ENUM ('Leave', 'Stay');
ALTER TABLE "User" ALTER COLUMN "afterSchool" TYPE "AfterSchool_new" USING ("afterSchool"::text::"AfterSchool_new");
ALTER TYPE "AfterSchool" RENAME TO "AfterSchool_old";
ALTER TYPE "AfterSchool_new" RENAME TO "AfterSchool";
DROP TYPE "AfterSchool_old";
COMMIT;
