// import { Comment, Prisma } from "@/generated/prisma/client"
import { verifyRouteAuth } from "@/lib/auth/server"
// import { ai } from "@/lib/data/ai"
import { fetchComments } from "@/lib/data/comment"
import { fetchOrCreateCogni } from "@/lib/data/user"
// import { GemmaModel } from "@/lib/schemas/ai"

export const handleCommentGeneration = async (request: Request) => {
  const authFailed = verifyRouteAuth(request)
  if (authFailed) return authFailed

  const { data, error } = await fetchOrCreateCogni()
  // const cogni = await fetchOrCreateCogni()
  if (!data) return { error }

  const comments = await fetchComments(data.id)(data.comments[0].createdAt)
  // const comments = await fetchComments(cogni.id)(cogni.comments[0].createdAt)


}