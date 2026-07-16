import { z } from "zod";

export const CreateCommentSchema = z.object({
  articleId: z.cuid2(),
  content: z.string().min(1, "Comment cannot be empty")
})

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>