-- CreateTable
CREATE TABLE "GeneratedPlan" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "profile" JSONB NOT NULL,
    "projectTitle" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "currentDirection" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "estimatedTime" TEXT NOT NULL,
    "track" TEXT NOT NULL,
    "stack" JSONB NOT NULL,
    "tasks" JSONB NOT NULL,
    "bonusFeature" TEXT,
    "inspiredBy" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedPlan_slug_key" ON "GeneratedPlan"("slug");
