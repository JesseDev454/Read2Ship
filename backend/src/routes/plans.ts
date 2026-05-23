import { Router } from "express";
import { AppError } from "../lib/errors.js";
import { generateBuildPlan } from "../services/openaiPlan.js";
import { findPlanBySlug, storePlan } from "../services/plans.js";
import type { Difficulty, ReadingAnalysis } from "../types.js";

export const plansRouter = Router();

plansRouter.post("/generate", async (request, response, next) => {
  try {
    const analysis = request.body?.analysis as ReadingAnalysis | undefined;
    const requestedDifficulty = parseDifficulty(request.body?.difficulty);
    if (!analysis?.profile || !Array.isArray(analysis.recentPosts)) {
      throw new AppError(400, "INVALID_ANALYSIS", "A valid reading analysis is required.");
    }

    let generatedPlan;
    try {
      generatedPlan = {
        ...(await generateBuildPlan(analysis, requestedDifficulty)),
        generationSource: "ai" as const,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        502,
        "AI_GENERATION_FAILED",
        error instanceof Error
          ? `AI plan generation failed: ${error.message}`
          : "AI plan generation failed."
      );
    }

    try {
      const storedPlan = await storePlan(generatedPlan);
      response.status(201).json({
        ...storedPlan,
        persistenceStatus: "stored",
        generationSource: "ai",
        statusMessage: "Generated with AI and saved for public sharing.",
      });
    } catch (error) {
      console.error("Plan persistence failed after AI generation.", error);
      response.status(200).json({
        ...generatedPlan,
        persistenceStatus: "not_stored",
        generationSource: "ai",
        statusMessage:
          "Generated with AI, but the database could not save it. This plan is available locally in this browser session only.",
      });
    }
  } catch (error) {
    next(error);
  }
});

function parseDifficulty(value: unknown): Difficulty | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (value === "Beginner" || value === "Intermediate" || value === "Advanced") {
    return value;
  }

  throw new AppError(
    400,
    "INVALID_DIFFICULTY",
    "Difficulty must be Beginner, Intermediate, or Advanced.",
  );
}

plansRouter.get("/:slug", async (request, response, next) => {
  try {
    const plan = await findPlanBySlug(request.params.slug);
    if (!plan) {
      throw new AppError(404, "PLAN_NOT_FOUND", "No public plan exists for this slug.");
    }
    response.json(plan);
  } catch (error) {
    next(error);
  }
});
