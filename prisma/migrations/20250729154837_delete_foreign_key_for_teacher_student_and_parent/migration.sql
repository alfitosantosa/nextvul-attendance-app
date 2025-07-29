-- AlterTable
ALTER TABLE "parents" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "students" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "teachers" ALTER COLUMN "userId" DROP NOT NULL;
