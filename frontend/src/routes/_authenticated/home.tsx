import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/mobile/AppShell";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  Sparkles, TrendingUp, Clock, ChevronRight, Flame, Trophy,
  Zap, Users, PlusCircle, Compass, BarChart3, Filter, ArrowUpDown,
  Search as SearchIcon, X, Heart, MessageCircle, Share2, Bookmark,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/home")({
  component: HomePage,
});

const categories = [
  { key: "all", label: "For You", emoji: "✨" },
  { key: "trending", label: "Trending", emoji: "🔥" },
  { key: "Technology", label: "Tech", emoji: "💻" },
  { key: "Culture", label: "Culture", emoji: "🎭" },
  { key: "Food & Drinks", label: "Food", emoji: "🍜" },
  { key: "Sports", label: "Sports", emoji: "⚽" },
  { key: "Music", label: "Music", emoji: "🎧" },
  { key: "Gaming", label: "Gaming", emoji: "🎮" },
  { key: "Travel", label: "Travel", emoji: "✈️" },
];

const quickActions = [
  { to: "/create", label: "Create", icon: PlusCircle, tint: "var(--color-ember)" },
  { to: "/discover", label: "Discover", icon: Compass, tint: "oklch(0.55 0.18 250)" },
  { to: "/results", label: "Results", icon: BarChart3, tint: "oklch(0.55 0.20 150)" },
  { to: "/notifications", label: "Alerts", icon: Zap, tint: "oklch(0.60 0.22 320)" },
] as const;

const liveActivity = [
  { who: "Maya", action: "voted on", target: "Best ramen in town", t: "now" },
  { who: "Jordan", action: "created", target: "WWDC 2026 hype check", t: "1m" },
  { who: "Sana", action: "voted on", target: "Remote vs office", t: "3m" },
  { who: "Liam", action: "shared", target: "Top sci-fi of the year", t: "6m" },
  { who: "Noor", action: "commented on", target: "Best coffee bean origin", t: "9m" },
];

const leaderboard = [
  { name: "Avery W.", votes: 1280, badgdfgdfgsdfgdge: "🥇" },
  { name: "Kenji T.", votes: 942, badge: "🥈" },
  { name: "Priya R.", votes: 711, badge: "🥉" },
  { name: "Marco D.", votes: 503, badge: "4" },
];

const sortOptions = [
  { key: "recent", label: "Most recent" },
  { key: "popular", label: "Most votes" },
  { key: "az", label: "A → Z" },
] as const;

