import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  hint?: string;
}

export function Input({ label, icon, hint, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      <span className="label-code mb-2 block">{label}</span>
      <span className="relative block">
        {icon ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary">
            {icon}
          </span>
        ) : null}
        <input
          className={`w-full rounded-lg border border-white/10 bg-surface-deep px-4 py-3 text-sm text-white placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${icon ? "pl-12" : ""} ${className}`}
          {...props}
        />
      </span>
      {hint ? <span className="mt-2 block text-xs text-text-tertiary">{hint}</span> : null}
    </label>
  );
}
