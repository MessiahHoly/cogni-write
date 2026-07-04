'use server'

import { revalidatePath } from "next/cache";
import { getSession, isAdmin } from "../auth/server";
import {
  validateAndResolveContentEngine
} from "../data/content-engine";
import { prisma } from "../data/prisma";
// import { CreateContentEngineSchema } from "../schemas/content-engine";

export const createContentEngine = async (initialState: unknown, formData: FormData) => {
  const [session] = await Promise.all([getSession()])

  if (!session?.user.id || !isAdmin(session?.user.email || "")) {
    return { success: false, error: "Unauthorized" }
  }

  //TODO: check if I should separate validateAndResolveContentEngine
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

export const updateContentEngine = async (id: string, initialState: unknown, formData: FormData) => {
  const [session] = await Promise.all([getSession()])

  if (!session?.user.id || !isAdmin(session?.user.email || "")) {
    return { success: false, error: "Unauthorized" }
  }

  // if (!id) {
  //   return { success: false, error: "Missing content engine ID" }
  // }

  const { data, error } = await validateAndResolveContentEngine({ topic: formData.get("topic") })

  if (error || !data) {
    return { success: false, error }
  }

  try {
    const current = await prisma.contentEngine.findUnique({ where: { id } })
    if (!current) {
      return { success: false, error: "Content engine not found" }
    }
    if (current.topic === data.topic) {
      return { success: false, error: "The topic has not changed" }
    }
    await prisma.contentEngineArchive.create({
      data: { contentEngineId: current.id, topic: current.topic, createdById: current.createdById,slug: current.slug }
    })
    await prisma.contentEngine.update({ where: { id }, data })
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Failed to update content engine" }
  }
}