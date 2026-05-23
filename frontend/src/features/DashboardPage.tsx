import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Lightbulb, Rocket, TrendingUp } from "lucide-react";
import { ArticlePreviewCard } from "../components/ArticlePreviewCard";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { OnboardingTour } from "../components/OnboardingTour";
import { Sidebar } from "../components/Sidebar";
import { ThemeScoreCard } from "../components/ThemeScoreCard";
import { buildOverviewAnalysis } from "../lib/analysisDisplay";
import { readSessionAnalysis } from "../lib/session";
import { useState } from "react";

const RECENT_POSTS_PER_PAGE = 5;

export function DashboardPage() {
  const navigate = useNavigate();
  const [openStackSignal, setOpenStackSignal] = useState<string | null>(null);
  const [recentPostsPage, setRecentPostsPage] = useState(1);
  const analysis = readSessionAnalysis();

  if (!analysis) {
    return (
      <div className="min-h-screen bg-bg-app px-4 py-8 text-text-primary sm:px-6 lg:px-8">
        <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
          <EmptyState
            title="Generate a plan first"
            message="Connect your daily.dev account or choose the explicit sample mode before opening the dashboard."
            actionLabel="Go to Connect"
            onAction={() => navigate("/connect")}
          />
        </main>
      </div>
    );
  }

  const overview = buildOverviewAnalysis(analysis);
  const totalRecentPostPages = Math.max(
    1,
    Math.ceil(analysis.recentPosts.length / RECENT_POSTS_PER_PAGE)
  );
  const currentRecentPostsPage = Math.min(recentPostsPage, totalRecentPostPages);
  const recentPostsStartIndex = (currentRecentPostsPage - 1) * RECENT_POSTS_PER_PAGE;
  const visibleRecentPosts = analysis.recentPosts.slice(
    recentPostsStartIndex,
    recentPostsStartIndex + RECENT_POSTS_PER_PAGE
  );
  const recentPostsEndIndex = recentPostsStartIndex + visibleRecentPosts.length;

  return (
    <div className="min-h-screen bg-bg-app pb-24 text-text-primary md:pb-0 md:pl-64">
      <Sidebar />
      <main className="grid w-full max-w-none gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
        <section className="min-w-0 space-y-6">
          <div className="panel relative overflow-hidden p-6">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
            <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
              {analysis.profile.avatarUrl ? (
                <img
                  src={analysis.profile.avatarUrl}
                  alt={`${analysis.profile.name} avatar`}
                  className="h-20 w-20 shrink-0 rounded-full border border-white/10 object-cover shadow-[0_0_24px_rgba(6,182,212,0.16)]"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-3xl font-bold text-white">
                  {analysis.profile.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-bold text-white">{analysis.profile.name}</h1>
                <p className="mt-1 text-sm text-text-secondary">@{analysis.profile.username}</p>
                <p className="mt-4 text-sm leading-6 text-text-secondary">
                  {overview.readingSummary}
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-center">
                <div className="text-3xl font-bold text-secondary">{analysis.postsAnalyzed}</div>
                <div className="label-code mt-1">Posts Analyzed</div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2" data-tour="dashboard-themes">
            <section className="card p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Top Reading Themes</h2>
                <TrendingUp className="text-secondary" size={20} />
              </div>
              <div className="space-y-5">
                {overview.themes.map((theme, index) => (
                  <ThemeScoreCard
                    key={theme.name}
                    theme={theme}
                    accent={index === 0 ? "secondary" : index === 1 ? "primary" : "warning"}
                  />
                ))}
              </div>
            </section>

            <section className="card p-6">
              <h2 className="mb-5 text-xl font-semibold text-white">Detected Tech Stack</h2>
              <div className="space-y-3">
                {overview.stackSignals.length ? (
                  overview.stackSignals.map((signal) => (
                    <div
                      key={signal.name}
                      className="rounded-lg border border-white/10 bg-black/20 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenStackSignal((current) =>
                              current === signal.name ? null : signal.name
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-semibold text-cyan-100 transition hover:border-secondary/60 hover:bg-secondary/15"
                          aria-expanded={openStackSignal === signal.name}
                        >
                          {signal.name}
                          <ChevronDown
                            size={13}
                            className={`transition ${openStackSignal === signal.name ? "rotate-180" : ""}`}
                          />
                        </button>
                        <span className="shrink-0 text-xs text-text-tertiary">
                          {signal.description ??
                            `Seen in ${signal.count} ${signal.count === 1 ? "post" : "posts"}`}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                          style={{ width: `${Math.min(100, Math.max(8, signal.confidence))}%` }}
                        />
                      </div>
                      {openStackSignal === signal.name ? (
                        <div className="mt-4 border-t border-white/10 pt-3">
                          <div className="label-code mb-2">Matching Posts</div>
                          {(overview.stackEvidence[signal.name] ?? []).length ? (
                            <div className="divide-y divide-white/5">
                              {(overview.stackEvidence[signal.name] ?? []).map((article) => (
                                <ArticlePreviewCard key={article.id} article={article} />
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs leading-5 text-text-tertiary">
                              No matching recent post title or tag is available for this signal yet.
                            </p>
                          )}
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm leading-6 text-text-secondary">
                    No specific technologies were detected yet. Read2Ship will keep this focused on actual tools as more posts are analyzed.
                  </div>
                )}
              </div>
            </section>
          </div>

          <section className="card p-4 sm:p-6">
            <div className="mb-3 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-white">Recent Posts Analyzed</h2>
              {analysis.recentPosts.length > RECENT_POSTS_PER_PAGE ? (
                <span className="text-xs font-medium text-text-tertiary">
                  Showing {recentPostsStartIndex + 1}-{recentPostsEndIndex} of{" "}
                  {analysis.recentPosts.length}
                </span>
              ) : null}
            </div>
            {visibleRecentPosts.length ? (
              <div className="divide-y divide-white/5">
                {visibleRecentPosts.map((article) => (
                  <ArticlePreviewCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-text-secondary">
                No recent posts were returned for this analysis.
              </div>
            )}
            {analysis.recentPosts.length > RECENT_POSTS_PER_PAGE ? (
              <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs font-medium text-text-tertiary">
                  Page {currentRecentPostsPage} of {totalRecentPostPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="min-h-9 px-3 py-2 text-xs"
                    onClick={() =>
                      setRecentPostsPage((page) => Math.max(1, page - 1))
                    }
                    disabled={currentRecentPostsPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    className="min-h-9 px-3 py-2 text-xs"
                    onClick={() =>
                      setRecentPostsPage((page) => Math.min(totalRecentPostPages, page + 1))
                    }
                    disabled={currentRecentPostsPage === totalRecentPostPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
          </section>
        </section>

        <aside className="min-w-0 space-y-6">
          <section className="panel sticky top-6 overflow-hidden p-6">
            <div className="absolute right-4 top-4 opacity-10">
              <Lightbulb size={92} />
            </div>
            <div className="relative z-10">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-primary">
                <Lightbulb size={20} />
                Developer Direction
              </h2>
              <p className="text-sm leading-7 text-text-secondary">{overview.developerDirection}</p>
              <div className="mt-6 rounded-lg border border-white/10 bg-black/20 p-4">
                <div className="label-code mb-2">Suggested Action</div>
                <p className="text-sm leading-6 text-white">{overview.recommendation}</p>
              </div>
              <Link to="/build-plan" className="mt-6 block" data-tour="dashboard-generate-plan">
                <Button className="w-full" icon={<Rocket size={18} />}>
                  Generate Build Plan
                </Button>
              </Link>
            </div>
          </section>
        </aside>
      </main>
      <OnboardingTour
        id="dashboard"
        steps={[
          {
            target: "dashboard-themes",
            title: "Your reading signals",
            body: "These sections show what Read2Ship found from your daily.dev activity.",
          },
          {
            target: "dashboard-generate-plan",
            title: "Generate the build plan",
            body: "Turn the analysis into a project plan with tasks, stack, and a share card.",
          },
        ]}
      />
    </div>
  );
}
