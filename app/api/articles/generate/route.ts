import { NextResponse } from "next/server"
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

  const contentEngines = await prisma.contentEngine.findMany()

  const results = await Promise.all(
    contentEngines.map(async contentEngine => {
      const result = await generateAndSaveArticle(contentEngine)
      // const { data, error } = await generateAndSaveArticle(contentEngine)

      if ('error' in result) {
      // if ('error' in result && result.error) {
        return { error: result.error || 'Unknown error occurred.' }
      // }
      } else {
        return { data: result.data }
      }

      // if (result.data) {
      //   return { data: result.data }
      // }

      // return { error: 'Unknown error occurred.' }
    })
  )

  return NextResponse.json(results)
}