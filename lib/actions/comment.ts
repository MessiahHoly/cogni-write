'use server'

import { getSession } from "../auth/server"
import { CreateCommentSchema } from "../schemas/comment"
import { revalidatePath } from "next/cache"
import { createComment } from "../data/comment"
import { z } from 'zod'

export const createCommentAction = async (articleId: string, commentId: string | null, initialState: unknown, formData: FormData) => {
  // export const createCommentAction = async (articleId: string, initialState: unknown, formData: FormData) => {
  const [session] = await Promise.all([getSession()])

  if (!session?.user.id) {
    return { success: false, error: "Unauthorised.  Please log in to comment." }
  }

  const result = CreateCommentSchema.safeParse({ articleId, commentId, content: formData.get("content") })
  // const result = CreateCommentSchema.safeParse({ articleId, content: formData.get("content") })

  if (!result.success) {
    return { error: z.prettifyError(result.error) }
  }

  const { data } = result

  try {
    const comment = await createComment(session.user.id)(data)
    revalidatePath(`${comment.article.contentEngine.slug}/${data.articleId}`)

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred." }
  }
}