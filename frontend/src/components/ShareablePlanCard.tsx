import { forwardRef } from "react";
import { CheckCircle2, Circle, Newspaper, Zap } from "lucide-react";
import { getCompactCurrentDirection } from "../lib/planDisplay";
import type { BuildPlan } from "../types/read2ship";
import { TechStackChips } from "./TechStackChips";

interface ShareablePlanCardProps {
  plan: BuildPlan;
  shareUrl?: string;
}

export const ShareablePlanCard = forwardRef<HTMLElement, ShareablePlanCardProps>(
  ({ plan, shareUrl }, ref) => {
    const firstInitial = (plan.profile.name || plan.profile.username || "R").charAt(0).toUpperCase();
    const readingSummary = sanitizePublicCopy(plan.profile.readingSummary, plan.profile.name);
    const currentDirection = sanitizePublicCopy(getCompactCurrentDirection(plan), plan.profile.name);
    const generatedDate = new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(plan.createdAt));

    return (
      <article
        ref={ref}
        className="relative w-full max-w-[680px] overflow-hidden rounded-2xl border border-white/10 bg-surface-panel shadow-2xl shadow-black/60 ring-1 ring-white/5"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative z-10 p-6 sm:p-8 md:p-10">
          <header className="mb-8 flex items-start justify-between gap-5 border-b border-white/10 pb-6">
            <div className="flex min-w-0 items-center gap-4">
              {plan.profile.avatarUrl ? (
                <img
                  src={plan.profile.avatarUrl}
                  alt={`${plan.profile.name} avatar`}
                  className="h-12 w-12 shrink-0 rounded-xl border border-white/10 object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-xl font-bold text-white">
                  {firstInitial}
                </div>
              )}
              <div className="min-w-0">
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Read2Ship Plan
                </h1>
                <p className="mt-1 text-sm text-text-secondary">
                  @{plan.profile.username} - Generated from daily.dev reading activity - {generatedDate}
                </p>
              </div>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-glow">
              <Zap size={22} fill="currentColor" />
            </div>
          </header>

          <section className="mb-8 rounded-lg border border-white/10 bg-black/20 p-4">
            <div className="label-code mb-2">Reading Signal</div>
            <p className="text-sm leading-6 text-text-secondary">{readingSummary}</p>
          </section>

          <section className="mb-8 grid gap-5 sm:grid-cols-2">
            <div>
              <div className="label-code mb-2">Current Direction</div>
              <p className="text-lg font-semibold text-purple-100">{currentDirection}</p>
            </div>
            <div>
              <div className="label-code mb-2">Build Next</div>
              <p className="text-lg font-bold text-secondary">{plan.projectTitle}</p>
            </div>
          </section>

          <section className="mb-8 grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <div className="label-code mb-2">Difficulty</div>
              <p className="font-semibold text-white">{plan.difficulty}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <div className="label-code mb-2">Estimated Time</div>
              <p className="font-semibold text-white">{plan.estimatedTime}</p>
            </div>
          </section>

          <section className="mb-8">
            <div className="label-code mb-4">Next 3 Tasks</div>
            <div className="space-y-3">
              {plan.tasks.slice(0, 3).map((task, index) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/20 p-4"
                >
                  {index === 0 ? (
                    <CheckCircle2 className="mt-0.5 shrink-0 text-primary" size={18} />
                  ) : (
                    <Circle className="mt-0.5 shrink-0 text-text-tertiary" size={18} />
                  )}
                  <span className="text-sm leading-6 text-text-primary">{task.title}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <div className="label-code mb-4">Recommended Stack</div>
            <TechStackChips stack={plan.stack} featured />
          </section>

          {plan.inspiredBy.length ? (
            <section className="mb-8">
              <div className="label-code mb-4">Inspired By</div>
              <div className="space-y-2">
                {plan.inspiredBy.slice(0, 3).map((article) => (
                  <div
                    key={article.id}
                    className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/20 p-3"
                  >
                    <Newspaper className="mt-0.5 shrink-0 text-secondary" size={16} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{article.title}</p>
                      <p className="text-xs text-text-tertiary">{article.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <footer className="flex border-t border-white/10 pt-5 text-xs text-text-tertiary">
            <span className="inline-flex items-center gap-2">
              <Zap size={14} className="text-warning" />
              Powered by daily.dev API
            </span>
          </footer>
        </div>
      </article>
    );
  }
);

ShareablePlanCard.displayName = "ShareablePlanCard";

function sanitizePublicCopy(value: string, fullName: string): string {
  const trimmedName = fullName.trim();
  if (!trimmedName) return value;

  const escapedName = trimmedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const withoutName = value.replace(new RegExp(escapedName, "gi"), "You");

  return withoutName
    .replace(/\bYou\s+has been\b/gi, "You have been")
    .replace(/\bYou\s+has\b/gi, "You have")
    .replace(/\bYou\s+is\b/gi, "You are")
    .replace(/\bYou\s+was\b/gi, "You were")
    .replace(/\s{2,}/g, " ")
    .trim();
}
