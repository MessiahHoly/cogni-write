import { z } from "zod";

export const generateSchema = z.object({
  topic: z.string().min(1)
})

export type GeneratePostRequest = z.infer<typeof generateSchema>