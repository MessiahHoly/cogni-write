import { prisma } from "./prisma";

export const fetchCommentsByArticleId = (articleId: string) => prisma.comment.findMany({
  where: { articleId },
  include: {
    user: {
      select: {
        name: true,
        image: true
      }
    }
  },
  orderBy: {
    createdAt: 'desc',
  },
});