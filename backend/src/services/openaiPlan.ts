import OpenAI from "openai";
import { AppError } from "../lib/errors.js";
import type { BuildPlan, Difficulty, ReadingAnalysis } from "../types.js";

type AiProvider = "openai" | "gemini";

const planSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "slug",
    "projectTitle",
    "summary",
    "currentDirection",
    "difficulty",
    "estimatedTime",
    "track",
    "stack",
    "tasks",
    "bonusFeature",
  ],
  properties: {
    slug: { type: "string" },
    projectTitle: { type: "string" },
    summary: { type: "string" },
    currentDirection: {
      type: "string",
      maxLength: 56,
      description:
        "A compact label, not a sentence. Use 2-4 short concepts separated by +, for example: AI Agents + Web Security + React/Node.js.",
    },
    difficulty: { type: "string", enum: ["Beginner", "Intermediate", "Advanced"] },
    estimatedTime: { type: "string" },
    track: { type: "string" },
    stack: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 8 },
    tasks: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "title", "description", "deliverable", "effort"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          deliverable: { type: "string" },
          effort: { type: "string" },
        },
      },
    },
    bonusFeature: { type: "string" },
  },
};

export async function generateBuildPlan(
  analysis: ReadingAnalysis,
  requestedDifficulty?: Difficulty,
): Promise<BuildPlan> {
  const config = getAiConfig();

  if (!config.apiKey) {
    throw new AppError(
      500,
      "AI_NOT_CONFIGURED",
      `${config.keyName} is not configured. Set AI_PROVIDER=${config.provider} and add your API key.`,
    );
  }

  const openai = new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
  });

  const messages = [
    {
      role: "system" as const,
      content:
        "You generate practical developer mini-project plans from daily.dev reading analysis. Create a specific build idea the user could actually ship. Do not use generic titles like 'Build Planner', 'Implementation Sprint', or 'Developer Tool'. Base the plan on the user's profile, themes, stack signals, and article titles. If requestedDifficulty is provided, the returned difficulty must exactly match it and the scope, tasks, and estimatedTime should fit that difficulty. Do not include the user's full name in public-facing plan copy such as summary or currentDirection; refer to the user as 'you' or use neutral project-focused copy. currentDirection must be a compact label, not a sentence: use 2-4 short concepts separated by +, like 'AI Agents + Web Security + React/Node.js'. Return concise, implementation-ready JSON only.",
    },
    {
      role: "user" as const,
      content: JSON.stringify({
        profile: analysis.profile,
        themes: analysis.themes,
        stack: analysis.stack,
        stackSignals: analysis.stackSignals,
        recentPosts: analysis.recentPosts,
        developerDirection: analysis.developerDirection,
        recommendation: analysis.recommendation,
        requestedDifficulty,
      }),
    },
  ];

  const response = await openai.chat.completions.create({
    model: config.model,
    messages,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "read2ship_build_plan",
        strict: true,
        schema: planSchema,
      },
    },
  });

  const output = response.choices[0]?.message?.content;
  if (!output) {
    throw new AppError(502, "AI_EMPTY_RESPONSE", "The AI model returned an empty plan.");
  }

  const parsed = JSON.parse(output) as Omit<BuildPlan, "profile" | "inspiredBy" | "createdAt">;

  return {
    ...parsed,
    slug: slugify(parsed.slug || parsed.projectTitle),
    currentDirection: compactDirection(parsed.currentDirection),
    difficulty: requestedDifficulty ?? parsed.difficulty,
    profile: analysis.profile,
    inspiredBy: analysis.recentPosts.slice(0, 5),
    createdAt: new Date().toISOString(),
  };
}

function compactDirection(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length <= 56 && !/[.!?]/.test(trimmed)) {
    return trimmed;
  }

  return trimmed
    .split(/[.!?]/)[0]
    .replace(/\b(you are|you appear to be|you seem to be|combining|using|building)\b/gi, "")
    .replace(/\bwith\b/gi, "+")
    .replace(/\band\b/gi, "+")
    .replace(/\s+/g, " ")
    .replace(/\s*\+\s*/g, " + ")
    .trim()
    .slice(0, 56)
    .replace(/\s+\+?$/, "");
}

function getAiConfig(): {
  provider: AiProvider;
  apiKey?: string;
  keyName: string;
  model: string;
  baseURL?: string;
} {
  const provider = normalizeProvider(process.env.AI_PROVIDER);

  if (provider === "gemini") {
    return {
      provider,
      apiKey: process.env.AI_API_KEY || process.env.GEMINI_API_KEY,
      keyName: "AI_API_KEY or GEMINI_API_KEY",
      model: process.env.AI_MODEL || "gemini-3.5-flash",
      baseURL:
        process.env.AI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta/openai/",
    };
  }

  return {
    provider,
    apiKey: process.env.AI_API_KEY || process.env.OPENAI_API_KEY,
    keyName: "AI_API_KEY or OPENAI_API_KEY",
    model: process.env.AI_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini",
    baseURL: process.env.AI_BASE_URL,
  };
}

function normalizeProvider(value: string | undefined): AiProvider {
  if (!value) {
    return process.env.GEMINI_API_KEY ? "gemini" : "openai";
  }

  const provider = value.toLowerCase();
  if (provider === "gemini" || provider === "openai") {
    return provider;
  }

  throw new AppError(
    500,
    "AI_PROVIDER_UNSUPPORTED",
    `Unsupported AI_PROVIDER "${value}". Use "gemini" or "openai".`,
  );
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return slug || `plan-${Date.now()}`;
}
