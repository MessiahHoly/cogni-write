import { verifyRouteAuth } from "@/lib/auth/server"
import { fetchOrCreateCogni } from "@/lib/data/user"

export const handleCommentGeneration = async (request: Request) => {
  const authFailed = verifyRouteAuth(request)
  if (authFailed) return authFailed

  const cogni = await fetchOrCreateCogni()
  
}