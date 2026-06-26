import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Home, Compass, BarChart3, User, PlusCircle, Bell, Settings,
  FileText, ShieldCheck, LogOut, Sparkles, UserCog, X, HelpCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const links = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/discover", icon: Compass, label: "Discover" },
  { to: "/create", icon: PlusCircle, label: "Create poll" },
  { to: "/results", icon: BarChart3, label: "My polls" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
  { to: "/profile", icon: User, label: "Profile" },
  { to: "/profile/edit", icon: UserCog, label: "Edit profile" },
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/terms", icon: FileText, label: "Terms" },
  { to: "/privacy", icon: ShieldCheck, label: "Privacy" },
];

export function Drawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { profile, user, signOut } = useAuth();
  const initials = (profile?.display_name ?? user?.email ?? "U").slice(0, 2).toUpperCase();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-black/30 backdrop-blur-md"
          />
          <motion.aside
            initial={{ x: "-105%" }} animate={{ x: 0 }} exit={{ x: "-105%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="absolute inset-y-0 left-0 z-50 w-[78%] max-w-[320px] glass-strong flex flex-col"
            style={{ borderTopRightRadius: 32, borderBottomRightRadius: 32 }}
          >
            {/* glow blobs */}
            <div className="liquid-blob absolute -top-16 -left-10 size-56 rounded-full" style={{ background: "var(--color-ember)", opacity: 0.25 }} />
            <div className="liquid-blob absolute bottom-0 -right-10 size-56 rounded-full" style={{ background: "oklch(0.85 0.10 250)", opacity: 0.35 }} />

            <div className="relative pt-12 px-5 pb-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl text-background grid place-items-center font-bold glow-orange"
                  style={{ background: "linear-gradient(135deg, var(--color-ember), oklch(0.55 0.22 36))" }}>
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="font-bold truncate">{profile?.display_name ?? "Welcome"}</div>
                  <div className="text-[11px] text-muted-foreground truncate">@{profile?.username ?? "you"}</div>
                </div>
              </div>
              <button onClick={onClose} className="size-9 grid place-items-center rounded-full glass">
                <X className="size-4" />
              </button>
            </div>

            <div className="relative flex-1 overflow-y-auto hide-scroll px-3 pb-3">
              <div className="px-2 pb-1 text-[10px] uppercase tracking-widest text-muted-foreground">Navigate</div>
              <nav className="space-y-0.5">
                {links.map((l, i) => (
                  <motion.div key={l.to} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 + i * 0.025 }}>
                    <Link to={l.to} onClick={onClose}
                       className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/50 transition group">
                      <div className="size-9 rounded-xl grid place-items-center bg-white/60 group-hover:bg-ember-soft transition">
                        <l.icon className="size-4 text-foreground group-hover:text-ember transition" />
                      </div>
                      <span className="text-sm font-medium">{l.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-4 mx-2 p-4 rounded-2xl text-background relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, oklch(0.13 0 0), oklch(0.28 0 0))" }}>
                <Sparkles className="absolute -right-2 -top-2 size-16 text-ember opacity-30" />
                <div className="text-[11px] uppercase tracking-wider text-white/60">Pro tip</div>
                <div className="mt-1 text-sm font-semibold leading-snug">Create your first poll and invite friends to vote.</div>
                <Link to="/create" onClick={onClose} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-ember">
                  Start now →
                </Link>
              </div>
            </div>

            <div className="relative p-3 border-t border-white/40">
              <button onClick={() => { onClose(); signOut(); }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-destructive/10 text-destructive font-semibold text-sm">
                <LogOut className="size-4" /> Sign out
              </button>
              <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                <HelpCircle className="size-3" /> PulsePoll v1.0
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
