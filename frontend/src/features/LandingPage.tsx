import { Link } from "react-router-dom";
import { BookOpen, BrainCircuit, Rocket } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/Button";
import { ActionCard } from "../components/ActionCard";
import { Reveal } from "../components/Reveal";
import { RotatingTypewriter } from "../components/RotatingTypewriter";

const heroTypewriterWords = ["build.", "prototype.", "side project.", "launch.", "portfolio piece."];

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-bg-app text-text-primary">
      <Navbar />
      <main>
        <section className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="animate-background-drift absolute inset-0 bg-grid-pattern bg-[size:28px_28px] opacity-30" />
          <div className="animate-glow-pulse absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative mx-auto flex max-w-7xl">
            <div className="max-w-6xl lg:-translate-y-6 xl:-translate-y-8">
              <h1 className="animate-fade-up max-w-6xl text-4xl font-bold leading-tight tracking-tight text-white [animation-delay:120ms] sm:text-6xl lg:text-7xl xl:text-8xl">
                Turn your daily.dev reading into your next{" "}
                <RotatingTypewriter
                  words={heroTypewriterWords}
                  className="animate-gradient-shimmer bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
                />
              </h1>
              <p className="animate-fade-up mt-7 max-w-3xl text-lg leading-8 text-text-secondary [animation-delay:240ms] sm:text-xl sm:leading-9">
                Read2Ship analyzes your daily.dev content and generates practical
                mini-projects, implementation tasks, and shareable build plans.
              </p>
              <div className="animate-fade-up mt-10 flex flex-col gap-3 [animation-delay:360ms] sm:flex-row">
                <Link to="/connect">
                  <Button icon={<Rocket size={18} />} className="cta-button w-full sm:w-auto">
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
          </div>
        </section>

        <section id="how" className="border-y border-white/10 bg-surface-main px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal className="mb-10">
              <div>
                <div className="label-code mb-3">Reading to Shipping</div>
                <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                  Three steps from saved posts to a real project.
                </h2>
              </div>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-3">
              <Reveal delay={80}>
                <ActionCard
                  label="Step 01"
                  title="Connect daily.dev"
                  description="Paste your API token or use sample mode. Your token is used only for the request."
                  icon={<BookOpen size={22} />}
                />
              </Reveal>
              <Reveal delay={180}>
                <ActionCard
                  label="Step 02"
                  title="Analyze reading themes"
                  description="Read2Ship finds repeated interests, stack signals, and developer direction."
                  icon={<BrainCircuit size={22} />}
                />
              </Reveal>
              <Reveal delay={280}>
                <ActionCard
                  label="Step 03"
                  title="Generate and share"
                  description="Get a practical mini-project, three implementation tasks, and a polished share card."
                  icon={<Rocket size={22} />}
                />
              </Reveal>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 px-4 py-8 text-center text-xs text-text-tertiary sm:px-6 lg:px-8">
          Copyright 2026 Read2Ship.
        </footer>
      </main>
    </div>
  );
}
