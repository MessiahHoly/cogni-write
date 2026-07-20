import { verifyRouteAuth } from "@/lib/auth/server"
import { fetchComments } from "@/lib/data/comment"
import { fetchOrCreateCogni } from "@/lib/data/user"

export const handleCommentGeneration = async (request: Request) => {
  const authFailed = verifyRouteAuth(request)
  if (authFailed) return authFailed

  const cogni = await fetchOrCreateCogni()
  const comments = await fetchComments(cogni.id)(cogni.comments[0].createdAt)
}