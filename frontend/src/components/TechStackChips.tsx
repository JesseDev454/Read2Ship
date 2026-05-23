interface TechStackChipsProps {
  stack: string[];
  featured?: boolean;
}

export function TechStackChips({ stack, featured = false }: TechStackChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {stack.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            featured && index % 3 === 0
              ? "border-primary/30 bg-primary/15 text-purple-200"
              : featured && index % 3 === 1
                ? "border-secondary/30 bg-secondary/15 text-cyan-100"
                : "border-white/10 bg-white/[0.04] text-text-secondary"
          }`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
