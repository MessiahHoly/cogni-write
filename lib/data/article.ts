import { z } from "zod"
import { CreateArticleSchema } from "../schemas/article"
import { prisma } from "./prisma"
import { GoogleGenAI } from "@google/genai"
import { ContentEngine } from "@/generated/prisma/browser"
import { cache } from "react"

const fetchArticleByContentEngineId = (contentEngineId: string) => {
  return prisma.article.findMany({
    where: { contentEngineId },
    select: { content: true },
    orderBy: { createdAt: 'desc' }
  })
}

const createArticle = (contentEngine: ContentEngine) => (modelUsed: string) => async (content: string) => {
  const result = CreateArticleSchema.safeParse({
    topic: contentEngine.topic,
    content,
    modelUsed,
    contentEngineId: contentEngine.id
  })

  if (!result.success) {
    const error = z.prettifyError(result.error)
    return { error }
  }

  const { data } = result
  const article = await prisma.article.create({ data })

  return { data: article }
}

export const MODELS_FALLBACK_CHAIN = [
  'gemma-4-31b-it',
  'gemma-4-26b-a4b-it',
  'gemma-2.5-flash'
] as const

type GemmaModel = typeof MODELS_FALLBACK_CHAIN[number]

const ai = new GoogleGenAI({})

const attemptGeneration =
  (contentEngine: ContentEngine) => (contents: string) => (systemInstruction: string) => async (model: GemmaModel) => {
    console.log(`Attempting generation with ${model}...`)

    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: { systemInstruction }
      })

      const { text } = response
      if (!text) return {
        error: 'Text is empty.',
      }

      return await createArticle(contentEngine)(model)(text)
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Article generation by AI failed.' }
    }
  }

export const generateAndSaveArticle = async (contentEngine: ContentEngine) => {
  const articles = await fetchArticleByContentEngineId(contentEngine.id)
  const titles = articles.map(({ content }) => content.split('\n')[0].replace(/^#\s*/, '').trim())
  const historyContext = titles.length > 0
    ? `\nHere are the titles of articles you have already written on this topic:\n${titles.map((title, i) => `${i + 1}. "${title}"`).join('\n')}\n\nCRITICAL MANDATE: Do not duplicate the angles, hooks, or core structures used in these past titles. You must provide a fresh perspective, evolve the narrative, or focus on a different sub-angle of the topic.`
    : '\nThis is the first article for this topic. Establish a foundational overview.';

  const contents = `
Write a comprehensive blog article based on the following topic.

Topic: ${contentEngine.topic}
${historyContext}

Requirements:
1. Target Length: Approximately 800–1200 words.
2. Hook: Start with a strong opening hook that addresses a pain point, a fascinating fact, or a common emotional experience related to the topic.
3. Subsections: Break down the topic into 3-4 distinct angles or arguments.
4. Call to Action/Wrap-up: Conclude with a memorable final thought or a subtle prompt for reader reflection.
`;

  const systemInstruction = `
You are an expert digital journalist and viral blog writer. 
Your goal is to write highly engaging, informative, and scannable articles that capture and hold a reader's attention.

Follow these strict formatting and style guidelines:
- Tone: Engaging, authoritative yet accessible, and thought-provoking.
- Structure: Always use a compelling title, a hook-driven introduction, clear subsections with descriptive H3 headers, and a actionable or reflective conclusion.
- Formatting: Use Markdown for bolding key concepts and creating bulleted/numbered lists to maximize scannability. 
- Cleanliness: Do NOT include placeholders like "[Your Name]", "[Date]", or meta-commentary. Start directly with the article title.
`;

  //TODO: feed past content to the AI to avoid repeating past content and angles. This will require a more sophisticated prompt engineering approach, potentially involving summarization of past articles and feeding that summary into the system instruction.

  const attemptGenerationWithTopicContentsAndSystemInstruction = attemptGeneration(contentEngine)(contents)(systemInstruction)

  type PipelineResult = Awaited<ReturnType<typeof attemptGenerationWithTopicContentsAndSystemInstruction>>

  const initialAccumulator = Promise.resolve<PipelineResult>({ error: 'No attempts made yet.' })

  const finalPipelineResult = await MODELS_FALLBACK_CHAIN.reduce(async (accumulatorPromise, model) => {
    const resolvedAccumulator = await accumulatorPromise

    if ('data' in resolvedAccumulator) {
      return resolvedAccumulator
    }

    return attemptGenerationWithTopicContentsAndSystemInstruction(model)
  }, initialAccumulator)

  if('error' in finalPipelineResult) {
    return { error: 'All attempts to generate an article failed.' }
  }

  return { data: finalPipelineResult.data }

  // const pipelinePromises = MODELS_FALLBACK_CHAIN.map(model => attemptGenerationWithTopicContentsAndSystemInstruction(model))

  // const rawResults = await Promise.all(pipelinePromises)

  // // 2. Exact return contract type inference
  // // type PipelineResult = Awaited<ReturnType<typeof attemptGenerationWithTopicContentsAndSystemInstruction>>
  // type SuccessfulArticleResult = Extract<PipelineResult, { data: unknown }>

  // const isSuccessResponse = (result: PipelineResult): result is SuccessfulArticleResult => !('error' in result)

  // const successfulArticles = rawResults.filter(isSuccessResponse).map(result => result.data)

  // if (successfulArticles.length === 0) {
  //   return { error: 'All attempts to generate an article failed.' }
  // }

  // return { data: successfulArticles }
}

export const fetchArticleBySlugAndId = (slug: string) => (id: string) => cache(async () => {
  return prisma.article.findUnique({
    where: { id, contentEngine: { slug } },
    include: { contentEngine: true }
  })
})()
