export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface DeveloperProfile {
  name: string;
  username: string;
  avatarUrl?: string;
  readingSummary: string;
}

export interface Article {
  id: string;
  title: string;
  source: string;
  url?: string;
  tags: string[];
  readAt?: string;
  savedAt?: string;
}

export interface ReadingTheme {
  name: string;
  score: number;
  description?: string;
}

export interface StackSignal {
  name: string;
  count: number;
  confidence: number;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deliverable?: string;
  effort?: string;
}

export interface BuildPlan {
  id?: string;
  slug: string;
  profile: DeveloperProfile;
  projectTitle: string;
  summary: string;
  currentDirection: string;
  difficulty: Difficulty;
  estimatedTime: string;
  track: string;
  stack: string[];
  tasks: Task[];
  bonusFeature?: string;
  inspiredBy: Article[];
  createdAt: string;
  persistenceStatus?: "stored" | "not_stored";
  generationSource?: "ai" | "fallback" | "sample";
  statusMessage?: string;
}

export interface ReadingAnalysis {
  profile: DeveloperProfile;
  postsAnalyzed: number;
  themes: ReadingTheme[];
  stack: string[];
  stackSignals?: StackSignal[];
  recentPosts: Article[];
  developerDirection: string;
  recommendation: string;
  plan: BuildPlan;
  planStatus?: "generated" | "generated_unstored" | "fallback" | "sample";
  planStatusMessage?: string;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
}
