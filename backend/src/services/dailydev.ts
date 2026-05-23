import { AppError } from "../lib/errors.js";
import type { Article, DeveloperProfile, ReadingAnalysis, ReadingTheme, StackSignal } from "../types.js";

const DAILY_DEV_BASE_URL = "https://api.daily.dev/public/v1";

interface DailyDevPreview {
  profile: DeveloperProfile;
  posts: Article[];
}

export async function fetchDailyDevPreview(token: string): Promise<DailyDevPreview> {
  assertToken(token);

  const [profile, feed, bookmarks] = await Promise.all([
    dailyDevRequest<Record<string, unknown>>(token, "/profile/").catch(() => ({})),
    dailyDevRequest<PaginatedResponse>(token, "/feeds/foryou?limit=50"),
    dailyDevRequest<PaginatedResponse>(token, "/bookmarks/?limit=50").catch(() => ({ data: [] })),
  ]);

  const articles = [...normalizePosts(feed), ...normalizePosts(bookmarks)];
  const uniqueArticles = dedupeArticles(articles).slice(0, 50);

  return {
    profile: normalizeProfile(profile, uniqueArticles),
    posts: uniqueArticles,
  };
}

export async function analyzeDailyDev(token: string): Promise<ReadingAnalysis> {
  const preview = await fetchDailyDevPreview(token);

  if (preview.posts.length < 5) {
    throw new AppError(
      422,
      "NOT_ENOUGH_CONTENT",
      "Not enough daily.dev content to generate a reliable build plan."
    );
  }

  const themes = deriveThemes(preview.posts);
  const stackSignals = deriveStackSignals(preview.posts);
  const stack = stackSignals.map((signal) => signal.name);

  return {
    profile: {
      ...preview.profile,
      readingSummary: buildReadingSummary(themes),
    },
    postsAnalyzed: preview.posts.length,
    themes,
    stack,
    stackSignals,
    recentPosts: preview.posts.slice(0, 20),
    developerDirection: buildDeveloperDirection(themes, stackSignals),
    recommendation: buildRecommendation(themes, stackSignals),
  };
}

