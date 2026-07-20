import { NextResponse } from "next/server"
import {
  generateAndSaveArticle,
} from "@/lib/data/article"
import { prisma } from "@/lib/data/prisma"
import { revalidatePath } from "next/cache"
import { verifyRouteAuth } from "@/lib/auth/server"

const handleArticleGeneration = async (request: Request) => {
  const authFailed = verifyRouteAuth(request)
  if (authFailed) return authFailed

  const contentEngines = await prisma.contentEngine.findMany()

  const results = await Promise.all(
    contentEngines.map(async contentEngine => {
      const result = await generateAndSaveArticle(contentEngine)

      if ('error' in result) {
        return { error: result.error || 'Unknown error occurred.' }
      } else {
        return { data: result.data }
      }
    })
  )

  revalidatePath("/")
  contentEngines.map(({ slug }) => revalidatePath(`/${slug}`))

  return NextResponse.json(results)
}

export const POST = async (request: Request) => handleArticleGeneration(request)
export const GET = async (request: Request) => handleArticleGeneration(request)