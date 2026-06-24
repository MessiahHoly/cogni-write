import { generateSchema } from "@/lib/schemas/post"
import { NextResponse } from "next/server"
import { success, z } from "zod"
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({})

export const POST = async (request: Request) => {
  const json = await request.json()
  const result = generateSchema.safeParse(json)

  if (!result.success) {
    const error = z.prettifyError(result.error)
    return NextResponse.json({ error }, { status: 400 })
  }

  const { topic } = result.data
  // const interaction = await ai.interactions.create({
  //   model: 'gemini-3.5-flash',
  //   input: "Explain how AI works in a few words",
  // })
  // console.log(interaction.output_text)
  const contents = `Write an blog or news article upon the following topic: ${topic}`
  const systemInstruction = 'You are a professional writer.'

  try {
    console.log("Attempting analysis with gemma-4-31b-it...");
    const response = await ai.models.generateContent({
      model: 'gemma-4-31b-it',
      contents,
      config: { systemInstruction }
    })
    const { text } = response
    return NextResponse.json({ success: true, text })
    // } catch (error) {
    //   console.error(error)
    //   return NextResponse.json({ error: 'Malformed JSON' }, { status: 400 })
    // }
  } catch (gemma31Error) {
    console.warn("gemma-4-31b-it threw an error. Trying stable Gemma MoE variant...", gemma31Error);
    try {
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemma-4-26b-a4b-it',
        contents,
        config: { systemInstruction }
      })
      const { text } = fallbackResponse
      return NextResponse.json({ sucess: true, text })
    } catch (gemma26Error) {
      console.error("gemma-4-26b-a4b-it also threw an error.", gemma26Error);
      try {
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemma-2.5-flash',
          contents,
          config: { systemInstruction }
        })
        const { text } = fallbackResponse
        return NextResponse.json({ success: true, text })
      } catch (gemma25Error) {
        console.warn("gemma-2.5-flash threw an error as well.", gemma25Error);
        return NextResponse.json({ suncess: false, error: "Failed to fetch financial analysis from all models." })
      }
    }
  }
}