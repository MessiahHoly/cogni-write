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

export const fetchComments = (cogniUserId: string) => (date: Date) => prisma.comment.findMany({
  where: { createdAt: { gte: date }, userId: { not: cogniUserId } }, select: { article: true, user: { select: { name: true } } }
})