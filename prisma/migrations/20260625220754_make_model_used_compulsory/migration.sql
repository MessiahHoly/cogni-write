/*
  Warnings:

  - Made the column `modelUsed` on table `generated_articles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "generated_articles" ALTER COLUMN "modelUsed" SET NOT NULL;
