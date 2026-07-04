import { z } from "zod";

export const generateSchema = z.object({
  topic: z.string().min(1)
})

export type GeneratePostRequest = z.infer<typeof generateSchema>

export const CreateArticleSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  content: z.string().min(10, "Content must be a valid generated article"),
  modelUsed: z.string().min(1, "Model identifier is required"),
  contentEngineId: z.string().min(1, "Content Engine ID is required")
})

export type CreateArticleInput = z.infer<typeof CreateArticleSchema>