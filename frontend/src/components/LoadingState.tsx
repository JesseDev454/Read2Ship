import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const messages = [
  "Reading your developer taste...",
  "Finding patterns in your saves...",
  "Turning your reading into a build plan...",
];

export function LoadingState({ title = "Analyzing your developer taste..." }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="panel flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
      <Loader2 className="mb-5 animate-spin text-primary" size={36} />
      <h2 className="mb-2 text-xl font-semibold text-white">{title}</h2>
      <p className="mb-8 text-sm text-text-secondary">{messages[index]}</p>
      <div className="h-2 w-full max-w-sm overflow-hidden rounded-full border border-white/10 bg-white/10">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-primary shadow-glow" />
      </div>
    </section>
  );
}
