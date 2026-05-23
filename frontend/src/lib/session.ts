import { sampleAnalysis } from "../data/samplePlan";
import type { ReadingAnalysis } from "../types/read2ship";

const SESSION_KEY = "read2ship-analysis";

export function readSessionAnalysis(): ReadingAnalysis | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as ReadingAnalysis;
    if (isLegacyImplicitSample(parsed)) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function writeSessionAnalysis(analysis: ReadingAnalysis): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(analysis));
}

export function writeSampleSession(): void {
  writeSessionAnalysis({
    ...sampleAnalysis,
    plan: {
      ...sampleAnalysis.plan,
      generationSource: "sample",
      persistenceStatus: "not_stored",
      statusMessage: "Sample demo plan.",
    },
    planStatus: "sample",
    planStatusMessage: "Sample demo plan.",
  });
}

export function getSessionPlanSlug(): string | null {
  return readSessionAnalysis()?.plan?.slug ?? null;
}

function isLegacyImplicitSample(analysis: ReadingAnalysis): boolean {
  return (
    analysis.plan?.slug === sampleAnalysis.plan.slug &&
    analysis.planStatus !== "sample" &&
    analysis.plan?.generationSource !== "sample"
  );
}
