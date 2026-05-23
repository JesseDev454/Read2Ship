import type { GeneratedPlan } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type { BuildPlan } from "../types.js";

export async function storePlan(plan: BuildPlan): Promise<BuildPlan> {
  const uniqueSlug = await ensureUniqueSlug(plan.slug);

  const record = await prisma.generatedPlan.create({
    data: {
      slug: uniqueSlug,
      profile: plan.profile as unknown as Prisma.InputJsonValue,
      projectTitle: plan.projectTitle,
      summary: plan.summary,
      currentDirection: plan.currentDirection,
      difficulty: plan.difficulty,
      estimatedTime: plan.estimatedTime,
      track: plan.track,
      stack: plan.stack as unknown as Prisma.InputJsonValue,
      tasks: plan.tasks as unknown as Prisma.InputJsonValue,
      bonusFeature: plan.bonusFeature,
      inspiredBy: plan.inspiredBy as unknown as Prisma.InputJsonValue,
    },
  });

  return recordToPlan(record);
}

export async function findPlanBySlug(slug: string): Promise<BuildPlan | null> {
  const record = await prisma.generatedPlan.findUnique({ where: { slug } });
  return record ? recordToPlan(record) : null;
}

function recordToPlan(record: GeneratedPlan): BuildPlan {
  return {
    id: record.id,
    slug: record.slug,
    profile: record.profile as unknown as BuildPlan["profile"],
    projectTitle: record.projectTitle,
    summary: record.summary,
    currentDirection: record.currentDirection,
    difficulty: record.difficulty as BuildPlan["difficulty"],
    estimatedTime: record.estimatedTime,
    track: record.track,
    stack: record.stack as unknown as string[],
    tasks: record.tasks as unknown as BuildPlan["tasks"],
    bonusFeature: record.bonusFeature ?? undefined,
    inspiredBy: record.inspiredBy as unknown as BuildPlan["inspiredBy"],
    createdAt: record.createdAt.toISOString(),
    persistenceStatus: "stored",
    generationSource: "ai",
    statusMessage: "Saved public Read2Ship plan.",
  };
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let suffix = 2;

  while (await prisma.generatedPlan.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}
