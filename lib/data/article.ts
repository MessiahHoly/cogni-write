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

const MODELS_FALLBACK_CHAIN = [
  'gemma-4-31b-it',
  'gemma-4-26b-a4b-it',
  'gemma-2.5-flash'
] as const

type GemmaModel = typeof MODELS_FALLBACK_CHAIN[number]

const ai = new GoogleGenAI({})

export const attemptGeneration = (topic: string) => (contents: string) => (systemInstruction: string) => async (model: GemmaModel) => {
  console.log(`Attempting generation with ${model}...`)

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: { systemInstruction }
    })

    const { text } = response

    if (!text) return { error: 'Text is empty.', data: undefined }

    return await createArticle(topic)(model)(text)
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Article generation by AI failed.' }
  }
}