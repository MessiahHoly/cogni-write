'use server'

import { getSession } from "../auth/server"
import { CreateCommentSchema } from "../schemas/comment"
import { revalidatePath } from "next/cache"
import { createComment } from "../data/comment"
import { z } from 'zod'

export const createCommentAction = async (articleId: string, commentId: string | null, initialState: unknown, formData: FormData) => {
  // console.log("createCommentAction called with articleId:", articleId, "commentId:", commentId, "formData:", formData)

  const [session] = await Promise.all([getSession()])

  if (!session?.user.id) {
    return { success: false, error: "Unauthorised.  Please log in to comment." }
  }

  const result = CreateCommentSchema.safeParse({ articleId, commentId, content: formData.get("content") })
  
  // console.log("createCommentAction result:", result)

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