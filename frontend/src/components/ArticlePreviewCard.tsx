import { ExternalLink, FileText } from "lucide-react";
import type { Article } from "../types/read2ship";

interface ArticlePreviewCardProps {
  article: Article;
}

export function ArticlePreviewCard({ article }: ArticlePreviewCardProps) {
  const content = (
    <article className="group flex gap-4 rounded-lg border border-transparent p-3 transition hover:border-white/10 hover:bg-white/[0.04]">
      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-surface-elevated text-text-tertiary group-hover:text-secondary">
        <FileText size={17} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h4 className="line-clamp-2 text-sm font-semibold leading-5 text-white">
            {article.title}
          </h4>
          {article.url ? (
            <ExternalLink className="mt-0.5 shrink-0 text-text-tertiary group-hover:text-secondary" size={14} />
          ) : null}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span key={tag} className="chip px-2 py-0.5 text-[11px]">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );

  if (!article.url) {
    return content;
  }

  return (
    <a href={article.url} target="_blank" rel="noreferrer" className="block">
      {content}
    </a>
  );
}
