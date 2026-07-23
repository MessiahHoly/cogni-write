import { generateId } from "better-auth"
import { prisma } from "./prisma"

export const fetchOrCreateCogni = async () => {
  const email = process.env.COGNI_EMAIL

  if (!email) return { error: "Email not specified." }

  const cogni = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Cogni',
      emailVerified: true,
      id: generateId()
    },
  })

  return { data: cogni }
}