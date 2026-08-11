import {
  Prisma
} from "@/generated/prisma/client";
import { prisma } from "./prisma";
import { GemmaModel, MODELS_FALLBACK_CHAIN } from "../schemas/ai";
import { ai } from "./ai";
import { verifyRouteAuth } from "../auth/server";
import { fetchOrCreateCogni } from "./user";
import { CreateCommentInput } from "../schemas/comment";

export const fetchCommentsByArticleId = (articleId: string) => prisma.comment.findMany({
  where: { articleId, commentId: null },
  include: {
    user: { select: { name: true, image: true } },
    comments: { include: { user: { select: { name: true, image: true } } }, orderBy: { createdAt: 'asc' } }
  },
  orderBy: { createdAt: 'desc', },
});

type CommentNode = Prisma.CommentGetPayload<{ include: { user: { select: { name: true, image: true } } } }> & { comments: CommentNode[] }

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
  // const buildNode = (comment: Prisma.CommentGetPayload<{ include: { user: { select: { name: true, image: true } } } }>): CommentNode => {
    const children = childrenMap.get(comment.id) ?? []
    return { ...comment, comments: children.map(buildNode) }
  }

  return rawComments.filter(comment => !comment.commentId).map(buildNode).reverse()

  // const childrenByParentId = rawComments.reduce<Record<string, CommentNode[]>>((acc, comment) => {
  //   if (!comment.commentId) return acc
  //   const parentId = comment.commentId
  //   return { ...acc, [parentId]: [...(acc[parentId] || []), { ...comment, comments: [] }] }
  // }, {})

  // const attachChildren = (node: CommentNode): CommentNode => {
  //   const children = childrenByParentId[node.id] || []
  //   return { ...node, comments: children.map(attachChildren) }
  // }

  // return rawComments.filter(comment => !comment.commentId).map(c => attachChildren({ ...c, comments: [] })).reverse()

  // const nodeMap = [...rawComments].reverse().reduce<Map<string, CommentNode>>((map, comment) => {
  //   const children = Array.from(map.values()).filter(node => node.commentId === comment.id)
  //   const node = { ...comment, comments: children }
  //   const updatedMap = new Map(Array.from(map.entries()).filter(([_, n]) => n.commentId !== comment.id))
  //   return updatedMap.set(comment.id, node)
  // }, new Map())

  // return Array.from(nodeMap.values())

  // const { rootComments } = rawComments.reduce<{ nodeMap: Map<string, CommentNode>, rootComments: CommentNode[] }>((acc, comment) => {
  //   const node = { ...comment, comments: [] }

  //   const updatedMap = new Map(acc.nodeMap).set(node.id, node)
  //   const parentNode = node.commentId ? updatedMap.get(node.commentId) : null

  //   if (parentNode) {
  //     updatedMap.set(comment.commentId!, { ...parentNode, comments: [...parentNode.comments, node] })
  //     return { nodeMap: updatedMap, rootComments: acc.rootComments }
  //   }

  //   return { nodeMap: updatedMap, rootComments: [...acc.rootComments, node] }

  // }, { nodeMap: new Map(), rootComments: [] })

  // return rootComments.reverse()
};

export const fetchNewerCommentsByOtherUsers = (cogniUserId: string) => (date: Date) => prisma.comment.findMany({
  where: { createdAt: { gte: date }, userId: { not: cogniUserId } },
  include: { article: { include: { contentEngine: { select: { slug: true } } } }, user: { select: { name: true } } }
  // select: { article: { include: { contentEngine: { select: { slug: true } } } }, user: { select: { name: true } }, content: true }
})

const COGNI_SYSTEM_INSTRUCTION = `
You are Cogni, an insightful, warm, and engaged community member commenting on an online article.

RULES:
1. Write EXACTLY ONE natural comment reply. Never offer options, meta-commentary, lists of choices, bullet points, or markdown headers.
2. Speak naturally, like a real person replying on a forum. Match the user's conversational tone.
3. Keep it concise (1 to 3 short paragraphs max).
4. Direct your response to the specific question or point the user raised in their comment, referencing the article's context when relevant.
5. Do NOT start with meta-intros like "Here is a reply:" or "Option 1:". Dive straight into the reply.
`;

export const attemptGeneration = (systemInstruction: string) => (comment: Prisma.CommentGetPayload<{
  select: { user: { select: { name: true } }, article: true, content: true }
}>) => async (model: GemmaModel) => {
  const { article, content, user } = comment
  const contents = `${user.name} posted a comment.  The details as follows:
  
  Article Topic: ${article.topic}
  Article Content: ${article.content}
  
  Comment by ${user.name}: "${content}"

  Write a direct, natural reply as Cogni responding to ${user.name}.
  
  CRITICAL: Output ONLY Cogni's direct, conversational reply as plain text. Do NOT provide options, bullet points, meta-intros, or markdown headers.`

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

const generateComments = async (request: Request) => {
  const authFailed = verifyRouteAuth(request)
  if (authFailed) return authFailed

  const { data, error } = await fetchOrCreateCogni()
  if (!data) return { error }

  const [latestCommentByCogni, firstComment] = await Promise.all([fetchLatestCommentByUserId(data.id), fetchFirstComment()])

  const date = latestCommentByCogni ? latestCommentByCogni.createdAt : firstComment?.createdAt

  if (!date) return { error: "No existing comment." }

  const comments = await fetchNewerCommentsByOtherUsers(data.id)(date)
  const attemptGenerationWithsystemInstruction = attemptGeneration(COGNI_SYSTEM_INSTRUCTION)

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