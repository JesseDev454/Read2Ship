import { NavLink } from "react-router-dom";
import { BarChart3, Construction, Share2 } from "lucide-react";
import { Logo } from "./Logo";
import { getSessionPlanSlug } from "../lib/session";

export function Sidebar() {
  const planSlug = getSessionPlanSlug();
  const items = [
    { label: "Overview", to: "/dashboard", icon: BarChart3 },
    { label: "Build Plan", to: "/build-plan", icon: Construction },
    { label: "Share Card", to: planSlug ? `/plan/${planSlug}` : "/connect", icon: Share2 },
  ];

  return (
    <>
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-white/10 bg-surface-main px-4 py-6 md:flex md:flex-col">
        <Logo />
        <div className="label-code mb-3 mt-10 px-4">Nav</div>
        <nav className="flex flex-1 flex-col gap-1">
          {items.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-r-lg border-l-4 px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "border-secondary bg-secondary/10 text-secondary"
                    : "border-transparent text-text-secondary hover:bg-white/[0.05] hover:text-white"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-xs leading-relaxed text-text-tertiary">
          Reading to insight to build plan to share.
        </div>
      </aside>
      <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-3 border-t border-white/10 bg-surface-main/95 px-2 py-2 backdrop-blur md:hidden">
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-md px-1 py-2 text-[10px] font-medium ${
                isActive ? "bg-secondary/10 text-secondary" : "text-text-tertiary"
              }`
            }
          >
            <item.icon size={17} />
            <span className="max-w-full truncate">{item.label.split(" ")[0]}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
