/*
  Warnings:

  - A unique constraint covering the columns `[contentEngineId,slug]` on the table `article` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `content_engine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contentEngineId` to the `article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `content_engine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `content_engine_archive` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "article" ADD COLUMN     "contentEngineId" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "content_engine" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "content_engine_archive" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "article_contentEngineId_slug_key" ON "article"("contentEngineId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "content_engine_slug_key" ON "content_engine"("slug");

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_contentEngineId_fkey" FOREIGN KEY ("contentEngineId") REFERENCES "content_engine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
