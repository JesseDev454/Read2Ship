import { Link, NavLink } from "react-router-dom";
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
        </nav>
        <Link className="md:hidden" to="/connect">
          <Button className="min-h-10 px-4 py-2">Start</Button>
        </Link>
      </div>
    </header>
  );
}
