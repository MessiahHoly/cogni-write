import { generateSchema } from "@/lib/schemas/article"
import { NextResponse } from "next/server"
import { z } from "zod"
import {
  // attemptGeneration,
  generateAndSaveArticle,
  // MODELS_FALLBACK_CHAIN,
} from "@/lib/data/article"

export const POST = async (request: Request) => {
  const apiKey = request.headers.get("x-api-key")
  const expectedKey = process.env.ARTICLE_GENERATION_KEY

  if (!expectedKey || apiKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const json = await request.json()
  const result = generateSchema.safeParse(json)

  if (!result.success) {
    const error = z.prettifyError(result.error)
    return NextResponse.json({ error }, { status: 400 })
  }

  const { topic } = result.data

  //   const contents = `
  // Write a comprehensive blog article based on the following topic.

  // Topic: ${topic}

  // Requirements:
  // 1. Target Length: Approximately 800–1200 words.
  // 2. Hook: Start with a strong opening hook that addresses a pain point, a fascinating fact, or a common emotional experience related to the topic.
  // 3. Subsections: Break down the topic into 3-4 distinct angles or arguments.
  // 4. Call to Action/Wrap-up: Conclude with a memorable final thought or a subtle prompt for reader reflection.
  // `;

  //   const systemInstruction = `
  // You are an expert digital journalist and viral blog writer. 
  // Your goal is to write highly engaging, informative, and scannable articles that capture and hold a reader's attention.

  // Follow these strict formatting and style guidelines:
  // - Tone: Engaging, authoritative yet accessible, and thought-provoking.
  // - Structure: Always use a compelling title, a hook-driven introduction, clear subsections with descriptive H3 headers, and a actionable or reflective conclusion.
  // - Formatting: Use Markdown for bolding key concepts and creating bulleted/numbered lists to maximize scannability. 
  // - Cleanliness: Do NOT include placeholders like "[Your Name]", "[Date]", or meta-commentary. Start directly with the article title.
  // `;

  //   const attemptGenerationWithTopicContentsAndSystemInstruction = attemptGeneration(topic)(contents)(systemInstruction)

  //   // 2. Exact return contract type inference
  //   type PipelineResult = Awaited<ReturnType<typeof attemptGenerationWithTopicContentsAndSystemInstruction>>

  //   // Explicit type matching: initialized with data: undefined matching our pipeline returns
  //   const initialAccumulator = Promise.resolve({ error: 'INITIAL_TRIGGER', data: undefined } as PipelineResult)

  //   // 3. Pure Functional Pipeline
  //   const finalResult = await MODELS_FALLBACK_CHAIN.reduce<Promise<PipelineResult>>(
  //     async (previousPromise, currentModel) => {
  //       const previousResult = await previousPromise

  //       // Circuit Breaker: If data exists, bypass remaining steps and cascade down
  //       if (previousResult.data) {
  //         return previousResult
  //       }

  //       return attemptGenerationWithTopicContentsAndSystemInstruction(currentModel)
  //     },
  //     initialAccumulator
  //   )

  const { data, error } = await generateAndSaveArticle(topic)

  // 4. Evaluation and Final Response Output
  if (error || !data) {
  // if (finalResult.error || !finalResult.data) {
    console.error("All fallback layers exhausted without success.", error)
    // console.error("All fallback layers exhausted without success.", finalResult.error)
    return NextResponse.json(
      { success: false, error: "Failed to generate article from all fallback models." },
      { status: 500 }
    )
  }


  return NextResponse.json({ success: true, data })
  // return NextResponse.json({ success: true, data: finalResult.data })
}