-- CreateTable
CREATE TABLE "ContentEngineArchive" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "contentEngineId" TEXT NOT NULL,

    CONSTRAINT "ContentEngineArchive_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContentEngineArchive" ADD CONSTRAINT "ContentEngineArchive_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentEngineArchive" ADD CONSTRAINT "ContentEngineArchive_contentEngineId_fkey" FOREIGN KEY ("contentEngineId") REFERENCES "ContentEngine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
