import { Zap } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/40 bg-primary/20 text-primary shadow-glow">
        <Zap size={20} fill="currentColor" />
      </div>
      {!compact ? (
        <div>
          <div className="font-display text-lg font-bold tracking-tight text-white">
            Read2Ship
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">
            daily.dev to build
          </div>
        </div>
      ) : null}
    </div>
  );
}
