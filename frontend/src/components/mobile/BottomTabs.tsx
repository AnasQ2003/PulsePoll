import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Compass, BarChart3, User } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { RadialMenu } from "./RadialMenu";

const tabs = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/discover", icon: Compass, label: "Discover" },
  { to: "/results", icon: BarChart3, label: "Results" },
  { to: "/profile", icon: User, label: "Profile" },
];

export function BottomTabs() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <>
      <RadialMenu open={open} onClose={() => setOpen(false)} />
      <nav className="relative z-30 shrink-0 px-4 pb-5 pt-2 glass border-t border-white/40">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent" />
        <div className="grid grid-cols-5 items-center gap-1">
          {tabs.slice(0, 2).map((t) => <Tab key={t.to} {...t} active={path.startsWith(t.to)} />)}
          <div className="flex justify-center">
            <motion.button
              whileTap={{ scale: 0.85 }}
              animate={{ rotate: open ? 45 : 0 }}
              onClick={() => setOpen((v) => !v)}
              className="size-14 -mt-7 rounded-full bg-ink text-background grid place-items-center glow-orange relative"
              style={{ background: "linear-gradient(135deg, var(--color-ember), oklch(0.55 0.22 36))" }}
              aria-label="Open menu"
            >
              <PlusIcon />
            </motion.button>
          </div>
          {tabs.slice(2).map((t) => <Tab key={t.to} {...t} active={path.startsWith(t.to)} />)}
        </div>
      </nav>
    </>
  );
}

function Tab({ to, icon: Icon, label, active }: any) {
  return (
    <Link to={to} className="relative flex flex-col items-center gap-1 py-2">
      {active && (
        <motion.span layoutId="tab-dot" className="absolute -top-0.5 size-1.5 rounded-full bg-ember" />
      )}
      <Icon className={`size-5 transition ${active ? "text-foreground" : "text-muted-foreground"}`} />
      <span className={`text-[10px] font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
    </Link>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
