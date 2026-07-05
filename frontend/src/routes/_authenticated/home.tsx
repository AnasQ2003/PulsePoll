import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/mobile/AppShell";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
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

const sortOptions = [
  { key: "recent", label: "Most recent" },
  { key: "popular", label: "Most votes" },
  { key: "az", label: "A → Z" },
] as const;

const RANK_BADGES = ["🥇", "🥈", "🥉", "4", "5", "6", "7", "8", "9", "10"];

function getRelativeTime(dateStr: string) {
  const elapsed = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(elapsed / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

function HomePage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
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

  const { data: leaderboard = [] } = useQuery<any[]>({
    queryKey: ["leaderboard"],
    queryFn: () => apiRequest<any[]>("/stats/leaderboard"),
  });

  const { data: activityFeed = [] } = useQuery<any[]>({
    queryKey: ["activity"],
    queryFn: () => apiRequest<any[]>("/stats/activity"),
    refetchInterval: 30_000, // refresh every 30s
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
    "there";

  function handleShare(poll: any) {
    const url = `${window.location.origin}/poll/${poll.id}`;
    if (navigator.share) {
      navigator.share({ title: poll.title, url }).catch(() => { });
    } else {
      navigator.clipboard?.writeText(url);
      toast.success("Poll link copied! 🔗");
    }
  }

  function handleComment(poll: any) {
    navigate({ to: "/poll/$id", params: { id: poll.id } });
  }

  return (
    <AppShell title="">
      {/* Greeting Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <div className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">
          {new Date().getHours() < 12 ? "Good morning to anas" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening"}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Hi, {firstName}</h1>
      </motion.div>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-5 text-background inner-glow"
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
          <motion.div key={a.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.9 }}>
            <Link to={a.to} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl glass inner-glow active:scale-95 transition">
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
      <motion.button onClick={() => toast.success("Challenge accepted! Vote on 1 more poll to complete today's streak! 🔥")}
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        whileTap={{ scale: 0.97 }}
        className="mt-5 w-full relative overflow-hidden p-4 rounded-3xl glass-strong inner-glow text-left">
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
          <ChevronRight className="size-4 text-muted-foreground shrink-0" />
        </div>
      </motion.button>

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
            className="p-4 rounded-3xl glass inner-glow">
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

            {/* Action bar */}
            <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
              {/* Like / heart — optimistic UI */}
              <button
                onClick={() => setLiked((s) => ({ ...s, [p.id]: !s[p.id] }))}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full transition ${liked[p.id] ? "bg-ember/15 text-ember" : "hover:bg-white/60"}`}
                aria-label="Like this poll"
              >
                <Heart className={`size-3.5 ${liked[p.id] ? "fill-current" : ""}`} />
                {(p.vote_count ?? 0) + (liked[p.id] ? 1 : 0)}
              </button>

              {/* Comment — navigates to poll detail */}
              <button
                onClick={() => handleComment(p)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-white/60 transition"
                aria-label="Comment on this poll"
              >
                <MessageCircle className="size-3.5" />
                {p.vote_count ?? 0}
              </button>

              {/* Share — native share or copy link */}
              <button
                onClick={() => handleShare(p)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-white/60 transition"
                aria-label="Share this poll"
              >
                <Share2 className="size-3.5" /> Share
              </button>

              {/* Bookmark */}
              <button
                onClick={() => {
                  setSaved((s) => ({ ...s, [p.id]: !s[p.id] }));
                  toast.success(saved[p.id] ? "Removed from saved" : "Poll saved! 🔖");
                }}
                className={`ml-auto size-7 grid place-items-center rounded-full transition ${saved[p.id] ? "bg-ember text-background" : "hover:bg-white/60"}`}
                aria-label="Save this poll"
              >
                <Bookmark className={`size-3.5 ${saved[p.id] ? "fill-current" : ""}`} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live activity — real data from backend */}
      <div className="mt-6">
        <h3 className="text-base font-semibold flex items-center gap-2"><Zap className="size-4 text-ember" /> Live activity</h3>
        <div className="mt-3 rounded-3xl glass inner-glow overflow-hidden divide-y divide-white/40">
          {activityFeed.length === 0 && (
            <div className="px-4 py-5 text-center text-xs text-muted-foreground">No recent activity yet. Start voting!</div>
          )}
          {activityFeed.slice(0, 8).map((a: any, i: number) => (
            <motion.button key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate({ to: "/poll/$id", params: { id: a.poll_id } })}
              className="w-full flex items-center gap-3 px-4 py-3 active:bg-white/30 transition text-left">
              <div className="size-9 rounded-full bg-ember-soft grid place-items-center text-ember font-bold text-xs">
                {(a.who ?? "?")[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <span className="font-semibold">{a.who}</span>{" "}
                <span className="text-muted-foreground">{a.action}</span>{" "}
                <span className="font-medium truncate">"{a.poll_title}"</span>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{getRelativeTime(a.created_at)}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Leaderboard — real data from backend */}
      <div className="mt-6">
        <h3 className="text-base font-semibold flex items-center gap-2"><Trophy className="size-4 text-ember" /> Top voters this week</h3>
        <div className="mt-3 space-y-2">
          {leaderboard.length === 0 && (
            <div className="rounded-3xl glass p-6 text-center text-xs text-muted-foreground">
              No votes yet — be the first on the leaderboard! 🏆
            </div>
          )}
          {leaderboard.slice(0, 5).map((u: any, i: number) => (
            <motion.button key={u.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => toast.info(`${u.display_name} has cast ${Number(u.vote_count).toLocaleString()} vote${u.vote_count === 1 ? "" : "s"}! 🏆`)}
              className="w-full flex items-center gap-3 p-3 rounded-2xl glass inner-glow active:scale-95 transition text-left">
              <div className="text-xl w-6 text-center">{RANK_BADGES[i] ?? String(i + 1)}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{u.display_name}</div>
                <div className="text-[11px] text-muted-foreground">@{u.username} · {Number(u.vote_count).toLocaleString()} votes</div>
              </div>
              <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: leaderboard[0]?.vote_count > 0 ? `${(u.vote_count / leaderboard[0].vote_count) * 100}%` : "0%" }}
                  transition={{ duration: 0.7 }}
                  className="h-full bg-ember rounded-full"
                />
              </div>
            </motion.button>
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
          <motion.button whileTap={{ scale: 0.92 }}
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "PulsePoll", url: window.location.origin }).catch(() => { });
              } else {
                navigator.clipboard?.writeText(window.location.origin);
                toast.success("App link copied! Share it with your crew 🎉");
              }
            }}
            className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur text-xs font-semibold active:bg-white/30">
            Share
          </motion.button>
        </div>
      </motion.div>
    </AppShell>
  );
}
