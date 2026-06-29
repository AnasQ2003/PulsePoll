import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { AppShell } from "@/components/mobile/AppShell";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import {
  Search, Sparkles, TrendingUp, Flame, Clock, Filter,
  LayoutGrid, List as ListIcon, X, Hash, Star, Globe,
} from "lucide-react";

type DiscoverSearchSchema = {
  q?: string;
};

export const Route = createFileRoute("/_authenticated/discover")({
  validateSearch: (search: Record<string, unknown>): DiscoverSearchSchema => {
    return {
      q: (search.q as string) || undefined,
    };
  },
  component: Discover,
});

const topics = [
  { key: "all", label: "All", emoji: "🌍" },
  { key: "trending", label: "Trending", emoji: "🔥" },
  { key: "fresh", label: "Fresh", emoji: "🌱" },
  { key: "tech", label: "Tech", emoji: "💻" },
  { key: "culture", label: "Culture", emoji: "🎭" },
  { key: "food", label: "Food", emoji: "🍜" },
  { key: "sports", label: "Sports", emoji: "⚽" },
  { key: "music", label: "Music", emoji: "🎧" },
  { key: "gaming", label: "Gaming", emoji: "🎮" },
];

const trendingTags = ["#wwdc26", "#ramen", "#remoteWork", "#indieGames", "#f1", "#lofi", "#kdrama", "#travel2026"];

const spotlights = [
  { title: "Community vote", subtitle: "Help shape next month's theme", emoji: "🌈", grad: "linear-gradient(135deg, oklch(0.7 0.2 320), oklch(0.7 0.2 36))" },
  { title: "Weekly digest", subtitle: "Top 10 polls of the week", emoji: "📰", grad: "linear-gradient(135deg, oklch(0.55 0.18 250), oklch(0.7 0.2 200))" },
  { title: "Creator spotlight", subtitle: "Meet @priya – 50+ polls", emoji: "🌟", grad: "linear-gradient(135deg, oklch(0.6 0.22 36), oklch(0.5 0.2 20))" },
];

