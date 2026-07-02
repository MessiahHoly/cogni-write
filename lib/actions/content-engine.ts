'use server'

import { revalidatePath } from "next/cache";
import { getSession, isAdmin } from "../auth/server";
import {
  // fetchContentEngine,
  validateAndResolveContentEngine
} from "../data/content-engine";
import { prisma } from "../data/prisma";
import { CreateContentEngineSchema } from "../schemas/content-engine";
// import { z } from "zod";

// export const createOrUpdateContentEngine = async (initialState: unknown, formData: FormData) => {
//   const [session, contentEngine] = await Promise.all([getSession(), fetchContentEngine()])

//   if (!session?.user.id || !isAdmin(session?.user.email || "")) {
//     return { success: false, error: "Unauthorized" }
//   }

//   const validatedFields = CreateContentEngineSchema.safeParse({
//     topic: formData.get("topic"),
//   })

//   if (!validatedFields.success) {
//     return { success: false, error: validatedFields.error }
//   }

//   const { data } = validatedFields

//   if (data.topic === contentEngine?.topic) return { success: false, error: "The topic has not changed" }

//   try {
//     if (contentEngine) {
//       const { createdById, topic, id } = contentEngine
//       await prisma.contentEngineArchive.create({ data: { topic, createdById, contentEngineId: id } })
//       await prisma.contentEngine.update({ data, where: { id } })
//       return { success: true }
//     }
//     await prisma.contentEngine.create({ data: { topic: validatedFields.data.topic, createdById: session.user.id } })
//     revalidatePath('/admin')
//     return { success: true }
//   } catch (error) {
//     console.error(error)
//     return { success: false, error: "Failed to create/update content engine" }
//   }
// };

export const createContentEngine = async (initialState: unknown, formData: FormData) => {
  const [session] = await Promise.all([getSession()])

  if (!session?.user.id || !isAdmin(session?.user.email || "")) {
    return { success: false, error: "Unauthorized" }
  }

  const { data, error } = await validateAndResolveContentEngine({ topic: formData.get("topic") })

  if (error || !data) {
    return { success: false, error }
  }

  try {
    await prisma.contentEngine.create({ data: { ...data, createdById: session.user.id } })
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to create content engine" }
  }
}