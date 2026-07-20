import { NextResponse } from "next/server";
import { auth } from "./auth"; // path to your Better Auth server instance
import { headers } from "next/headers";

export const getSession = async () => auth.api.getSession({
  headers: await headers()
})

export const isAdmin = (email: string) => email === process.env.ADMIN

export const verifyRouteAuth = (request: Request) => {
  const apiKey = request.headers.get("x-api-key")
  const vercelCronSecret = request.headers.get("Authorization")

  const expectedKey = process.env.ARTICLE_GENERATION_KEY
  const expectedVercelCronSecret = process.env.CRON_SECRET

  const isManualAuth = expectedKey && apiKey === expectedKey
  const isVercelCronAuth = expectedVercelCronSecret && vercelCronSecret === `Bearer ${expectedVercelCronSecret}`

  if (!isManualAuth && !isVercelCronAuth) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  return null
}