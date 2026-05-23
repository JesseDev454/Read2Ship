import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "success";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-glow hover:bg-purple-500 border border-primary/70",
  secondary:
    "bg-transparent text-text-primary border border-border-subtle hover:bg-white/[0.06]",
  ghost:
    "bg-transparent text-text-secondary border border-transparent hover:text-white hover:bg-white/[0.05]",
  success:
    "bg-success text-[#03140a] border border-success/60 shadow-[0_0_20px_rgba(34,197,94,0.18)] hover:brightness-110",
};

export function Button({
  variant = "primary",
  icon,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
