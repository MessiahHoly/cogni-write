'use server'

import { z } from "zod"
import { getSession } from "../auth/server"
import { UpdateNameSchema } from "../schemas/user"
import { prisma } from "../data/prisma"

export const updateUserName = async (initialState: unknown, formData: FormData) => {
  const session = await getSession()
  if (!session?.user.id) return { error: "Unauthorized" }

  const result = UpdateNameSchema.safeParse({
    name: formData.get("name"),
    currentPath: formData.get("currentPath")
  })

  if (!result.success) return { error: z.prettifyError(result.error) }

  const { data } = result

  try {
    await prisma.user.update({ where: { id: session.user.id }, data })
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to save name. Please try again." }
  }
}