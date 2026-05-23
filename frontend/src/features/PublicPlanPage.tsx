import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, Link as LinkIcon, WandSparkles } from "lucide-react";
import { Button } from "../components/Button";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { ShareablePlanCard } from "../components/ShareablePlanCard";
import { copyText } from "../lib/clipboard";
import { fetchPublicPlan } from "../lib/api";
import { downloadCard } from "../lib/share";
import { readSessionAnalysis } from "../lib/session";
import type { BuildPlan } from "../types/read2ship";

export function PublicPlanPage() {
  const { slug = "" } = useParams();
  const cardRef = useRef<HTMLElement>(null);
  const [plan, setPlan] = useState<BuildPlan | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const sessionPlan = readSessionAnalysis()?.plan;
  const isCurrentUserCard = Boolean(
    plan && sessionPlan?.slug === plan.slug && sessionPlan.generationSource !== "sample"
  );

  useEffect(() => {
    let isMounted = true;
    setError("");
    setPlan(null);

    const sessionPlan = readSessionPlan(slug);
    if (sessionPlan) {
      setPlan(sessionPlan);
      return () => {
        isMounted = false;
      };
    }

    fetchPublicPlan(slug)
      .then((nextPlan) => {
        if (isMounted) setPlan(nextPlan);
      })
      .catch((caught) => {
        if (isMounted) setError(caught instanceof Error ? caught.message : "Plan not found.");
      });
    return () => {
      isMounted = false;
    };
  }, [slug]);

  async function copyLink() {
    await copyText(window.location.href);
    setStatus("Link copied");
    window.setTimeout(() => setStatus(""), 1800);
  }

  async function handleDownload() {
    if (!cardRef.current || !plan) return;
    await downloadCard(cardRef.current, `${plan.slug}-read2ship-card.png`);
    setStatus("Card downloaded");
    window.setTimeout(() => setStatus(""), 1800);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-app px-4 py-8 text-text-primary sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-grid-pattern bg-[size:28px_28px] opacity-25" />
      <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col items-center justify-center gap-7">
        {error ? (
          <ErrorState title="Plan unavailable" message={error} code="ERR_PLAN_NOT_FOUND" />
        ) : !plan ? (
          <LoadingState title="Loading share card..." />
        ) : (
          <>
            {plan.persistenceStatus === "not_stored" ? (
              <div className="w-full max-w-2xl rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm leading-6 text-yellow-100">
                {plan.statusMessage ??
                  "This share card is using your local browser session because the plan is not saved publicly yet."}
              </div>
            ) : null}
            <ShareablePlanCard ref={cardRef} plan={plan} shareUrl={getShareUrl(plan.slug)} />
            {status ? (
              <div className="rounded-full border border-success/30 bg-success/10 px-4 py-2 text-sm text-green-100">
                {status}
              </div>
            ) : null}
            <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-3">
              <Button variant="secondary" icon={<LinkIcon size={18} />} onClick={copyLink}>
                Copy Link
              </Button>
              <Button variant="secondary" icon={<Download size={18} />} onClick={handleDownload}>
                Download Card
              </Button>
              {isCurrentUserCard ? (
                <Link to="/build-plan">
                  <Button className="w-full" icon={<ArrowLeft size={18} />}>
                    Back to Build Plan
                  </Button>
                </Link>
              ) : (
                <Link to="/connect?redirect=share">
                  <Button className="w-full" icon={<WandSparkles size={18} />}>
                    Generate My Card
                  </Button>
                </Link>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function readSessionPlan(slug: string): BuildPlan | null {
  const plan = readSessionAnalysis()?.plan;
  return plan?.slug === slug ? plan : null;
}

function getShareUrl(slug: string): string {
  return `${window.location.origin}/plan/${slug}`;
}
