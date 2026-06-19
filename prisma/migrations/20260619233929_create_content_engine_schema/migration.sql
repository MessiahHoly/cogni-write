-- CreateTable
CREATE TABLE "ContentEngine" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "ContentEngine_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContentEngine" ADD CONSTRAINT "ContentEngine_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
