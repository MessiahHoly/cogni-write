import { prisma } from "./prisma";

export const fetchContentEngine = () => prisma.contentEngine.findFirst()

export const fetchContentEngines = () => prisma.contentEngine.findMany({ include: { articles: { orderBy: { updatedAt: 'desc' } } } })