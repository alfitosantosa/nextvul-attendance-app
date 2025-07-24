/*
  Warnings:

  - Added the required column `name` to the `parents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parents" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "name" TEXT NOT NULL;
