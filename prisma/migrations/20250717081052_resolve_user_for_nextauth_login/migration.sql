/*
  Warnings:

  - You are about to drop the column `email` on the `parents` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `parents` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `parents` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `teachers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[classId,subjectId,teacherId,dayOfWeek,startTime]` on the table `schedules` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "majors" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "parents" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "payment_types" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "permissions" TEXT[];

-- AlterTable
ALTER TABLE "students" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "teachers" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "avatar" TEXT,
    "emailVerified" TIMESTAMP(3),
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "majorId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 36,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "classes_name_academicYearId_key" ON "classes"("name", "academicYearId");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_classId_subjectId_teacherId_dayOfWeek_startTime_key" ON "schedules"("classId", "subjectId", "teacherId", "dayOfWeek", "startTime");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "majors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "violations" ADD CONSTRAINT "violations_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
