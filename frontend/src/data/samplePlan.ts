import type { ReadingAnalysis } from "../types/read2ship";

export const sampleAnalysis: ReadingAnalysis = {
  profile: {
    name: "Jesse",
    username: "jessedev454",
    readingSummary:
      "Your reading shows strong interest in AI Agents, Backend Tooling, and Developer Automation, with enough signal to generate an actionable project plan.",
  },
  postsAnalyzed: 42,
  themes: [
    { name: "AI Agents", score: 92, description: "High signal from 6 posts" },
    {
      name: "Backend Tooling",
      score: 68,
      description: "Frequently appears with APIs, Node.js, and automation",
    },
    {
      name: "Developer Automation",
      score: 54,
      description: "Connected to AI workflows and productivity tools",
    },
    { name: "Security", score: 41, description: "Seen in API validation and code review topics" },
    { name: "Open Source", score: 36, description: "Appears in tooling and community-related posts" },
  ],
  stack: ["OpenAI API", "JavaScript", "React", "Node.js", "PostgreSQL", "VS Code"],
  stackSignals: [
    { name: "OpenAI API", count: 6, confidence: 100, description: "Seen in 6 posts" },
    { name: "JavaScript", count: 5, confidence: 83, description: "Seen in 5 posts" },
    { name: "React", count: 2, confidence: 33, description: "Seen in 2 posts" },
    { name: "Node.js", count: 1, confidence: 28, description: "Seen in 1 post" },
    { name: "PostgreSQL", count: 1, confidence: 28, description: "Seen in 1 post" },
    { name: "VS Code", count: 1, confidence: 28, description: "Seen in 1 post" },
  ],
  recentPosts: [
    {
      id: "art-1",
      title: "Building AI Agents with TypeScript",
      source: "daily.dev",
      tags: ["AI Agents", "TypeScript"],
      readAt: "2 hours ago",
    },
    {
      id: "art-2",
      title: "How to Design Better Backend APIs",
      source: "API Weekly",
      tags: ["Backend", "API Design"],
      readAt: "1 day ago",
    },
    {
      id: "art-3",
      title: "PostgreSQL Performance Tips for Developers",
      source: "daily.dev",
      tags: ["PostgreSQL", "Database"],
      readAt: "2 days ago",
    },
    {
      id: "art-4",
      title: "Automating Developer Workflows with AI",
      source: "DevTools Digest",
      tags: ["Automation", "AI"],
      readAt: "3 days ago",
    },
    {
      id: "art-5",
      title: "Designing Reliable API Systems",
      source: "daily.dev",
      tags: ["Reliability", "Backend"],
      readAt: "4 days ago",
    },
  ],
  developerDirection:
    "You appear to be exploring AI-powered developer tools, backend automation, and API-driven workflows through OpenAI API, JavaScript, and React.",
  recommendation:
    "Build next: combine AI Agents with OpenAI API in a small, shippable developer productivity tool.",
  plan: {
    id: "sample-plan",
    slug: "sample-ai-code-review-assistant",
    profile: {
      name: "Jesse",
      username: "jessedev454",
      readingSummary:
        "Jesse is reading heavily about AI agents, backend APIs, TypeScript, and developer automation.",
    },
    projectTitle: "AI-Powered Code Review Assistant",
    summary:
      "Based on your daily.dev reading activity, this project helps you apply AI agents, backend tooling, and TypeScript automation in a practical way.",
    currentDirection: "AI Agents + Backend Tooling",
    difficulty: "Intermediate",
    estimatedTime: "2-3 days",
    track: "Content to Action",
    stack: ["TypeScript", "Node.js", "Express", "PostgreSQL", "OpenAI API"],
    tasks: [
      {
        id: "task-1",
        title: "Create a webhook endpoint",
        description:
          "Build an API endpoint that receives repository or code review events and normalizes the payload.",
        deliverable: "POST /webhooks/code-review with signed payload validation",
        effort: "3-4 hrs",
      },
      {
        id: "task-2",
        title: "Analyze code changes with AI",
        description:
          "Send code diffs or summaries to an AI model and classify potential bugs, readability issues, and architectural risks.",
        deliverable: "Structured JSON review findings from the AI model",
        effort: "4-6 hrs",
      },
      {
        id: "task-3",
        title: "Generate a review summary",
        description:
          "Return actionable review comments, warnings, and improvement suggestions in a developer-friendly summary.",
        deliverable: "Review summary endpoint and shareable report view",
        effort: "3-5 hrs",
      },
    ],
    bonusFeature:
      "Generate a shareable review report for each analyzed pull request.",
    inspiredBy: [
      {
        id: "inspired-1",
        title: "Building AI Agents with TypeScript",
        source: "daily.dev",
        tags: ["AI Agents", "TypeScript"],
      },
      {
        id: "inspired-2",
        title: "How to Design Better Backend APIs",
        source: "API Weekly",
        tags: ["API Design", "Backend"],
      },
      {
        id: "inspired-3",
        title: "PostgreSQL Performance Tips for Developers",
        source: "daily.dev",
        tags: ["PostgreSQL"],
      },
    ],
    createdAt: new Date().toISOString(),
    persistenceStatus: "not_stored",
    generationSource: "sample",
    statusMessage: "Sample demo plan.",
  },
  planStatus: "sample",
  planStatusMessage: "Sample demo plan.",
};
