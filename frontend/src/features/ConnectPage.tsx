import { FormEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, KeyRound, Lock, WandSparkles } from "lucide-react";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { GuidanceCard, StepPill } from "../components/GuidanceCard";
import { Input } from "../components/Input";
import { LoadingState } from "../components/LoadingState";
import { Logo } from "../components/Logo";
import { analyzeDailyDevToken, ApiRequestError, generatePlan } from "../lib/api";
import { createFallbackPlan } from "../lib/fallbackPlan";
import { writeSampleSession, writeSessionAnalysis } from "../lib/session";
import type { ReadingAnalysis } from "../types/read2ship";

type State = "idle" | "loading" | "error" | "empty";

export function ConnectPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectToShare = searchParams.get("redirect") === "share";
  const [token, setToken] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [errorTitle, setErrorTitle] = useState("Something needs attention");
  const [errorCode, setErrorCode] = useState("ERR_READ2SHIP");
  const [pendingAnalysis, setPendingAnalysis] = useState<ReadingAnalysis | null>(null);
  const [generationError, setGenerationError] = useState("");

  function startSample() {
    writeSampleSession();
    navigate("/dashboard");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setState("loading");
    setError("");

    try {
      const analysis: ReadingAnalysis = await analyzeDailyDevToken(token);
      setPendingAnalysis(analysis);

      try {
        const plan = await generatePlan(analysis);
        const isStored = plan.persistenceStatus !== "not_stored";
        writeSessionAnalysis({
          ...analysis,
          plan,
          planStatus: isStored ? "generated" : "generated_unstored",
          planStatusMessage:
            plan.statusMessage ??
            (isStored
              ? "Generated with AI from your daily.dev reading analysis."
              : "Generated with AI, but not saved publicly. The share page will work locally in this browser session."),
        });
        setPendingAnalysis(null);
        navigateAfterGeneration(plan.slug);
      } catch (planError) {
        setGenerationError(
          planError instanceof Error
            ? planError.message
            : "AI plan generation failed."
        );
        setState("error");
        setErrorTitle("AI plan generation failed");
        setErrorCode(planError instanceof ApiRequestError ? planError.code ?? "AI_GENERATION_FAILED" : "AI_GENERATION_FAILED");
        setError("Read2Ship analyzed your daily.dev activity, but could not generate an AI build plan yet.");
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Failed to analyze reading activity.";
      if (message.toLowerCase().includes("not enough")) {
        setState("empty");
      } else {
        if (caught instanceof ApiRequestError && caught.status === 401) {
          setErrorTitle("daily.dev token was rejected");
          setErrorCode(caught.code ?? "INVALID_TOKEN");
        } else if (caught instanceof ApiRequestError && caught.status === 403) {
          setErrorTitle("daily.dev API access is not enabled");
          setErrorCode(caught.code ?? "DAILY_DEV_ACCESS_DENIED");
        } else {
          setErrorTitle("Reading analysis failed");
          setErrorCode(caught instanceof ApiRequestError ? caught.code ?? "API_ERROR" : "ERR_READ2SHIP");
        }
        setError(message);
        setState("error");
      }
    }
  }

  if (state === "loading") {
    return (
      <ConnectShell>
        <LoadingState />
      </ConnectShell>
    );
  }

  if (state === "error") {
    if (pendingAnalysis) {
      return (
        <ConnectShell>
          <section className="panel flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
            <h1 className="mb-3 text-2xl font-bold text-white">AI plan generation failed</h1>
            <p className="max-w-lg text-sm leading-6 text-text-secondary">
              Your daily.dev reading analysis worked, but AI/database plan generation did not finish.
              No fallback plan has been created automatically.
            </p>
            <div className="my-6 w-full max-w-lg rounded-lg border border-danger/30 bg-danger/10 p-4 text-left text-xs leading-5 text-red-100">
              {generationError || "AI generation failed. Check backend logs and configuration."}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => {
                  setState("loading");
                  setGenerationError("");
                  void retryGeneratePlan(pendingAnalysis);
                }}
              >
                Retry AI Generation
              </Button>
              <Button variant="secondary" onClick={() => continueWithFallback(pendingAnalysis)}>
                Continue with Local Fallback
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setPendingAnalysis(null);
                  setState("idle");
                }}
              >
                Back to Token
              </Button>
            </div>
          </section>
        </ConnectShell>
      );
    }

    return (
      <ConnectShell>
        <ErrorState
          title={errorTitle}
          message={error || "We could not analyze your daily.dev reading activity."}
          code={errorCode}
          actionLabel="Try Again"
          onAction={() => setState("idle")}
        />
      </ConnectShell>
    );
  }

  if (state === "empty") {
    return (
      <ConnectShell>
        <EmptyState actionLabel="Use Sample Plan" onAction={startSample} />
      </ConnectShell>
    );
  }

  return (
    <ConnectShell>
      <div className="grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        <form className="panel p-6 sm:p-8" onSubmit={handleSubmit}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Connect your daily.dev</h1>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Paste your API token to analyze your reading activity and generate a practical build plan.
            </p>
          </div>
          <Input
            label="daily.dev API Token"
            placeholder="Paste your token here"
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            icon={<KeyRound size={18} />}
            hint="Use your daily.dev API token. Read2Ship only sends it to the backend for this analysis request."
          />
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-secondary/20 bg-secondary/10 p-3 text-xs leading-5 text-text-secondary">
            <Lock className="mt-0.5 shrink-0 text-secondary" size={15} />
            <span>Your token is only used to fetch your daily.dev content and is not stored.</span>
          </div>
          <GuidanceCard
            className="mt-4"
            eyebrow="How this works"
            title="From reading signal to build plan"
            description="Read2Ship turns your daily.dev activity into a focused project without saving your token."
            items={[
              { label: "Analyze", text: "Fetch recent/saved posts and detect recurring themes, tools, and technologies." },
              { label: "Generate", text: "Ask AI for a practical build plan based on your actual reading patterns." },
              { label: "Share", text: "Create a public card from the generated plan, not from your private token." },
            ]}
          >
            <div className="flex flex-wrap gap-2">
              <StepPill index={1} label="Connect" />
              <StepPill index={2} label="Analyze" />
              <StepPill index={3} label="Build" />
              <StepPill index={4} label="Share" />
            </div>
          </GuidanceCard>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button type="submit" icon={<WandSparkles size={18} />}>
              Analyze My Reading
            </Button>
            <Button type="button" variant="secondary" onClick={startSample}>
              Try Sample Plan
            </Button>
          </div>
        </form>

        <aside className="card relative overflow-hidden p-6 sm:p-8">
          <div className="absolute inset-0 bg-grid-pattern bg-[size:24px_24px] opacity-20" />
          <div className="relative z-10">
            <div className="label-code mb-4">Example Transformation</div>
            <div className="grid gap-5">
              <div className="rounded-lg border border-white/10 bg-black/20 p-5">
                <div className="mb-3 text-sm font-semibold text-text-tertiary">From</div>
                {[
                  "Building AI Agents with TypeScript",
                  "PostgreSQL Performance Tips",
                  "Designing Better Backend APIs",
                ].map((title) => (
                  <div key={title} className="mb-2 rounded-md bg-white/[0.04] px-3 py-2 text-sm text-text-secondary">
                    Article: {title}
                  </div>
                ))}
              </div>
              <div className="flex justify-center text-secondary">
                <ArrowRight size={24} />
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/10 p-5">
                <div className="mb-3 text-sm font-semibold text-purple-100">To</div>
                <p className="font-semibold text-white">Suggested build: AI-Powered Code Review Assistant</p>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  Tasks: webhook endpoint, AI analysis, review summary
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </ConnectShell>
  );

  async function retryGeneratePlan(analysis: ReadingAnalysis) {
    try {
      const plan = await generatePlan(analysis);
      const isStored = plan.persistenceStatus !== "not_stored";
      writeSessionAnalysis({
        ...analysis,
        plan,
        planStatus: isStored ? "generated" : "generated_unstored",
        planStatusMessage:
          plan.statusMessage ??
          (isStored
            ? "Generated with AI from your daily.dev reading analysis."
            : "Generated with AI, but not saved publicly. The share page will work locally in this browser session."),
      });
      setPendingAnalysis(null);
      navigateAfterGeneration(plan.slug);
    } catch (planError) {
      setGenerationError(
        planError instanceof Error ? planError.message : "AI plan generation failed."
      );
      setState("error");
    }
  }

  function continueWithFallback(analysis: ReadingAnalysis) {
    const plan = {
      ...createFallbackPlan(analysis),
      persistenceStatus: "not_stored" as const,
      generationSource: "fallback" as const,
      statusMessage:
        "Local fallback plan. This was not generated by AI and is not saved publicly.",
    };
    writeSessionAnalysis({
      ...analysis,
      plan,
      planStatus: "fallback",
      planStatusMessage:
        "Using local fallback because AI generation did not complete. This plan is not saved publicly.",
    });
    setPendingAnalysis(null);
    navigateAfterGeneration(plan.slug);
  }

  function navigateAfterGeneration(slug: string) {
    navigate(redirectToShare ? `/plan/${slug}` : "/dashboard");
  }
}

function ConnectShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-app px-4 py-6 text-text-primary sm:px-6 lg:px-8">
      <div className="mx-auto mb-10 flex max-w-6xl items-center justify-between">
        <Logo />
        <Button variant="ghost" onClick={() => history.back()}>
          Back
        </Button>
      </div>
      <main className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-6xl items-center justify-center">
        {children}
      </main>
    </div>
  );
}
