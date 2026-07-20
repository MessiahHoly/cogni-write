import { Prisma } from "@/generated/prisma/client";
import { prisma } from "./prisma";
import { GemmaModel } from "../schemas/ai";
import { ai } from "./ai";

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

//TODO: move cogni email to env

const attemptGeneration = (comment: Prisma.CommentGetPayload<{
  select: { user: { select: { name: true } }, article: true, content: true }
}>) => (systemInstruction: string) => async (model: GemmaModel) => {
  const { article, content, user } = comment
  const contents = `${user.name} posted a comment.  The details as follows:
  
  Topic: ${article.topic}
  Article Content: ${article.content}
  
  User's Comment: ${content}
  User's Name: ${user.name}
  
  Can you create a reply to the comment?`
  console.log(`Attempting generation with ${model}...`)

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.8,
        topP: 0.95,
      },
    })

    const { text } = response
    if (!text) return {
      error: 'Text is empty.',
    }

    // return await createArticle(contentEngine)(model)(text)
    return { data: { text } }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Comment generation by AI failed.' }
  }
}
