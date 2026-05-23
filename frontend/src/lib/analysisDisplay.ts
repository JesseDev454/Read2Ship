import type { Article, ReadingAnalysis, ReadingTheme, StackSignal } from "../types/read2ship";

interface OverviewAnalysis {
  themes: ReadingTheme[];
  stackSignals: StackSignal[];
  stackEvidence: Record<string, Article[]>;
  readingSummary: string;
  developerDirection: string;
  recommendation: string;
}

const THEME_PATTERNS: Record<string, RegExp[]> = {
  "AI Agents": [/\bai\b/, /\bagents?\b/, /\bllm\b/, /\bopenai\b/, /\bgpt\b/, /\bcopilot\b/],
  "Backend Tooling": [/\bbackend\b/, /\bnode(?:\.js|js)?\b/, /\bexpress\b/, /\bserver\b/, /\bapi\b/, /\bapis\b/, /\brest\b/, /\bgraphql\b/],
  "Developer Automation": [/\bautomation\b/, /\bworkflow\b/, /\bci\b/, /\bcd\b/, /\bdevops\b/, /\bproductivity\b/],
  Security: [/\bsecurity\b/, /\bauth\b/, /\boauth\b/, /\bauthentication\b/, /\bvalidation\b/, /\bhmac\b/],
  "Open Source": [/\bopen source\b/, /\bopen-source\b/, /\boss\b/, /\bgithub\b/, /\bcommunity\b/],
  "Frontend Engineering": [/\breact\b/, /\bnext\.?js\b/, /\bfrontend\b/, /\bui\b/, /\bcss\b/, /\btailwind\b/, /\bjavascript\b/, /\btypescript\b/],
  "Database Engineering": [/\bpostgres(?:ql)?\b/, /\bsql\b/, /\bdatabase\b/],
};

const TECH_PATTERNS: Record<string, RegExp[]> = {
  "OpenAI API": [/\bopenai\b/, /\bgpt\b/, /\bllm\b/],
  JavaScript: [/\bjavascript\b/, /\bjs\b/],
  TypeScript: [/\btypescript\b/, /\bts\b/],
  React: [/\breact\b/, /\bnext\.?js\b/],
  "Node.js": [/\bnode(?:\.js|js)?\b/],
  Express: [/\bexpress\b/],
  PostgreSQL: [/\bpostgres(?:ql)?\b/, /\bsql\b/],
  "VS Code": [/\bvs\s?code\b/, /\bvisual studio code\b/],
};

const TECH_ALIASES = new Map<string, string>([
  ["openai", "OpenAI API"],
  ["openai api", "OpenAI API"],
  ["gpt", "OpenAI API"],
  ["llm", "OpenAI API"],
  ["js", "JavaScript"],
  ["javascript", "JavaScript"],
  ["ts", "TypeScript"],
  ["typescript", "TypeScript"],
  ["react", "React"],
  ["nextjs", "React"],
  ["next.js", "React"],
  ["node", "Node.js"],
  ["nodejs", "Node.js"],
  ["node.js", "Node.js"],
  ["express", "Express"],
  ["postgres", "PostgreSQL"],
  ["postgresql", "PostgreSQL"],
  ["sql", "PostgreSQL"],
  ["vs code", "VS Code"],
  ["vscode", "VS Code"],
  ["visual studio code", "VS Code"],
]);

export function buildOverviewAnalysis(analysis: ReadingAnalysis): OverviewAnalysis {
  const themes = normalizeThemes(analysis);
  const stackSignals = normalizeStackSignals(analysis);

  return {
    themes,
    stackSignals,
    stackEvidence: buildStackEvidence(analysis.recentPosts),
    readingSummary: buildReadingSummary(themes),
    developerDirection: buildDeveloperDirection(themes, stackSignals),
    recommendation: buildRecommendation(themes, stackSignals),
  };
}

function normalizeThemes(analysis: ReadingAnalysis): ReadingTheme[] {
  const counts = new Map<string, number>();

  for (const post of analysis.recentPosts) {
    const foundInPost = new Set<string>();
    for (const tag of post.tags) {
      const theme = normalizeThemeName(tag);
      if (theme) foundInPost.add(theme);
    }

    const haystack = searchableText(post);
    for (const [theme, patterns] of Object.entries(THEME_PATTERNS)) {
      if (patterns.some((pattern) => pattern.test(haystack))) {
        foundInPost.add(theme);
      }
    }

    for (const theme of foundInPost) {
      increment(counts, theme);
    }
  }

  for (const theme of analysis.themes) {
    const normalized = normalizeThemeName(theme.name);
    if (!normalized) continue;
    if (!counts.has(normalized)) {
      counts.set(normalized, Math.max(1, Math.round(theme.score / 20)));
    }
  }

  const max = Math.max(...counts.values(), 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count], index) => ({
      name,
      score: scoreTheme(count, max, index),
      description: describeTheme(name, count, analysis.postsAnalyzed || analysis.recentPosts.length),
    }));
}

