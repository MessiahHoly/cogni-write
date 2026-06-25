/*
  Warnings:

  - You are about to drop the `ContentEngine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContentEngineArchive` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ContentEngine" DROP CONSTRAINT "ContentEngine_createdById_fkey";

-- DropForeignKey
ALTER TABLE "ContentEngineArchive" DROP CONSTRAINT "ContentEngineArchive_contentEngineId_fkey";

-- DropForeignKey
ALTER TABLE "ContentEngineArchive" DROP CONSTRAINT "ContentEngineArchive_createdById_fkey";

-- DropTable
DROP TABLE "ContentEngine";

-- DropTable
DROP TABLE "ContentEngineArchive";

-- CreateTable
CREATE TABLE "content_engine" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "content_engine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_engine_archive" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "contentEngineId" TEXT NOT NULL,

    CONSTRAINT "content_engine_archive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generated_articles" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "modelUsed" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generated_articles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "content_engine" ADD CONSTRAINT "content_engine_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_engine_archive" ADD CONSTRAINT "content_engine_archive_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_engine_archive" ADD CONSTRAINT "content_engine_archive_contentEngineId_fkey" FOREIGN KEY ("contentEngineId") REFERENCES "content_engine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
