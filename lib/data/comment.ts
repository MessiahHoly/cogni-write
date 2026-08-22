import {
  Prisma
} from "@/generated/prisma/client";
import { prisma } from "./prisma";
import { GemmaModel, MODELS_FALLBACK_CHAIN } from "../schemas/ai";
import { ai } from "./ai";
import { CommentNode, CreateCommentInput } from "../schemas/comment";
import { formatQuery } from "../utils";

export const fetchCommentsByArticleId = (articleId: string) => prisma.comment.findMany({
  where: { articleId, commentId: null },
  include: {
    user: { select: { name: true, image: true } },
    comments: { include: { user: { select: { name: true, image: true } } }, orderBy: { createdAt: 'asc' } }
  },
  orderBy: { createdAt: 'desc', },
});

export const fetchCommentsWithRepliesByArticleId = async (articleId: string) => {
  const rawComments = await prisma.comment.findMany({
    where: { articleId },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: 'asc', },
  })

  const childrenMap = rawComments.reduce((acc, comment) => {
    if (comment.commentId) {
      const list = acc.get(comment.commentId) ?? []
      acc.set(comment.commentId, [...list, comment])
    }
    return acc
  }, new Map<string, typeof rawComments>())

  const buildNode = (comment: (typeof rawComments)[number]): CommentNode => {
    const children = childrenMap.get(comment.id) ?? []
    return { ...comment, comments: children.map(buildNode) }
  }

  return rawComments.filter(comment => !comment.commentId).map(buildNode).reverse()
};

export const fetchNewerCommentsByOtherUsers = (cogniUserId: string) => (date: Date) => prisma.comment.findMany({
  where: { createdAt: { gte: date }, userId: { not: cogniUserId } },
  include: { article: { include: { contentEngine: { select: { slug: true } } } }, user: { select: { name: true } } }
})

const COGNI_SYSTEM_INSTRUCTION = `
You are Cogni, the author of this article and a knowledgeable, warm digital thinker.

RULES:
1. You wrote this article. Respond as the author addressing a reader who is commenting on your piece.
2. Refer to points made in the article using first-person perspective (e.g., "When I wrote about...", "My goal with this piece was..."). Never refer to "the author" as a separate person.
3. Write EXACTLY ONE natural comment reply. Do NOT use bullet points, options, or markdown headers.
4. Keep it concise (1 to 3 short paragraphs max).
5. Direct your response to the specific question or point the user raised in their comment.
`;

export const attemptGeneration = (systemInstruction: string) => (comment: Prisma.CommentGetPayload<{
  select: { user: { select: { name: true } }, article: true, content: true }
}>) => async (model: GemmaModel) => {
  const { article, content, user } = comment
  const contents = `${user.name} left a comment on your article.

Article Details:
Topic: ${article.topic}
Content: ${article.content}

Comment by ${user.name}: "${content}"

Write a direct reply as Cogni (the author of the article) responding to ${user.name}.

CRITICAL:
- Speak as the author of the article.
- Output ONLY Cogni's direct, conversational reply as plain text.`

  console.log(`Attempting generation with ${model}...`)

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.9,
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
  select: { user: { select: { name: true } }, article: true, content: true }
}>) => {
  const attemptGenerationWithSystemInstructionAndComment = attemptGeneration(COGNI_SYSTEM_INSTRUCTION)(comment)

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

export const createComment = (userId: string) => async (data: CreateCommentInput) => prisma.comment.create({
  data: { userId, ...data },
  select: { article: { select: { id: true, content: true, createdAt: true, contentEngine: { select: { slug: true } } } } }
})

const searchComments = async (query: string) => {
  const formattedQuery = formatQuery(query)

  return await prisma.comment.findMany({
    where: { content: { search: formattedQuery } },
    orderBy: { _relevance: { fields: ['content'], search: formattedQuery, sort: 'desc' } },
    include: { user: { select: { name: true, image: true } } }
  })
}