'use server'

import { getSession, isAdmin } from "../auth/server";
import { fetchContentEngine } from "../data/content-engine";
import { prisma } from "../data/prisma";
import { CreateContentEngineSchema } from "../schemas/content-engine";

export const createContentEngine = async (initialState: unknown, formData: FormData) => {
  const [session, contentEngine] = await Promise.all([getSession(), fetchContentEngine()])
  // const session = await getSession()

  if (!session?.user.id || !isAdmin(session?.user.email || "")) {
    return { success: false, error: "Unauthorized" }
  }

  const validatedFields = CreateContentEngineSchema.safeParse({
    topic: formData.get("topic"),
  })

  if (!validatedFields.success) {
    return { success: false, error: validatedFields.error }
  }

  if (validatedFields.data.topic === contentEngine?.topic) return { success: true }

  try {
    if (contentEngine) {

    }
    await prisma.contentEngine.create({
      data: {
        topic: validatedFields.data.topic,
        createdById: session.user.id
      },
    })

    return { sucess: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to create content engine" }
  }
};