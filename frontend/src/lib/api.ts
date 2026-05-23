import { sampleAnalysis } from "../data/samplePlan";
import type { BuildPlan, Difficulty, ReadingAnalysis } from "../types/read2ship";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export class ApiRequestError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new ApiRequestError(
      payload?.message ?? `Request failed: ${response.status}`,
      response.status,
      payload?.code
    );
  }

  return response.json() as Promise<T>;
}

export async function analyzeDailyDevToken(token: string): Promise<ReadingAnalysis> {
  if (!token.trim()) {
    throw new Error("Paste your daily.dev API token first.");
  }

  return request<ReadingAnalysis>("/api/dailydev/analyze", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function generatePlan(
  analysis: ReadingAnalysis,
  options: { difficulty?: Difficulty } = {}
): Promise<BuildPlan> {
  return request<BuildPlan>("/api/plans/generate", {
    method: "POST",
    body: JSON.stringify({ analysis, difficulty: options.difficulty }),
  });
}

export async function fetchPublicPlan(slug: string): Promise<BuildPlan> {
  if (slug === sampleAnalysis.plan.slug) {
    return sampleAnalysis.plan;
  }

  return request<BuildPlan>(`/api/plans/${slug}`);
}
