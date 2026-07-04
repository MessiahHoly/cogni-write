// import { generateSchema } from "@/lib/schemas/article"
import { NextResponse } from "next/server"
// import { z } from "zod"
import {
  generateAndSaveArticle,
} from "@/lib/data/article"
import { prisma } from "@/lib/data/prisma"

export const POST = async (request: Request) => {
  const apiKey = request.headers.get("x-api-key")
  const expectedKey = process.env.ARTICLE_GENERATION_KEY

  if (!expectedKey || apiKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  // const json = await request.json()
  // const result = generateSchema.safeParse(json)

  // if (!result.success) {
  //   const error = z.prettifyError(result.error)
  //   return NextResponse.json({ error }, { status: 400 })
  // }

  // const { topic } = result.data

  const contentEngines = await prisma.contentEngine.findMany()

  const results = await Promise.all(
    contentEngines.map(async contentEngine => {
      const { data, error } = await generateAndSaveArticle(contentEngine)

      if (error || !data) {
        return { error: error || 'Unknown error occurred.' }
      } else {
        return { data }
      }
    })
  )

  // const { data, error } = await generateAndSaveArticle(topic)

  // 4. Evaluation and Final Response Output
  // if (error || !data) {
  //   console.error("All fallback layers exhausted without success.", error)
  //   return NextResponse.json(
  //     { success: false, error: "Failed to generate article from all fallback models." },
  //     { status: 500 }
  //   )
  // }

  return NextResponse.json(results)
  // return NextResponse.json({ success: true, data })
}