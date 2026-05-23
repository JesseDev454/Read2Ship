import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

interface GuidanceItem {
  label?: string;
  text: string;
}

interface GuidanceCardProps {
  eyebrow?: string;
  title: string;
  description?: string;
  items?: GuidanceItem[];
  children?: ReactNode;
  className?: string;
}

export function GuidanceCard({
  eyebrow,
  title,
  description,
  items = [],
  children,
  className = "",
}: GuidanceCardProps) {
  return (
    <section className={`rounded-lg border border-secondary/20 bg-secondary/10 p-4 ${className}`}>
      {eyebrow ? <div className="label-code mb-2 text-secondary">{eyebrow}</div> : null}
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {description ? (
        <p className="mt-2 text-xs leading-5 text-text-secondary">{description}</p>
      ) : null}
      {items.length ? (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={`${item.label ?? ""}-${item.text}`} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 shrink-0 text-secondary" size={15} />
              <p className="text-xs leading-5 text-text-secondary">
                {item.label ? <span className="font-semibold text-white">{item.label}: </span> : null}
                {item.text}
              </p>
            </div>
          ))}
        </div>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}

interface StepPillProps {
  index: number;
  label: string;
}

export function StepPill({ index, label }: StepPillProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-text-secondary">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] text-primary">
        {index}
      </span>
      {label}
    </span>
  );
}
