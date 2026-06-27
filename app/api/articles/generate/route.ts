import { generateSchema } from "@/lib/schemas/article"
import { NextResponse } from "next/server"
import { z } from "zod"
import { GoogleGenAI } from "@google/genai"
import { createArticle } from "@/lib/data/article"

const ai = new GoogleGenAI({})

export const POST = async (request: Request) => {
  const apiKey = request.headers.get("x-api-key")
  const expectedKey = process.env.ARTICLE_GENERATION_KEY

  if (!expectedKey || apiKey !== expectedKey) return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    
  const json = await request.json()
  const result = generateSchema.safeParse(json)

  if (!result.success) {
    const error = z.prettifyError(result.error)
    return NextResponse.json({ error }, { status: 400 })
  }

  const { topic } = result.data
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

  const createArticleWithTopic = createArticle(topic)

  try {
    console.log("Attempting analysis with gemma-4-31b-it...");
    const model = 'gemma-4-31b-it'
    const response = await ai.models.generateContent({
      model,
      // model: 'gemma-4-31b-it',
      contents,
      config: { systemInstruction }
    })
    const { text } = response
    if (!text) throw { error: 'Text is empty.' }
    const { data, error } = await createArticleWithTopic(model)(text)
    if (error) throw { error }
    if (!data) throw { error: 'Could not save in the database.' }
    return NextResponse.json({ success: true, data })
  } catch (gemma31Error) {
    console.warn("gemma-4-31b-it threw an error. Trying stable Gemma MoE variant...", gemma31Error);
    try {
      const model = 'gemma-4-26b-a4b-it'
      const fallbackResponse = await ai.models.generateContent({
        // model: 'gemma-4-26b-a4b-it',
        model,
        contents,
        config: { systemInstruction }
      })
      const { text } = fallbackResponse
      if (!text) throw { error: 'Text is empty.' }
      const { data, error } = await createArticleWithTopic(model)(text)
      if (error) throw { error }
      if (!data) throw { error: 'Could not save in the database.' }
      return NextResponse.json({ success: true, data })
      // return NextResponse.json({ success: true, text })
    } catch (gemma26Error) {
      console.error("gemma-4-26b-a4b-it also threw an error.", gemma26Error);
      try {
        const model = 'gemma-2.5-flash'
        const fallbackResponse = await ai.models.generateContent({
          model,
          // model: 'gemma-2.5-flash',
          contents,
          config: { systemInstruction }
        })
        const { text } = fallbackResponse
        if (!text) throw { error: 'Text is empty.' }
        const { data, error } = await createArticleWithTopic(model)(text)
        if (error) throw { error }
        if (!data) throw { error: 'Could not save in the database.' }
        return NextResponse.json({ success: true, data })
        // return NextResponse.json({ success: true, text })
      } catch (gemma25Error) {
        console.warn("gemma-2.5-flash threw an error as well.", gemma25Error);
        return NextResponse.json({ success: false, error: "Failed to fetch financial analysis from all models." })
      }
    }
  }
}

//TODO: refactor generate content and save content