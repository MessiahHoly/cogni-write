import { verifyRouteAuth } from "@/lib/auth/server"
import {
  createComment,
  fetchFirstComment, fetchLatestCommentByUserId, fetchNewerCommentsByOtherUsers,
  // generateAndSaveComment,
  generateComment
} from "@/lib/data/comment"
import { fetchOrCreateCogni } from "@/lib/data/user"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

const handleCommentGeneration = async (request: Request) => {
  const authFailed = verifyRouteAuth(request)
  if (authFailed) return authFailed

  //TODO: check if {data: {data|error}|error} should be returned. Same for article route. 

  const { data: cogni, error } = await fetchOrCreateCogni()
  if (!cogni) return NextResponse.json({ error })
  // const { data, error } = await fetchOrCreateCogni()
  // if (!data) return NextResponse.json({ error })

  const [latestCommentByCogni, firstComment] = await Promise.all([fetchLatestCommentByUserId(cogni.id), fetchFirstComment()])

  const date = latestCommentByCogni ? latestCommentByCogni.createdAt : firstComment?.createdAt

  if (!date) return NextResponse.json({ error: "No existing comment." })

  const comments = await fetchNewerCommentsByOtherUsers(cogni.id)(date)

  const results = await Promise.all(
    comments.map(async comment => {
      // const result = await generateAndSaveComment(comment)
      const result = await generateComment(comment)

      if ('error' in result) {
        return { error: result.error || 'Unknown error occurred.' }
      } else {
        await createComment(cogni.id)({ articleId: comment.article.id, content: result.data.text })
        revalidatePath(`/${comment.article.contentEngine.slug}/${comment.article.id}`)
        return { data: result.data }
      }
    })
  )

  return NextResponse.json(results)
}

export const POST = async (request: Request) => handleCommentGeneration(request)
export const GET = async (request: Request) => handleCommentGeneration(request)