async function dailyDevRequest<T>(token: string, path: string): Promise<T> {
  const response = await fetch(`${DAILY_DEV_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (response.status === 401) {
    const message = await readErrorMessage(response);
    throw new AppError(401, "INVALID_TOKEN", message ?? "Invalid daily.dev API token.");
  }

  if (response.status === 403) {
    const message = await readErrorMessage(response);
    throw new AppError(
      403,
      "DAILY_DEV_ACCESS_DENIED",
      message ?? "daily.dev Public API access requires a Plus account or API access permission."
    );
  }

  if (response.status === 429) {
    throw new AppError(429, "RATE_LIMITED", "daily.dev rate limit reached. Try again shortly.");
  }

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new AppError(
      response.status,
      "DAILY_DEV_ERROR",
      message ?? `daily.dev API request failed with status ${response.status}.`
    );
  }

  return response.json() as Promise<T>;
}

async function readErrorMessage(response: Response): Promise<string | undefined> {
  const payload = (await response.json().catch(() => null)) as
    | { error?: string; message?: string }
    | null;
  return payload?.message ?? payload?.error;
}

function assertToken(token: string) {
  if (!token?.trim()) {
    throw new AppError(400, "MISSING_TOKEN", "daily.dev API token is required.");
  }
}

interface PaginatedResponse {
  data?: unknown[];
  items?: unknown[];
  edges?: Array<{ node?: unknown }>;
}

function normalizePosts(payload: PaginatedResponse): Article[] {
  const items = payload.data ?? payload.items ?? payload.edges?.map((edge) => edge.node) ?? [];

  return items
    .map((item, index) => normalizePost(item, index))
    .filter((article): article is Article => Boolean(article));
}

function normalizePost(item: unknown, index: number): Article | null {
  if (!item || typeof item !== "object") return null;
  const record = item as Record<string, unknown>;
  const post =
    record.post && typeof record.post === "object"
      ? ({ ...record.post, ...record } as Record<string, unknown>)
      : record;

  const title = stringField(post.title) ?? stringField(post.name);
  if (!title) return null;

  const sourceRecord = objectField(post.source);
  const source =
    stringField(sourceRecord?.name) ??
    stringField(sourceRecord?.handle) ??
    stringField(post.sourceName) ??
    "daily.dev";

  const tags = normalizeTags(post.tags ?? post.keywords ?? post.topics);

  return {
    id: stringField(post.id) ?? stringField(post.postId) ?? `dailydev-${index}`,
    title,
    source,
    url: stringField(post.url) ?? stringField(post.permalink),
    tags,
    readAt: stringField(post.readAt) ?? stringField(post.createdAt),
    savedAt: stringField(post.savedAt) ?? stringField(post.bookmarkedAt),
  };
}

function normalizeProfile(profile: Record<string, unknown>, posts: Article[]): DeveloperProfile {
  const name = stringField(profile.name) ?? stringField(profile.username) ?? "daily.dev reader";
  const username = stringField(profile.username) ?? stringField(profile.handle) ?? "dailydev";

  return {
    name,
    username,
    avatarUrl:
      stringField(profile.image) ??
      stringField(profile.avatar) ??
      stringField(profile.avatarUrl) ??
      stringField(profile.profileImage) ??
      stringField(profile.profilePicture) ??
      stringField(profile.picture),
    readingSummary: `${name} has ${posts.length} recent daily.dev posts ready for analysis.`,
  };
}

function deriveThemes(posts: Article[]): ReadingTheme[] {
  const counts = new Map<string, number>();

  for (const post of posts) {
    const foundInPost = new Set<string>();

    for (const tag of post.tags) {
      const normalizedTag = normalizeThemeName(tag);
      if (normalizedTag) {
        foundInPost.add(normalizedTag);
      }
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

  for (const lowSignalTheme of LOW_SIGNAL_THEMES) {
    const count = counts.get(lowSignalTheme) ?? 0;
    const strongestTechnicalCount = Math.max(
      ...[...counts.entries()]
        .filter(([theme]) => !LOW_SIGNAL_THEMES.has(theme))
        .map(([, value]) => value),
      0
    );

    if (count <= strongestTechnicalCount) {
      counts.delete(lowSignalTheme);
    }
  }

  const max = Math.max(...counts.values(), 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count], index) => ({
      name,
      score: scoreTheme(count, max, index),
      description: describeTheme(name, count, posts.length),
    }));
}

function deriveStackSignals(posts: Article[]): StackSignal[] {
  const counts = new Map<string, number>();

  for (const post of posts) {
    const foundInPost = new Set<string>();
    const haystack = searchableText(post);

    for (const [stackName, patterns] of Object.entries(STACK_PATTERNS)) {
      if (patterns.some((pattern) => pattern.test(haystack))) {
        foundInPost.add(stackName);
      }
    }

    for (const stackName of foundInPost) {
      increment(counts, stackName);
    }
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

function dedupeArticles(articles: Article[]): Article[] {
  const seen = new Set<string>();
  return articles.filter((article) => {
    const key = article.url ?? article.id ?? article.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function normalizeThemeName(value: string): string | null {
  const clean = value.replace(/[-_]/g, " ").trim().toLowerCase();
  if (!clean || IGNORED_TAGS.has(clean)) return null;

  if (/\b(ai|agent|agents|llm|openai|gpt|prompt|copilot)\b/.test(clean)) return "AI Agents";
  if (/\b(api|apis|graphql|rest|backend api|node|nodejs|node\.js|express|backend|server)\b/.test(clean)) {
    return "Backend Tooling";
  }
  if (/\b(automation|workflow|ci|cd|devops|productivity)\b/.test(clean)) return "Developer Automation";
  if (/\bsecurity|auth|authentication|oauth\b/.test(clean)) return "Security";
  if (/\b(oss|open source|open-source|github|community)\b/.test(clean)) return "Open Source";
  if (/\b(react|frontend|ui|css|tailwind|styling|javascript|typescript)\b/.test(clean)) {
    return "Frontend Engineering";
  }
  if (/\bpostgres|postgresql|database|sql\b/.test(clean)) return "Database Engineering";
  if (/\bcareer|job|jobs|interview|productivity\b/.test(clean)) return "Career";

  return clean.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((tag) => {
      if (typeof tag === "string") return tag;
      if (tag && typeof tag === "object") {
        const record = tag as Record<string, unknown>;
        return stringField(record.name) ?? stringField(record.title);
      }
      return null;
    })
    .filter((tag): tag is string => Boolean(tag))
    .slice(0, 5);
}

function stringField(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function objectField(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : undefined;
}

function searchableText(post: Article): string {
  return `${post.title} ${post.source} ${post.tags.join(" ")}`.toLowerCase();
}

const IGNORED_TAGS = new Set(["dailydev", "daily.dev", "news", "webdev", "programming"]);
const LOW_SIGNAL_THEMES = new Set(["Career"]);

const THEME_PATTERNS: Record<string, RegExp[]> = {
  "AI Agents": [/\bai\b/, /\bagents?\b/, /\bllm\b/, /\bopenai\b/, /\bgpt\b/, /\bcopilot\b/],
  "Backend Tooling": [/\bbackend\b/, /\bnode(?:\.js|js)?\b/, /\bexpress\b/, /\bserver\b/, /\bapi\b/, /\bapis\b/, /\brest\b/, /\bgraphql\b/],
  "Developer Automation": [/\bautomation\b/, /\bworkflow\b/, /\bci\b/, /\bcd\b/, /\bdevops\b/, /\bproductivity\b/],
  Security: [/\bsecurity\b/, /\bauth\b/, /\boauth\b/, /\bauthentication\b/, /\bvalidation\b/, /\bhmac\b/],
  "Open Source": [/\bopen source\b/, /\bopen-source\b/, /\boss\b/, /\bgithub\b/, /\bcommunity\b/],
  "Frontend Engineering": [/\breact\b/, /\bnext\.?js\b/, /\bfrontend\b/, /\bui\b/, /\bcss\b/, /\btailwind\b/, /\bjavascript\b/, /\btypescript\b/],
  "Database Engineering": [/\bpostgres(?:ql)?\b/, /\bsql\b/, /\bdatabase\b/],
};

const STACK_PATTERNS: Record<string, RegExp[]> = {
  TypeScript: [/\btypescript\b/, /\bts\b/],
  JavaScript: [/\bjavascript\b/, /\bjs\b/],
  React: [/\breact\b/, /\bnext\.?js\b/],
  "Node.js": [/\bnode(?:\.js|js)?\b/],
  Express: [/\bexpress\b/],
  PostgreSQL: [/\bpostgres(?:ql)?\b/, /\bsql\b/],
  "OpenAI API": [/\bopenai\b/, /\bgpt\b/, /\bllm\b/],
  "VS Code": [/\bvs\s?code\b/, /\bvisual studio code\b/],
};

function scoreTheme(count: number, max: number, index: number): number {
  const relative = count / max;
  const score = Math.round(36 + relative * 56 - index * 3);
  return Math.max(28, Math.min(92, score));
}

function describeTheme(name: string, count: number, totalPosts: number): string {
  const posts = `${count} ${count === 1 ? "post" : "posts"}`;
  if (count >= Math.max(5, Math.ceil(totalPosts * 0.25))) {
    return `High signal from ${posts}`;
  }

  const descriptions: Record<string, string> = {
    "AI Agents": `AI and agent topics appeared in ${posts}`,
    "Backend Tooling": `Frequently appears with APIs, Node.js, and automation`,
    "Developer Automation": `Connected to workflows and productivity tools`,
    Security: `Seen in validation, auth, or code safety topics`,
    "Open Source": `Appears in tooling and community-related posts`,
    "Frontend Engineering": `Connected to UI, React, and frontend topics`,
    "Database Engineering": `Seen in data modeling and database topics`,
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
    return `You appear to be exploring ${topThemes || "developer tooling"} through practical tools like ${topStack}. A strong next project should connect these reading patterns into a focused developer workflow.`;
  }

  return `You appear to be exploring ${topThemes || "developer tooling"}. A strong next project should turn those reading patterns into a practical developer workflow.`;
}

function buildRecommendation(themes: ReadingTheme[], stackSignals: StackSignal[]): string {
  const strongestTheme = themes[0]?.name ?? "your strongest reading theme";
  const strongestTech = stackSignals[0]?.name ?? "a practical implementation stack";
  return `Your next build should combine ${strongestTheme} with ${strongestTech} in a small, shippable developer tool.`;
}
