/*
  Warnings:

  - You are about to drop the `generated_articles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "generated_articles";

-- CreateTable
CREATE TABLE "article" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "modelUsed" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_pkey" PRIMARY KEY ("id")
);
