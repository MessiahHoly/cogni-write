import { generateId } from "better-auth"
import { prisma } from "./prisma"

export const fetchOrCreateCogni = async () => {
  // const id = generateId()
  const email = process.env.COGNI_EMAIL

  if (!email) return { error: "Email not speficied." }
  const cogni = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email: 'do-not-reply@messiahholy.com',
      name: 'Cogni',
      emailVerified: true,
      id: generateId()
    },
    select: {
      name: true,
      id: true,
      comments: {
        orderBy: { updatedAt: 'desc' },
        take: 1
      }
    },
  })

  return { data: cogni }
}