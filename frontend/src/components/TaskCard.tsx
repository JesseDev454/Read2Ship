import type { Task } from "../types/read2ship";

interface TaskCardProps {
  task: Task;
  index: number;
}

const accents = ["bg-primary", "bg-secondary", "bg-success"];

export function TaskCard({ task, index }: TaskCardProps) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-surface-elevated p-5 transition hover:border-white/20">
      <div className={`absolute left-0 top-0 h-full w-1 ${accents[index % accents.length]}`} />
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/20 text-sm font-bold text-white">
          {index + 1}
        </span>
        {task.effort ? (
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-text-tertiary">
            {task.effort}
          </span>
        ) : null}
      </div>
      <h3 className="mb-3 text-base font-semibold text-white">{task.title}</h3>
      <p className="flex-1 text-sm leading-6 text-text-secondary">{task.description}</p>
      {task.deliverable ? (
        <div className="mt-5 rounded-md border border-white/10 bg-black/20 p-3">
          <div className="label-code mb-1">Deliverable</div>
          <div className="text-xs leading-5 text-text-secondary">{task.deliverable}</div>
        </div>
      ) : null}
    </article>
  );
}
