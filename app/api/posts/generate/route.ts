import { generateSchema } from "@/lib/schemas/post"
import { NextResponse } from "next/server"
import z from "zod"

export const POST = async (request: Request) => {
  try {
    const json = await request.json()
    const result = generateSchema.safeParse(json)

    if (!result.success) {
      const error = z.prettifyError(result.error)
      return NextResponse.json({ error }, { status: 400 })
    }

    const { topic } = result.data
    return NextResponse.json({ success: true, topic })
  } catch (error) {
    return NextResponse.json({ error: 'Malformed JSON' }, { status: 400 })
  }
}