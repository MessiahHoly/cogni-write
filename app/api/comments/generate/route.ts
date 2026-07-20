import { verifyRouteAuth } from "@/lib/auth/server"

export const handleCommentGeneration = (request: Request) => {
  const authFailed = verifyRouteAuth(request)
  if (authFailed) return authFailed

  
}