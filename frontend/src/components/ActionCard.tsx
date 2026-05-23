import type { ReactNode } from "react";

interface ActionCardProps {
  label: string;
  title: string;
  description: string;
  icon?: ReactNode;
}

export function ActionCard({ label, title, description, icon }: ActionCardProps) {
  return (
    <article className="card group p-6 transition duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-glow">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-secondary transition duration-300 group-hover:border-secondary/40 group-hover:bg-secondary/10 group-hover:text-white">
        {icon}
      </div>
      <div className="label-code mb-2">{label}</div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-6 text-text-secondary">{description}</p>
    </article>
  );
}