function HomePage() {
  const { user, profile } = useAuth();
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<(typeof sortOptions)[number]["key"]>("recent");
  const [sortOpen, setSortOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const { data: polls = [] } = useQuery({
    queryKey: ["polls", "all"],
    queryFn: () => apiRequest<any[]>("/polls"),
  });

  const filtered = useMemo(() => {
    let list = [...polls];
    if (category !== "all") {
      if (category === "trending") {
        list = list.filter((p: any) => (p.vote_count ?? 0) >= 1);
      } else {
        list = list.filter(
          (p: any) => (p.category ?? "").toLowerCase() === category.toLowerCase(),
        );
      }
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p: any) => p.title?.toLowerCase().includes(q));
    }
    if (sort === "popular") list.sort((a: any, b: any) => (b.vote_count ?? 0) - (a.vote_count ?? 0));
    if (sort === "az") list.sort((a: any, b: any) => a.title.localeCompare(b.title));
    return list;
  }, [polls, category, sort, search]);

  const firstName =
    profile?.display_name?.split(" ")[0] ||
    profile?.username ||
    user?.email?.split("@")[0] ||
    "friend";

  return (
    <AppShell title={`Hi, ${firstName} 👋`}>
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-5 text-background"
        style={{ background: "linear-gradient(135deg, oklch(0.13 0 0), oklch(0.28 0 0))" }}
      >
        <motion.div
          className="absolute -top-12 -right-12 size-48 rounded-full"
          style={{ background: "radial-gradient(circle, var(--color-ember) 0%, transparent 65%)", opacity: 0.55 }}
          animate={{ scale: [1, 1.18, 1] }} transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-16 -left-10 size-40 rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.65 0.18 250) 0%, transparent 65%)", opacity: 0.4 }}
          animate={{ scale: [1.1, 1, 1.1] }} transition={{ duration: 5, repeat: Infinity }}
        />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full bg-white/10 backdrop-blur">
            <span className="size-1.5 rounded-full bg-ember animate-pulse" /> Live
          </div>
          <h2 className="mt-2 text-2xl font-bold leading-tight">
            {polls.length} active polls<br />waiting for your vote
          </h2>
          <div className="mt-3 flex items-center gap-2">
            <Link to="/discover" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ember text-background text-xs font-semibold">
              Explore <ChevronRight className="size-3.5" />
            </Link>
            <Link to="/create" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-xs font-semibold">
              <PlusCircle className="size-3.5" /> Create
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Quick actions */}
      <div className="mt-5 grid grid-cols-4 gap-2">
        {quickActions.map((a, i) => (
          <motion.div key={a.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={a.to} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl glass active:scale-95 transition">
              <div className="size-10 rounded-xl grid place-items-center text-background" style={{ background: a.tint }}>
                <a.icon className="size-5" />
              </div>
              <span className="text-[11px] font-medium">{a.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Search + Sort row */}
      <div className="mt-5 flex items-center gap-2">
        <AnimatePresence initial={false} mode="wait">
          {searchOpen ? (
            <motion.label key="s" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "100%" }} exit={{ opacity: 0, width: 0 }}
              className="flex-1 flex items-center gap-2 px-3 py-2 rounded-2xl glass">
              <SearchIcon className="size-4 text-muted-foreground" />
              <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search polls…"
                className="flex-1 bg-transparent outline-none text-sm min-w-0" />
              <button onClick={() => { setSearch(""); setSearchOpen(false); }} className="text-muted-foreground"><X className="size-4" /></button>
            </motion.label>
          ) : (
            <motion.button key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(true)}
              className="flex-1 flex items-center gap-2 px-3 py-2 rounded-2xl glass text-sm text-muted-foreground">
              <SearchIcon className="size-4" /> Search polls, topics…
            </motion.button>
          )}
        </AnimatePresence>
        <div className="relative">
          <button onClick={() => setSortOpen((v) => !v)}
            className="size-10 grid place-items-center rounded-2xl glass active:scale-95">
            <ArrowUpDown className="size-4" />
          </button>
          <AnimatePresence>
            {sortOpen && (
              <motion.div initial={{ opacity: 0, y: -6, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.95 }}
                className="absolute right-0 top-12 z-30 w-44 p-1.5 rounded-2xl glass-strong">
                {sortOptions.map((o) => (
                  <button key={o.key} onClick={() => { setSort(o.key); setSortOpen(false); }}
                    className={`w-full text-left text-sm px-3 py-2 rounded-xl ${sort === o.key ? "bg-ember text-background font-semibold" : "hover:bg-white/60"}`}>
                    {o.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-3 flex gap-2 overflow-x-auto hide-scroll -mx-1 px-1">
        {categories.map((c, i) => {
          const active = c.key === category;
          return (
            <motion.button key={c.key} onClick={() => setCategory(c.key)}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              whileTap={{ scale: 0.94 }}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${active ? "bg-foreground text-background border-foreground shadow-md" : "glass border-white/60 text-foreground"
                }`}>
              <span>{c.emoji}</span> {c.label}
            </motion.button>
          );
        })}
      </div>

      {/* Active filter chip */}
      {(category !== "all" || search) && (
        <div className="mt-3 flex items-center gap-2 text-[11px]">
          <Filter className="size-3 text-muted-foreground" />
          <span className="text-muted-foreground">Showing {filtered.length} of {polls.length}</span>
          <button onClick={() => { setCategory("all"); setSearch(""); }}
            className="ml-auto px-2 py-0.5 rounded-full bg-ember/10 text-ember font-semibold">Clear</button>
        </div>
      )}

      {/* Daily challenge */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="mt-5 relative overflow-hidden p-4 rounded-3xl glass-strong">
        <div className="liquid-blob absolute -right-6 -top-6 size-28 rounded-full" style={{ background: "var(--color-ember)", opacity: 0.4 }} />
        <div className="relative flex items-center gap-3">
          <div className="size-12 rounded-2xl grid place-items-center bg-ember text-background"><Flame className="size-6" /></div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-ember font-bold">Daily challenge</div>
            <div className="font-semibold text-sm truncate">Vote on 3 polls — earn a streak badge</div>
            <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "66%" }} transition={{ duration: 0.9 }}
                className="h-full rounded-full" style={{ background: "linear-gradient(90deg, var(--color-ember), oklch(0.55 0.22 36))" }} />
            </div>
            <div className="mt-1 text-[10px] text-muted-foreground">2 of 3 completed · +20 XP remaining</div>
          </div>
        </div>
      </motion.div>

      {/* Trending */}
      <div className="mt-6 flex items-center justify-between">
        <h3 className="text-base font-semibold flex items-center gap-2"><TrendingUp className="size-4 text-ember" /> {category === "all" ? "Trending now" : categories.find(c => c.key === category)?.label}</h3>
        <Link to="/create" className="text-xs font-medium text-ember">+ New poll</Link>
      </div>

      <div className="mt-3 space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-3xl glass p-8 text-center">
            <div className="text-3xl">🗳️</div>
            <div className="mt-2 font-semibold">Nothing here yet</div>
            <div className="text-xs text-muted-foreground">Try a different filter or create one.</div>
          </div>
        )}
        {filtered.map((p: any, i: number) => (
          <motion.div key={p.id}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.25) }}
            className="p-4 rounded-3xl glass">
            <Link to="/poll/$id" params={{ id: p.id }} className="block">
              <div className="flex items-start gap-3">
                <div className="size-12 rounded-2xl bg-ember-soft grid place-items-center text-xl shrink-0">{p.cover_emoji ?? "🗳️"}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="px-2 py-0.5 rounded-full bg-white/60">{p.category ?? "General"}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="size-3" /> {new Date(p.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-1 font-semibold truncate">{p.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{p.option_count ?? 0} options · {p.vote_count ?? 0} votes</div>
                </div>
              </div>
            </Link>
            <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
              <button onClick={() => setLiked((s) => ({ ...s, [p.id]: !s[p.id] }))}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full transition ${liked[p.id] ? "bg-ember/15 text-ember" : "hover:bg-white/60"}`}>
                <Heart className={`size-3.5 ${liked[p.id] ? "fill-current" : ""}`} /> {(p.vote_count ?? 0) + (liked[p.id] ? 1 : 0)}
              </button>
              <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-white/60">
                <MessageCircle className="size-3.5" /> {Math.floor((p.vote_count ?? 0) / 2)}
              </button>
              <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-white/60">
                <Share2 className="size-3.5" /> Share
              </button>
              <button onClick={() => setSaved((s) => ({ ...s, [p.id]: !s[p.id] }))}
                className={`ml-auto size-7 grid place-items-center rounded-full transition ${saved[p.id] ? "bg-ember text-background" : "hover:bg-white/60"}`}>
                <Bookmark className={`size-3.5 ${saved[p.id] ? "fill-current" : ""}`} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live activity */}
      <div className="mt-6">
        <h3 className="text-base font-semibold flex items-center gap-2"><Zap className="size-4 text-ember" /> Live activity</h3>
        <div className="mt-3 rounded-3xl glass overflow-hidden divide-y divide-white/40">
          {liveActivity.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 px-4 py-3">
              <div className="size-9 rounded-full bg-ember-soft grid place-items-center text-ember font-bold text-xs">
                {a.who[0]}
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <span className="font-semibold">{a.who}</span>{" "}
                <span className="text-muted-foreground">{a.action}</span>{" "}
                <span className="font-medium">{a.target}</span>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{a.t}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="mt-6">
        <h3 className="text-base font-semibold flex items-center gap-2"><Trophy className="size-4 text-ember" /> Top voters this week</h3>
        <div className="mt-3 space-y-2">
          {leaderboard.map((u, i) => (
            <motion.div key={u.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 p-3 rounded-2xl glass">
              <div className="text-xl w-6 text-center">{u.badge}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{u.name}</div>
                <div className="text-[11px] text-muted-foreground">{u.votes.toLocaleString()} votes</div>
              </div>
              <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${100 - i * 18}%` }} transition={{ duration: 0.7 }}
                  className="h-full bg-ember rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
        className="my-6 relative overflow-hidden p-5 rounded-3xl text-background"
        style={{ background: "linear-gradient(135deg, var(--color-ember), oklch(0.55 0.22 36))" }}>
        <Sparkles className="absolute right-3 top-3 size-5 opacity-60" />
        <div className="flex items-center gap-3">
          <Users className="size-8" />
          <div className="flex-1">
            <div className="font-bold">Invite friends</div>
            <div className="text-xs text-white/85">Polls are more fun with your crew.</div>
          </div>
          <button className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur text-xs font-semibold">Share</button>
        </div>
      </motion.div>
    </AppShell>
  );
}
