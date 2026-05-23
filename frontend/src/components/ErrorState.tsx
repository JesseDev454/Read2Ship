import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  message: string;
  code?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorState({
  title = "Something needs attention",
  message,
  code = "ERR_READ2SHIP",
  actionLabel,
  onAction,
}: ErrorStateProps) {
  return (
    <section className="panel flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-danger/30 bg-danger/10 text-danger">
        <AlertTriangle size={24} />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-white">{title}</h2>
      <p className="max-w-md text-sm leading-6 text-text-secondary">{message}</p>
      <div className="my-6 w-full max-w-md rounded-lg border border-white/10 bg-black/25 p-4 text-left font-mono text-xs text-danger">
        {code}
      </div>
      {actionLabel && onAction ? (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </section>
  );
}
