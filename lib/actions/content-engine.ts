'use server'

import { getSession, isAdmin } from "../auth/server";
import { prisma } from "../data/prisma";
import { CreateContentEngineSchema } from "../schemas/content-engine";

export const createContentEngine = async (initialState: unknown, formData: FormData) => {
  const session = await getSession()

  if (!session?.user.id || !isAdmin(session?.user.email || "")) {
    return { success: false, error: "Unauthorized" }
  }

  // if (!session?.user.id) return { sucess: false, error: "Unauthorized" }

  const validatedFields = CreateContentEngineSchema.safeParse({
    topic: formData.get("topic"),
  })

  if (!validatedFields.success) {
    return { success: false, error: validatedFields.error }
  }

  // Your logic to create content engine with initialState and formData
  try {
    await prisma.contentEngine.create({
      data: {
        topic: validatedFields.data.topic,
        createdById: session.user.id
      },
    })

    return { sucess: true }
  } catch (error) {
    return { success: false, error: "Failed to create content engine" }
  }
};