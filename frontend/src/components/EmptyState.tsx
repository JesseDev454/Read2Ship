import { BookOpen } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "Feed is a bit quiet",
  message = "Read2Ship needs a handful of saved or recently read posts to detect useful build patterns.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <section className="panel flex min-h-[320px] flex-col items-center justify-center overflow-hidden p-8 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-secondary/30 bg-secondary/10 text-secondary shadow-cyan">
        <BookOpen size={28} />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-white">{title}</h2>
      <p className="max-w-md text-sm leading-6 text-text-secondary">{message}</p>
      {actionLabel && onAction ? (
        <Button className="mt-6" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </section>
  );
}
