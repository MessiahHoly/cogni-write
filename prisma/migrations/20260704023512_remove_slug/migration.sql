/*
  Warnings:

  - You are about to drop the column `slug` on the `article` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "article_contentEngineId_slug_key";

-- AlterTable
ALTER TABLE "article" DROP COLUMN "slug";
