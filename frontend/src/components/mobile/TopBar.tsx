import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Bell, Menu, Search, X, ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Drawer } from "./Drawer";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

export function TopBar({ title, back, right }: { title: string; back?: boolean; right?: React.ReactNode }) {
  const router = useRouter();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState("");

  const { data: notifications = [] } = useQuery<any[]>({
    queryKey: ["notifications"],
    queryFn: () => apiRequest<any[]>("/notifications"),
  });
  const hasUnread = notifications.some((n) => n.unread);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      navigate({ to: "/discover", search: { q } as any });
      setSearching(false);
      setQ("");
    }
  };

  return (
    <>
      <Drawer open={drawer} onClose={() => setDrawer(false)} />
      <motion.header
        initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="relative z-30 shrink-0 pt-11 pb-3 px-4 glass border-b border-white/40"
      >
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent" />
        <AnimatePresence mode="wait" initial={false}>
          {searching ? (
            <motion.form key="search" onSubmit={handleSearch}
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-2"
            >
              <Search className="size-4 text-muted-foreground shrink-0" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Search polls, people, topics…"
                className="flex-1 bg-transparent outline-none text-sm min-w-0" />
              <button type="button" onClick={() => { setSearching(false); setQ(""); }}
                className="size-8 grid place-items-center rounded-full bg-white/60">
                <X className="size-4" />
              </button>
            </motion.form>
          ) : (
            <motion.div key="bar"
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2"
            >
              <div className="flex items-center gap-1.5">
                {back ? (
                  <button onClick={() => router.history.back()}
                    className="size-9 grid place-items-center rounded-full glass active:scale-95 transition"
                    aria-label="Go back">
                    <ChevronLeft className="size-5" />
                  </button>
                ) : (
                  <button onClick={() => setDrawer(true)}
                    className="size-9 grid place-items-center rounded-full glass active:scale-95 transition"
                    aria-label="Open menu">
                    <Menu className="size-5" />
                  </button>
                )}
                {!back && (
                  <Link to="/home" className="ml-1 flex items-center gap-1.5 shrink-0">
                    <span className="size-7 rounded-lg grid place-items-center text-background shadow"
                      style={{ background: "linear-gradient(135deg, var(--color-ember), oklch(0.55 0.22 36))" }}>
                      <LogoMark />
                    </span>
                    <span className="font-display font-bold text-base tracking-tight">PulsePoll</span>
                  </Link>
                )}
              </div>

              <h1 className="text-center text-[13px] font-semibold text-muted-foreground truncate px-1">
                {title}
              </h1>

              <div className="flex items-center gap-1.5 justify-end">
                {right}
                <button onClick={() => setSearching(true)}
                  className="size-9 grid place-items-center rounded-full glass active:scale-95 transition"
                  aria-label="Search">
                  <Search className="size-[18px]" />
                </button>
                <Link to="/notifications"
                  className="size-9 grid place-items-center rounded-full glass active:scale-95 transition relative">
                  <Bell className="size-[18px]" />
                  {hasUnread && (
                    <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-ember ring-2 ring-white" />
                  )}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
      <path d="M5 18V12M12 18V6M19 18v-9" />
    </svg>
  );
}
