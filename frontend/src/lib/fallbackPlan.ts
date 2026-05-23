import type { BuildPlan, ReadingAnalysis } from "../types/read2ship";

export function createFallbackPlan(analysis: ReadingAnalysis): BuildPlan {
  const primaryTheme = analysis.themes[0]?.name ?? "Developer Tooling";
  const secondaryTheme = analysis.themes[1]?.name ?? "Automation";
  const projectTitle = suggestFallbackProjectTitle(primaryTheme, secondaryTheme);

  return {
    slug: slugify(projectTitle),
    profile: analysis.profile,
    projectTitle,
    summary: `A practical local fallback project based on your daily.dev reading themes. Configure OpenAI and the database to generate a fully AI-authored plan.`,
    currentDirection: `${primaryTheme} + ${secondaryTheme}`,
    difficulty: "Intermediate",
    estimatedTime: "2-3 days",
    track: "Content to Action",
    stack: analysis.stack.length ? analysis.stack : ["TypeScript", "Node.js", "APIs"],
    tasks: [
      {
        id: "task-1",
        title: "Map the core workflow",
        description: `Turn the strongest reading theme, ${primaryTheme}, into one clear user workflow.`,
        deliverable: "A one-page workflow outline",
        effort: "1-2 hrs",
      },
      {
        id: "task-2",
        title: "Build the first API slice",
        description: "Create the backend route and typed response shape for the main project action.",
        deliverable: "Working endpoint with sample data",
        effort: "3-4 hrs",
      },
      {
        id: "task-3",
        title: "Ship a shareable result",
        description: "Create a polished result view that explains what the tool generated and why.",
        deliverable: "Responsive result page",
        effort: "3-5 hrs",
      },
    ],
    bonusFeature: "Add a public share page for the generated result.",
    inspiredBy: analysis.recentPosts.slice(0, 5),
    createdAt: new Date().toISOString(),
  };
}

function suggestFallbackProjectTitle(primaryTheme: string, secondaryTheme: string): string {
  const combo = `${primaryTheme} ${secondaryTheme}`.toLowerCase();

  if (combo.includes("ai") && combo.includes("backend")) {
    return "AI Workflow API Assistant";
  }

  if (combo.includes("ai") && combo.includes("security")) {
    return "AI Security Review Console";
  }

  if (combo.includes("postgres") || combo.includes("database")) {
    return "Database Performance Insight Tool";
  }

  if (combo.includes("react") || combo.includes("css")) {
    return "Frontend Pattern Explorer";
  }

  if (combo.includes("automation")) {
    return "Developer Automation Command Center";
  }

  return `${primaryTheme} Implementation Sprint`;
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 72) || `local-plan-${Date.now()}`
  );
}
