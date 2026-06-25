import { z } from "zod"
import { CreateArticleSchema } from "../schemas/article"
import { prisma } from "./prisma"

export const createArticle = (topic: string) => (content: string) => async (modelUsed: string) => {
  // Validate the combined inputs at runtime
  const result = CreateArticleSchema.safeParse({
    topic,
    content,
    modelUsed,
  })

  if (!result.success) {
    // You can handle this via an error boundary, logs, or throwing
    const error = z.prettifyError(result.error)
    // console.error("Validation failed for article creation:", result.error.format())
    // throw new Error("Invalid article data provided.")
    return { error }
  }

  // Destructure the securely validated data
  const { data } = result

  const article = await prisma.article.create({
    // data: {
    //   topicSnapshot: data.topicSnapshot,
    //   content: data.content,
    //   modelUsed: data.modelUsed,
    // },
    data
  })

  return { data: article }
}