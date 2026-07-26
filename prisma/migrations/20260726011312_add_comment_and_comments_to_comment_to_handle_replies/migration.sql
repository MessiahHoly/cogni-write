-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "commentId" TEXT;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
