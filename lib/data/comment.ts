import {
  // Comment,
  Prisma
} from "@/generated/prisma/client";
import { prisma } from "./prisma";
import { GemmaModel, MODELS_FALLBACK_CHAIN } from "../schemas/ai";
import { ai } from "./ai";
import { verifyRouteAuth } from "../auth/server";
import { fetchOrCreateCogni } from "./user";
import { CreateCommentInput } from "../schemas/comment";

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

export const fetchNewerCommentsByOtherUsers = (cogniUserId: string) => (date: Date) => prisma.comment.findMany({
  where: { createdAt: { gte: date }, userId: { not: cogniUserId } },
  select: { article: { include: { contentEngine: { select: { slug: true } } } }, user: { select: { name: true } }, content: true }
})

//TODO: move cogni email to env

export const attemptGeneration = (systemInstruction: string) => (comment: Prisma.CommentGetPayload<{
  select: { user: { select: { name: true } }, article: true, content: true }
}>) => async (model: GemmaModel) => {
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

    return { data: { text } }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Comment generation by AI failed.' }
  }
}

export const fetchLatestCommentByUserId = (userId: string) => prisma.comment.findFirst({
  where: { userId }, orderBy: { createdAt: 'desc' }, take: 1
})

export const fetchFirstComment = () => prisma.comment.findFirst({ orderBy: { createdAt: 'desc' }, take: 1 })

export const generateComment = async (comment: Prisma.CommentGetPayload<{
// export const generateAndSaveComment = async (comment: Prisma.CommentGetPayload<{
  select: { user: { select: { name: true } }, article: true, content: true }
}>) => {
  const attemptGenerationWithSystemInstructionAndComment = attemptGeneration('')(comment)

  type PipelineResult = Awaited<ReturnType<typeof attemptGenerationWithSystemInstructionAndComment>>
  const initialAccumulator = Promise.resolve<PipelineResult>({ error: 'No attempts made yet.' })

  const finalPipelineResult = await MODELS_FALLBACK_CHAIN.reduce(async (accumulatorPromise, model) => {
    const resolvedAccumulator = await accumulatorPromise

    if ('data' in resolvedAccumulator) {
      return resolvedAccumulator
    }

    return attemptGenerationWithSystemInstructionAndComment(model)
  }, initialAccumulator)

  if ('error' in finalPipelineResult) {
    return { error: 'All attempts to generate an article failed.' }
  }

  return { data: finalPipelineResult.data }
}

export const generateComments = async (request: Request) => {
  const authFailed = verifyRouteAuth(request)
  if (authFailed) return authFailed

  const { data, error } = await fetchOrCreateCogni()
  if (!data) return { error }

  const [latestCommentByCogni, firstComment] = await Promise.all([fetchLatestCommentByUserId(data.id), fetchFirstComment()])

  const date = latestCommentByCogni ? latestCommentByCogni.createdAt : firstComment?.createdAt

  if (!date) return { error: "No existing comment." }

  const comments = await fetchNewerCommentsByOtherUsers(data.id)(date)
  const attemptGenerationWithsystemInstruction = attemptGeneration('')

  const commentsByCogni = comments.map(async comment => {
    const attemptGenerationWithComment = attemptGenerationWithsystemInstruction(comment)

    type PipelineResult = Awaited<ReturnType<typeof attemptGenerationWithComment>>
    const initialAccumulator = Promise.resolve<PipelineResult>({ error: 'No attempts made yet.' })

    const commentsByCogni = await MODELS_FALLBACK_CHAIN.reduce(async (accumulatorPromise, model) => {
      const resolvedAccumulator = await accumulatorPromise

      if ('data' in resolvedAccumulator) {
        return resolvedAccumulator
      }

      return attemptGenerationWithComment(model)
    }, initialAccumulator)

    return commentsByCogni
  })

  return commentsByCogni
}

export const createComment = (userId: string) => async (data: CreateCommentInput) => prisma.comment.create({
  data: { userId, ...data },
  select: { article: { select: { id: true, content: true, createdAt: true, contentEngine: { select: { slug: true } } } } }
})