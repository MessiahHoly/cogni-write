import { z } from "zod";
import { CreateContentEngineSchema } from "../schemas/content-engine";
import { toSlug } from "../utils";
import { prisma } from "./prisma";


export const fetchContentEngine = () => prisma.contentEngine.findFirst()

export const fetchContentEngines = () => prisma.contentEngine.findMany({ include: { articles: { orderBy: { updatedAt: 'desc' } } } })

const fetchContentEngineBySlug = (slug: string) => prisma.contentEngine.findUnique({ where: { slug } })

const resolveUniqueSlug = (baseSlug: string) => async (counter = 0): Promise<string> => {
  const currentSlug = counter === 0 ? baseSlug : `${baseSlug}-${counter}`

  const existing = await fetchContentEngineBySlug(currentSlug)

  if (!existing) return currentSlug

  return resolveUniqueSlug(baseSlug)(counter + 1)
}

export const validateAndResolveContentEngine = async (rawData: unknown) => {
  console.log("validateAndResolveContentEngine rawData:", rawData)
  
  const shapeResult = CreateContentEngineSchema.safeParse(rawData)

  if (!shapeResult.success) {
    return { error: z.prettifyError(shapeResult.error), data: undefined }
  }

  const { topic } = shapeResult.data
  const baseSlug = toSlug(topic)

  const slug = await resolveUniqueSlug(baseSlug)()

  return { data: { topic, slug }, error: undefined }
}