function normalizeStackSignals(analysis: ReadingAnalysis): StackSignal[] {
  const counts = new Map<string, number>();

  for (const post of analysis.recentPosts) {
    const foundInPost = new Set<string>();
    const haystack = searchableText(post);

    for (const [tech, patterns] of Object.entries(TECH_PATTERNS)) {
      if (patterns.some((pattern) => pattern.test(haystack))) {
        foundInPost.add(tech);
      }
    }

    for (const tech of foundInPost) {
      increment(counts, tech);
    }
  }

  for (const signal of analysis.stackSignals ?? []) {
    const normalized = normalizeTechName(signal.name);
    if (!normalized) continue;
    counts.set(normalized, Math.max(counts.get(normalized) ?? 0, signal.count || 1));
  }

  for (const item of analysis.stack) {
    const normalized = normalizeTechName(item);
    if (!normalized) continue;
    counts.set(normalized, Math.max(counts.get(normalized) ?? 0, 1));
  }

  const max = Math.max(...counts.values(), 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({
      name,
      count,
      confidence: Math.max(28, Math.round((count / max) * 100)),
      description: `Seen in ${count} ${count === 1 ? "post" : "posts"}`,
    }));
}

function buildStackEvidence(posts: Article[]): Record<string, Article[]> {
  const evidence: Record<string, Article[]> = {};

  for (const post of posts) {
    const haystack = searchableText(post);
    for (const [tech, patterns] of Object.entries(TECH_PATTERNS)) {
      if (patterns.some((pattern) => pattern.test(haystack))) {
        evidence[tech] = [...(evidence[tech] ?? []), post];
      }
    }
  }

  return evidence;
}

function normalizeThemeName(value: string): string | null {
  const clean = value.replace(/[-_]/g, " ").trim().toLowerCase();
  if (!clean) return null;
  if (/\b(ai|agent|agents|llm|openai|gpt|prompt|copilot)\b/.test(clean)) return "AI Agents";
  if (/\b(api|apis|graphql|rest|backend api|node|nodejs|node\.js|express|backend|server)\b/.test(clean)) return "Backend Tooling";
  if (/\b(automation|workflow|ci|cd|devops|productivity)\b/.test(clean)) return "Developer Automation";
  if (/\bsecurity|auth|authentication|oauth|validation|hmac\b/.test(clean)) return "Security";
  if (/\b(oss|open source|open-source|github|community)\b/.test(clean)) return "Open Source";
  if (/\b(react|frontend|ui|css|tailwind|styling|javascript|typescript)\b/.test(clean)) return "Frontend Engineering";
  if (/\bpostgres|postgresql|database|sql\b/.test(clean)) return "Database Engineering";
  return null;
}

function normalizeTechName(value: string): string | null {
  const clean = value.replace(/[-_]/g, " ").trim().toLowerCase();
  return TECH_ALIASES.get(clean) ?? null;
}

function searchableText(post: Article): string {
  return `${post.title} ${post.source} ${post.tags.join(" ")}`.toLowerCase();
}

function scoreTheme(count: number, max: number, index: number): number {
  const score = Math.round(36 + (count / max) * 56 - index * 3);
  return Math.max(28, Math.min(92, score));
}

function describeTheme(name: string, count: number, totalPosts: number): string {
  const posts = `${count} ${count === 1 ? "post" : "posts"}`;
  if (count >= Math.max(5, Math.ceil(totalPosts * 0.25))) {
    return `High signal from ${posts}`;
  }

  const descriptions: Record<string, string> = {
    "AI Agents": `AI and agent topics appeared in ${posts}`,
    "Backend Tooling": "Frequently appears with APIs, Node.js, and automation",
    "Developer Automation": "Connected to workflows and productivity tools",
    Security: "Seen in validation, auth, or code safety topics",
    "Open Source": "Appears in tooling and community-related posts",
    "Frontend Engineering": "Connected to UI, React, and frontend topics",
    "Database Engineering": "Seen in data modeling and database topics",
  };

  return descriptions[name] ?? `Detected across ${posts}`;
}

function buildReadingSummary(themes: ReadingTheme[]): string {
  const topThemes = themes.slice(0, 3).map((theme) => theme.name).join(", ");
  return `Your reading shows strong interest in ${topThemes || "developer tooling"}, with enough signal to generate an actionable project plan.`;
}

function buildDeveloperDirection(themes: ReadingTheme[], stackSignals: StackSignal[]): string {
  const topThemes = themes.slice(0, 3).map((theme) => theme.name).join(", ");
  const topStack = stackSignals.slice(0, 3).map((signal) => signal.name).join(", ");

  if (topStack) {
    return `You appear to be exploring ${topThemes || "developer tooling"} through practical tools like ${topStack}. A strong next project should combine these patterns into a focused developer productivity workflow.`;
  }

  return `You appear to be exploring ${topThemes || "developer tooling"}. A strong next project should turn those reading patterns into a practical developer workflow.`;
}

function buildRecommendation(themes: ReadingTheme[], stackSignals: StackSignal[]): string {
  const strongestTheme = themes[0]?.name ?? "your strongest reading theme";
  const strongestTech = stackSignals[0]?.name ?? "a practical implementation stack";
  return `Build next: combine ${strongestTheme} with ${strongestTech} in a small, shippable developer tool.`;
}

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}
