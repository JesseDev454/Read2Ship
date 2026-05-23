import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, BrainCircuit, Rocket, Sparkles } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/Button";
import { ActionCard } from "../components/ActionCard";
import { ShareablePlanCard } from "../components/ShareablePlanCard";
import { sampleAnalysis } from "../data/samplePlan";

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-bg-app text-text-primary">
      <Navbar />
      <main>
        <section className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="absolute inset-0 bg-grid-pattern bg-[size:28px_28px] opacity-30" />
          <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-text-secondary">
                <Sparkles size={15} className="text-secondary" />
                Powered by daily.dev API
              </div>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Turn your daily.dev reading into your next{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  build.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-text-secondary sm:text-lg">
                Read2Ship analyzes your daily.dev content and generates practical
                mini-projects, implementation tasks, and shareable build plans.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link to="/connect">
                  <Button icon={<Rocket size={18} />} className="w-full sm:w-auto">
                    Generate My Plan
                  </Button>
                </Link>
                <Link to="/plan/sample-ai-code-review-assistant">
                  <Button
                    variant="secondary"
                    icon={<BookOpen size={18} />}
                    className="w-full sm:w-auto"
                  >
                    View Sample Plan
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-primary/25 to-secondary/25 blur-2xl" />
              <div className="relative mx-auto max-w-[680px] scale-[0.92] sm:scale-95 lg:scale-100">
                <ShareablePlanCard plan={sampleAnalysis.plan} />
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="border-y border-white/10 bg-surface-main px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="label-code mb-3">Reading to Shipping</div>
                <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                  Three steps from saved posts to a real project.
                </h2>
              </div>
              <Link to="/connect" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                Generate Plan <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <ActionCard
                label="Step 01"
                title="Connect daily.dev"
                description="Paste your API token or use sample mode. Your token is used only for the request."
                icon={<BookOpen size={22} />}
              />
              <ActionCard
                label="Step 02"
                title="Analyze reading themes"
                description="Read2Ship finds repeated interests, stack signals, and developer direction."
                icon={<BrainCircuit size={22} />}
              />
              <ActionCard
                label="Step 03"
                title="Generate and share"
                description="Get a practical mini-project, three implementation tasks, and a polished share card."
                icon={<Rocket size={22} />}
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-white">Stop collecting. Start shipping.</h2>
            <p className="mt-4 text-text-secondary">
              A focused developer tool for turning what you already read into what you build next.
            </p>
            <Link to="/connect" className="mt-8 inline-block">
              <Button icon={<ArrowRight size={18} />}>Generate Your Own</Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
