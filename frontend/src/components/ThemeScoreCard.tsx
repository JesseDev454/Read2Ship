import type { ReadingTheme } from "../types/read2ship";

interface ThemeScoreCardProps {
  theme: ReadingTheme;
  accent?: "primary" | "secondary" | "warning" | "success";
}

const accentClasses = {
  primary: "bg-primary shadow-[0_0_12px_rgba(147,51,234,0.45)]",
  secondary: "bg-secondary shadow-[0_0_12px_rgba(6,182,212,0.45)]",
  warning: "bg-warning",
  success: "bg-success",
};

export function ThemeScoreCard({ theme, accent = "secondary" }: ThemeScoreCardProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">{theme.name}</h3>
          {theme.description ? (
            <p className="mt-1 text-xs leading-5 text-text-tertiary">{theme.description}</p>
          ) : null}
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${
            accent === "secondary"
              ? "border-secondary/30 bg-secondary/10 text-secondary"
              : "border-primary/30 bg-primary/10 text-primary"
          }`}
        >
          {theme.score}%
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${accentClasses[accent]}`}
          style={{ width: `${Math.min(100, Math.max(0, theme.score))}%` }}
        />
      </div>
    </article>
  );
}
