'use server'

import { z } from "zod"
import { getSession } from "../auth/server"
import { UpdateNameSchema } from "../schemas/user"
import { prisma } from "../data/prisma"
import { revalidatePath } from "next/cache"

export const updateUserName = async (currentPath: string, initialState: unknown, formData: FormData) => {
  const session = await getSession()
  if (!session?.user.id) return { error: "Unauthorized" }

  const result = UpdateNameSchema.safeParse({
    name: formData.get("name"),
    // currentPath: formData.get("currentPath")
  })

  if (!result.success) return { error: z.prettifyError(result.error) }

  const { data } = result

  try {
    await prisma.user.update({ where: { id: session.user.id }, data })
    revalidatePath(currentPath)
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to save name. Please try again." }
  }
}