import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, Copy, RefreshCw, Share2, Sparkles } from "lucide-react";
import { ArticlePreviewCard } from "../components/ArticlePreviewCard";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { Sidebar } from "../components/Sidebar";
import { TaskCard } from "../components/TaskCard";
import { TechStackChips } from "../components/TechStackChips";
import { generatePlan } from "../lib/api";
import { copyText } from "../lib/clipboard";
import { planToMarkdown } from "../lib/share";
import { readSessionAnalysis, writeSessionAnalysis } from "../lib/session";
import type { Difficulty } from "../types/read2ship";
import { useState } from "react";

const difficultyOptions: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

export function BuildPlanPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [sessionAnalysis, setSessionAnalysis] = useState(() => readSessionAnalysis());
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(
    () => readSessionAnalysis()?.plan?.difficulty ?? "Intermediate"
  );
  const plan = sessionAnalysis?.plan;

  if (!plan) {
    return (
      <div className="min-h-screen bg-bg-app px-4 py-8 text-text-primary sm:px-6 lg:px-8">
        <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
          <EmptyState
            title="No build plan yet"
            message="Generate a daily.dev-based plan first. Read2Ship will not show the demo plan unless you choose sample mode."
            actionLabel="Go to Connect"
            onAction={() => navigate("/connect")}
          />
        </main>
      </div>
    );
  }

  const activePlan = plan;

  async function copyPlan() {
    await copyText(planToMarkdown(activePlan));
    setStatus("Plan copied");
    setError("");
    window.setTimeout(() => setStatus(""), 1800);
  }

  async function handleRegenerate() {
    if (!sessionAnalysis || sessionAnalysis.planStatus === "sample") {
      setStatus("");
      setError("Sample mode cannot regenerate with AI. Connect your daily.dev account to generate real variations.");
      return;
    }

    setIsRegenerating(true);
    setError("");
    setStatus(`Generating a ${selectedDifficulty.toLowerCase()} plan from your daily.dev analysis...`);

    try {
      const nextPlan = await generatePlan(
        { ...sessionAnalysis, plan: activePlan },
        { difficulty: selectedDifficulty }
      );
      const isStored = nextPlan.persistenceStatus !== "not_stored";
      const nextAnalysis = {
        ...sessionAnalysis,
        plan: nextPlan,
        planStatus: isStored ? "generated" as const : "generated_unstored" as const,
        planStatusMessage:
          nextPlan.statusMessage ??
          (isStored
            ? "Generated another AI plan from your daily.dev reading analysis."
            : "Generated another AI plan, but it is available only in this browser session."),
      };

      writeSessionAnalysis(nextAnalysis);
      setSessionAnalysis(nextAnalysis);
      setSelectedDifficulty(nextPlan.difficulty);
      setStatus(isStored ? "New AI plan generated" : "New AI plan generated locally");
    } catch (caught) {
      setStatus("");
      setError(caught instanceof Error ? caught.message : "AI regeneration failed. Your previous plan is still available.");
    } finally {
      setIsRegenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-app pb-24 text-text-primary md:pb-0 md:pl-64">
      <Sidebar />
      <main className="w-full max-w-none px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="label-code mb-2">Generated Build Plan</div>
            <h1 className="text-3xl font-bold text-white">Your next build</h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-lg border border-white/10 bg-black/20 p-1">
              <div className="grid grid-cols-3 gap-1" role="group" aria-label="Regeneration difficulty">
                {difficultyOptions.map((difficulty) => (
                  <button
                    key={difficulty}
                    type="button"
                    onClick={() => setSelectedDifficulty(difficulty)}
                    disabled={isRegenerating}
                    className={`min-h-9 rounded-md px-3 text-xs font-semibold transition ${
                      selectedDifficulty === difficulty
                        ? "bg-primary text-white shadow-glow"
                        : "text-text-secondary hover:bg-white/[0.06] hover:text-white"
                    }`}
                    aria-pressed={selectedDifficulty === difficulty}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
            <Button
              variant="secondary"
              icon={<RefreshCw size={16} />}
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              {isRegenerating ? "Regenerating..." : "Regenerate"}
            </Button>
            <Link to={`/plan/${activePlan.slug}`}>
              <Button variant="secondary" icon={<Share2 size={16} />} className="w-full sm:w-auto">
                Create Share Card
              </Button>
            </Link>
          </div>
        </div>

        {status ? (
          <div className="mb-4 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-green-100">
            {status}
          </div>
        ) : null}

        {error ? (
          <div className="mb-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm leading-6 text-red-100">
            {error}
          </div>
        ) : null}

        {sessionAnalysis?.planStatus === "fallback" || sessionAnalysis?.planStatus === "generated_unstored" ? (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-yellow-100">
            <AlertTriangle className="mt-0.5 shrink-0" size={17} />
            <span>
              {sessionAnalysis.planStatusMessage ??
                "This plan is available locally in this browser session, but is not saved for public sharing yet."}
            </span>
          </div>
        ) : null}

        <section className="panel relative mb-6 overflow-hidden p-6 sm:p-8">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Sparkles size={24} />
              </div>
              <h2 className="text-2xl font-semibold text-primary">{activePlan.projectTitle}</h2>
            </div>
            <p className="max-w-5xl text-base leading-8 text-text-secondary">{activePlan.summary}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Meta label="Difficulty" value={activePlan.difficulty} />
              <Meta label="Estimated Time" value={activePlan.estimatedTime} />
              <Meta label="Track" value={activePlan.track} />
            </div>
            <div className="mt-6">
              <div className="label-code mb-3">Recommended Stack</div>
              <TechStackChips stack={activePlan.stack} featured />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to={`/plan/${activePlan.slug}`}>
                <Button icon={<Share2 size={18} />} className="w-full sm:w-auto">
                  Create Share Card
                </Button>
              </Link>
              <Button variant="secondary" icon={<Copy size={18} />} onClick={copyPlan}>
                Copy Plan
              </Button>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Execution Plan</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {activePlan.tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
          </div>
        </section>

        {activePlan.bonusFeature ? (
          <section className="mb-6 rounded-lg border border-warning/25 bg-warning/10 p-5">
            <div className="label-code mb-2 text-warning">Bonus Feature</div>
            <p className="text-sm leading-6 text-white">{activePlan.bonusFeature}</p>
          </section>
        ) : null}

        <section className="card p-4 sm:p-6">
          <h2 className="mb-3 text-xl font-semibold text-white">Inspired by your daily.dev reads</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activePlan.inspiredBy.map((article) => (
              <ArticlePreviewCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="label-code mb-2">{label}</div>
      <div className="font-semibold text-white">{value}</div>
    </div>
  );
}
