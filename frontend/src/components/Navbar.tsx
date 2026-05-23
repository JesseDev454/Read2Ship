import { Link, NavLink } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./Button";

export function Navbar() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm transition hover:text-white ${isActive ? "text-primary" : "text-text-secondary"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-bg-app/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="Read2Ship home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navClass}>
            Product
          </NavLink>
          <NavLink to="/plan/sample-ai-code-review-assistant" className={navClass}>
            Demo
          </NavLink>
          <a className="text-sm text-text-secondary transition hover:text-white" href="/#how">
            How it Works
          </a>
          <NavLink to="/connect" className={navClass}>
            Generate Plan
          </NavLink>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-text-secondary">
            <BadgeCheck size={14} className="text-secondary" />
            Powered by daily.dev API
          </span>
          <Link to="/connect">
            <Button className="min-h-10 px-4 py-2">Generate</Button>
          </Link>
        </div>
        <Link className="md:hidden" to="/connect">
          <Button className="min-h-10 px-4 py-2">Start</Button>
        </Link>
      </div>
    </header>
  );
}