function Discover() {
  const searchParams = Route.useSearch();
  const [q, setQ] = useState(searchParams.q || "");
  const [topic, setTopic] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (searchParams.q !== undefined) {
      setQ(searchParams.q);
    }
  }, [searchParams.q]);

  const { data: polls = [] } = useQuery({
    queryKey: ["polls", "discover"],
    queryFn: async () => {
      return await apiRequest<any[]>("/polls");
    },
  });

  const filtered = useMemo(() => {
    let list = [...polls];
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((p: any) => p.title?.toLowerCase().includes(s));
    }
    if (topic !== "all") {
      if (topic === "trending") list = list.filter((p: any) => (p.votes?.length ?? 0) >= 1).sort((a:any,b:any)=>(b.votes?.length??0)-(a.votes?.length??0));
      else if (topic === "fresh") list = list.slice(0, 12);
      else list = list.filter((p: any) => (p.category ?? "").toLowerCase() === topic);
    }
    return list;
  }, [polls, q, topic]);

  return (
    <AppShell title="Discover">
      {/* Search */}
      <label className="flex items-center gap-2 px-4 py-3 rounded-2xl glass inner-glow">
        <Search className="size-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search polls, topics, creators…"
          className="flex-1 bg-transparent outline-none text-sm min-w-0" />
        {q && <button onClick={() => setQ("")}><X className="size-4 text-muted-foreground" /></button>}
      </label>

      {/* Spotlights */}
      <div className="mt-4 -mx-1 px-1 flex gap-3 overflow-x-auto hide-scroll">
        {spotlights.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
            className="shrink-0 w-64 p-4 rounded-3xl text-background relative overflow-hidden inner-glow"
            style={{ background: s.grad }}>
            <div className="absolute -right-4 -top-2 text-6xl opacity-30">{s.emoji}</div>
            <div className="text-[10px] uppercase tracking-widest text-white/80">Featured</div>
            <div className="mt-1 font-bold">{s.title}</div>
            <div className="text-xs text-white/85">{s.subtitle}</div>
            <button onClick={() => toast.success(`Viewing: ${s.title} ✨`)}
              className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-[11px] font-semibold active:bg-white/40 transition">
              <Sparkles className="size-3" /> Open
            </button>
          </motion.div>
        ))}
      </div>

      {/* Topics */}
      <div className="mt-4 flex gap-2 overflow-x-auto hide-scroll -mx-1 px-1">
        {topics.map((t, i) => {
          const active = t.key === topic;
          return (
            <motion.button key={t.key} onClick={() => setTopic(t.key)}
              whileTap={{ scale: 0.94 }}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
                active ? "bg-foreground text-background border-foreground shadow-md" : "glass inner-glow border-white/60"
              }`}>
              <span>{t.emoji}</span> {t.label}
            </motion.button>
          );
        })}
      </div>

      {/* Trending tags */}
      <div className="mt-4 p-4 rounded-3xl glass inner-glow">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Hash className="size-4 text-ember" /> Trending tags
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {trendingTags.map((tag) => (
            <button key={tag} onClick={() => setQ(tag.replace("#", ""))}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white/60 hover:bg-ember hover:text-background transition">
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* View toggle */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-semibold">
          <Globe className="size-4 text-ember" /> {filtered.length} results
        </div>
        <div className="inline-flex p-0.5 rounded-full glass inner-glow">
          <button onClick={() => setView("grid")}
            className={`size-7 grid place-items-center rounded-full transition ${view === "grid" ? "bg-foreground text-background" : ""}`}>
            <LayoutGrid className="size-3.5" />
          </button>
          <button onClick={() => setView("list")}
            className={`size-7 grid place-items-center rounded-full transition ${view === "list" ? "bg-foreground text-background" : ""}`}>
            <ListIcon className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {view === "grid" ? (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mt-3 grid grid-cols-2 gap-3">
            {filtered.map((p: any, i: number) => (
              <motion.div key={p.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(i * 0.03, 0.2) }}>
                <Link to="/poll/$id" params={{ id: p.id }}
                  className="block p-4 rounded-3xl glass inner-glow h-full active:scale-[0.98] transition">
                  <div className="flex items-start justify-between">
                    <div className="text-2xl">{p.cover_emoji ?? "🗳️"}</div>
                    {(p.votes?.length ?? 0) > 1 && <Flame className="size-3.5 text-ember" />}
                  </div>
                  <div className="mt-2 font-semibold text-sm leading-tight line-clamp-2">{p.title}</div>
                  <div className="mt-2 text-[10px] text-muted-foreground inline-flex items-center gap-1">
                    <Clock className="size-3" /> {new Date(p.created_at).toLocaleDateString()}
                  </div>
                  <div className="mt-1 text-[10px] text-muted-foreground">{p.votes?.length ?? 0} votes · {p.poll_options?.length ?? 0} options</div>
                  <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (p.votes?.length ?? 0) * 10)}%` }}
                      transition={{ duration: 0.6 }} className="h-full bg-ember" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mt-3 space-y-2">
            {filtered.map((p: any, i: number) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.03, 0.2) }}>
                <div className="flex items-center gap-3 p-3 rounded-2xl glass inner-glow">
                  <Link to="/poll/$id" params={{ id: p.id }} className="flex-1 flex items-center gap-3 min-w-0">
                    <div className="size-11 rounded-2xl bg-ember-soft grid place-items-center text-xl shrink-0">{p.cover_emoji ?? "🗳️"}</div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{p.title}</div>
                      <div className="text-[10px] text-muted-foreground">{p.votes?.length ?? 0} votes · {p.category ?? "General"}</div>
                    </div>
                  </Link>
                  <motion.button whileTap={{ scale: 0.8 }}
                    onClick={(e) => { e.stopPropagation(); toast.success("Subscribed! 🔔"); }}
                    className="size-8 grid place-items-center rounded-full hover:bg-white/60 transition shrink-0">
                    <Star className="size-4 text-muted-foreground" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="mt-6 text-center text-sm text-muted-foreground py-12 rounded-3xl glass inner-glow">
          <Filter className="size-6 mx-auto text-muted-foreground" />
          <div className="mt-2">No polls match your search.</div>
          <button onClick={() => { setQ(""); setTopic("all"); }} className="mt-3 text-xs text-ember font-semibold">Reset filters</button>
        </div>
      )}

      <div className="h-4" />
    </AppShell>
  );
}



