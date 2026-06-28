import { z } from "zod"
import { CreateArticleSchema } from "../schemas/article"
import { prisma } from "./prisma"
import { GoogleGenAI } from "@google/genai"

export const createArticle = (topic: string) => (modelUsed: string) => async (content: string) => {
  const result = CreateArticleSchema.safeParse({
    topic,
    content,
    modelUsed,
  })

  if (!result.success) {
    const error = z.prettifyError(result.error)
    return { error }
  }

  // Destructure the securely validated data
  const { data } = result

  const article = await prisma.article.create({
    data
  })

  return { data: article }
}

export const MODELS_FALLBACK_CHAIN = [
  'gemma-4-31b-it',
  'gemma-4-26b-a4b-it',
  'gemma-2.5-flash'
] as const

type GemmaModel = typeof MODELS_FALLBACK_CHAIN[number]

const ai = new GoogleGenAI({})

const attemptGeneration = (topic: string) => (contents: string) => (systemInstruction: string) => async (model: GemmaModel) => {
// export const attemptGeneration = (topic: string) => (contents: string) => (systemInstruction: string) => async (model: GemmaModel) => {
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

    return await createArticle(topic)(model)(text)
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Article generation by AI failed.' }
  }
}

export const generateAndSaveArticle = async (topic: string) => {
  const contents = `
Write a comprehensive blog article based on the following topic.

Topic: ${topic}

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

  const attemptGenerationWithTopicContentsAndSystemInstruction = attemptGeneration(topic)(contents)(systemInstruction)

  // 2. Exact return contract type inference
  type PipelineResult = Awaited<ReturnType<typeof attemptGenerationWithTopicContentsAndSystemInstruction>>

  // Explicit type matching: initialized with data: undefined matching our pipeline returns
  const initialAccumulator = Promise.resolve({ error: 'INITIAL_TRIGGER', data: undefined } as PipelineResult)

  return await MODELS_FALLBACK_CHAIN.reduce<Promise<PipelineResult>>(
    async (previousPromise, currentModel) => {
      const previousResult = await previousPromise

      // Circuit Breaker: If data exists, bypass remaining steps and cascade down
      if (previousResult.data) {
        return previousResult
      }

      return attemptGenerationWithTopicContentsAndSystemInstruction(currentModel)
    },
    initialAccumulator
  )
}