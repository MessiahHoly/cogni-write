import { generateId } from "better-auth"
import { prisma } from "./prisma"

export const fetchOrCreateCogni = async () => {
  // const id = generateId()
  const cogni = await prisma.user.upsert({
    where: { email: 'do-not-reply@messiahholy.com' },
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

  return cogni
}