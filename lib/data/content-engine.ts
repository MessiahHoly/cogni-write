import { prisma } from "./prisma";

export const fetchContentEngine = () => prisma.contentEngine.findFirst()