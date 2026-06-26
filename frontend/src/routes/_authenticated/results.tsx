import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/mobile/AppShell";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  BarChart3, Users, Vote, TrendingUp, Award, Download, Share2,
  Eye, EyeOff, Search, ChevronDown, ChevronUp, Sparkles, PlusCircle,
  Activity, Clock,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/results")({ component: Results });

type Tab = "active" | "closed" | "drafts";

function Results() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("active");
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  const { data = [] } = useQuery({
    queryKey: ["results", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("polls")
        .select("*, poll_options(id, label), votes(id, option_id)")
        .eq("created_by", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  const totalVotes = (data ?? []).reduce((a: number, p: any) => a + (p.votes?.length ?? 0), 0);
  const bestPoll = useMemo(() => [...(data ?? [])].sort((a: any, b: any) => (b.votes?.length ?? 0) - (a.votes?.length ?? 0))[0], [data]);
  const avg = data?.length ? Math.round(totalVotes / data.length) : 0;

  const filtered = useMemo(() => {
    let list = [...(data ?? [])];
    if (q.trim()) list = list.filter((p: any) => p.title.toLowerCase().includes(q.toLowerCase()));
    // simple tab semantics: "closed" = older than 14d, "drafts" = 0 options
    if (tab === "closed") list = list.filter((p: any) => Date.now() - new Date(p.created_at).getTime() > 14 * 86400000);
    else if (tab === "drafts") list = list.filter((p: any) => (p.poll_options?.length ?? 0) === 0);
    else list = list.filter((p: any) => (p.poll_options?.length ?? 0) > 0 && Date.now() - new Date(p.created_at).getTime() <= 14 * 86400000);
    return list;
  }, [data, q, tab]);

  const exportCSV = () => {
    const rows = ["title,option,votes"];
    (data ?? []).forEach((p: any) => {
      p.poll_options?.forEach((o: any) => {
        const c = p.votes?.filter((v: any) => v.option_id === o.id).length ?? 0;
        rows.push(`"${p.title}","${o.label}",${c}`);
      });
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "poll-results.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell title="Your Polls">
      {/* Hero summary */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        className="relative p-5 rounded-3xl text-background overflow-hidden"
        style={{ background: "linear-gradient(135deg, oklch(0.13 0 0), oklch(0.28 0 0))" }}>
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 5, repeat: Infinity }}
          className="absolute -top-10 -right-10 size-44 rounded-full"
          style={{ background: "radial-gradient(circle, var(--color-ember) 0%, transparent 65%)", opacity: 0.5 }} />
        <div className="relative z-10">
          <div className="text-[10px] uppercase tracking-widest text-white/70 inline-flex items-center gap-1">
            <Activity className="size-3" /> Performance
          </div>
          <div className="mt-1 text-3xl font-bold tabular-nums">{totalVotes.toLocaleString()}</div>
          <div className="text-xs text-white/80">Total votes across {data?.length ?? 0} polls</div>
          {bestPoll && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-[11px]">
              <Award className="size-3.5 text-ember" /> Top: <span className="font-semibold truncate max-w-[160px]">{bestPoll.title}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat icon={<BarChart3 className="size-4" />} label="Polls" value={data?.length ?? 0} />
        <Stat icon={<Vote className="size-4" />} label="Votes" value={totalVotes} />
        <Stat icon={<Users className="size-4" />} label="Avg" value={`${avg}/poll`} />
      </div>

      {/* Actions */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button onClick={exportCSV} className="p-3 rounded-2xl glass flex flex-col items-center gap-1 active:scale-95 transition">
          <Download className="size-4 text-ember" />
          <span className="text-[11px] font-medium">Export CSV</span>
        </button>
        <button className="p-3 rounded-2xl glass flex flex-col items-center gap-1 active:scale-95 transition">
          <Share2 className="size-4 text-ember" />
          <span className="text-[11px] font-medium">Share</span>
        </button>
        <Link to="/create" className="p-3 rounded-2xl glass flex flex-col items-center gap-1 active:scale-95 transition">
          <PlusCircle className="size-4 text-ember" />
          <span className="text-[11px] font-medium">New poll</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="mt-5 inline-flex p-1 rounded-full glass w-full">
        {(["active", "closed", "drafts"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 text-xs font-semibold py-2 rounded-full capitalize transition ${tab === t ? "bg-foreground text-background" : "text-muted-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Search */}
      <label className="mt-3 flex items-center gap-2 px-3 py-2 rounded-2xl glass">
        <Search className="size-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your pollsâ€¦"
          className="flex-1 bg-transparent outline-none text-sm min-w-0" />
      </label>

      {/* Poll list */}
      <div className="mt-4 space-y-3">
        <AnimatePresence>
          {filtered.map((p: any, i: number) => {
            const total = p.votes?.length ?? 0;
            const isOpen = expanded[p.id] ?? true;
            const isHidden = hidden[p.id];
            const winner = p.poll_options
              ?.map((o: any) => ({ o, c: p.votes?.filter((v: any) => v.option_id === o.id).length ?? 0 }))
              ?.sort((a: any, b: any) => b.c - a.c)[0];
            return (
              <motion.div key={p.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ delay: Math.min(i * 0.04, 0.2) }}
                className="p-4 rounded-3xl glass">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{p.cover_emoji ?? "ðŸ—³ï¸"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{p.title}</div>
                    <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                      <Clock className="size-3" /> {new Date(p.created_at).toLocaleDateString()} Â· {total} votes
                    </div>
                  </div>
                  <button onClick={() => setHidden((s) => ({ ...s, [p.id]: !s[p.id] }))}
                    className="size-8 grid place-items-center rounded-full hover:bg-white/60" title="Hide from public">
                    {isHidden ? <EyeOff className="size-4 text-muted-foreground" /> : <Eye className="size-4 text-muted-foreground" />}
                  </button>
                  <button onClick={() => setExpanded((s) => ({ ...s, [p.id]: !(s[p.id] ?? true) }))}
                    className="size-8 grid place-items-center rounded-full hover:bg-white/60">
                    {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </button>
                </div>

                {winner && total > 0 && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-ember/10 text-ember text-[10px] font-semibold">
                    <TrendingUp className="size-3" /> Leading: {winner.o.label} Â· {Math.round((winner.c / total) * 100)}%
                  </div>
                )}

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="mt-3 space-y-2">
                        {p.poll_options?.map((o: any) => {
                          const c = p.votes?.filter((v: any) => v.option_id === o.id).length ?? 0;
                          const pct = total ? Math.round((c / total) * 100) : 0;
                          return (
                            <div key={o.id}>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="truncate">{o.label}</span>
                                <span className="text-muted-foreground tabular-nums">{pct}% Â· {c}</span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7 }}
                                  className="h-full rounded-full" style={{ background: "linear-gradient(90deg, var(--color-ember), oklch(0.55 0.22 36))" }} />
                              </div>
                            </div>
                          );
                        })}
                        {(!p.poll_options || p.poll_options.length === 0) && (
                          <div className="text-xs text-muted-foreground italic">No options yet â€” finish this draft.</div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Link to="/poll/$id" params={{ id: p.id }}
                          className="flex-1 text-center text-xs font-semibold py-2 rounded-xl bg-foreground text-background">
                          View poll
                        </Link>
                        <button className="flex-1 text-xs font-semibold py-2 rounded-xl bg-white/60 inline-flex items-center justify-center gap-1">
                          <Share2 className="size-3.5" /> Share
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-12 rounded-3xl glass">
            <Sparkles className="size-6 mx-auto text-ember" />
            <div className="mt-2 text-sm font-semibold">Nothing in â€œ{tab}â€</div>
            <div className="text-xs text-muted-foreground">Create a poll to see results here.</div>
            <Link to="/create" className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-ember text-background text-xs font-semibold">
              <PlusCircle className="size-3.5" /> New poll
            </Link>
          </div>
        )}
      </div>

      <div className="h-4" />
    </AppShell>
  );
}

function Stat({ icon, label, value }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-2xl glass">
      <div className="text-ember">{icon}</div>
      <div className="mt-1 text-lg font-bold tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
    </motion.div>
  );
}



