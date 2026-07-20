import { verifyRouteAuth } from "@/lib/auth/server"
import { fetchFirstComment, fetchLatestCommentByUserId, fetchNewerCommentsByOtherUsers } from "@/lib/data/comment"
import { fetchOrCreateCogni } from "@/lib/data/user"

export const handleCommentGeneration = async (request: Request) => {
  const authFailed = verifyRouteAuth(request)
  if (authFailed) return authFailed

  const { data, error } = await fetchOrCreateCogni()
  if (!data) return { error }

  const [latestCommentByCogni, firstComment] = await Promise.all([fetchLatestCommentByUserId(data.id), fetchFirstComment()])

  const date = latestCommentByCogni ? latestCommentByCogni.createdAt : firstComment?.createdAt

  if (!date) return { error: "No existing comment." }

  const comments = await fetchNewerCommentsByOtherUsers(data.id)(date)

}