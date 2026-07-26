import { z } from "zod";

export const CreateCommentSchema = z.object({
  articleId: z.cuid2(),
  commnetId: z.cuid2().nullable(),
  content: z.string().min(1, "Comment cannot be empty")
})

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>