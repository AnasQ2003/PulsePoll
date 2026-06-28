import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Check, Users, Share2, Trophy, BarChart3, PieChart as PieIcon, TrendingUp, Sparkles, Clock } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/mobile/AppShell";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/poll/$id")({ component: PollDetail });

const PALETTE = [
  "oklch(0.72 0.2 36)",
  "oklch(0.7 0.18 250)",
  "oklch(0.72 0.18 160)",
  "oklch(0.72 0.2 80)",
  "oklch(0.72 0.18 320)",
  "oklch(0.72 0.18 200)",
];

function PollDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [chartType, setChartType] = useState<"bar" | "pie" | "list">("bar");

  const { data } = useQuery({
    queryKey: ["poll", id],
    queryFn: async () => {
      return await apiRequest<any>(`/polls/${id}`);
    },
  });

  const myVote = data?.votes.find((v: any) => v.user_id === user?.id);
  const total = data?.votes.length ?? 0;

  const stats = useMemo(() => {
    if (!data) return { rows: [], leader: null as any, runnerUp: null as any };
    const rows = data.options.map((o: any, i: number) => {
      const count = data.votes.filter((v: any) => v.option_id === o.id).length;
      const pct = total ? Math.round((count / total) * 100) : 0;
      return { id: o.id, name: o.label, value: count, pct, color: PALETTE[i % PALETTE.length] };
    });
    const sorted = [...rows].sort((a, b) => b.value - a.value);
    return { rows, leader: sorted[0] ?? null, runnerUp: sorted[1] ?? null };
  }, [data, total]);

  async function vote() {
    if (!selected || !user) return;
    try {
      await apiRequest(`/votes`, {
        method: "POST",
        body: JSON.stringify({ poll_id: id, option_id: selected }),
      });
      toast.success("Vote recorded ✓");
      qc.invalidateQueries({ queryKey: ["poll", id] });
      qc.invalidateQueries({ queryKey: ["polls"] });
    } catch (err: any) {
      toast.error(err.message ?? "Failed to register vote");
    }
  }

  const showResults = !!myVote;
  const gap = stats.leader && stats.runnerUp ? stats.leader.pct - stats.runnerUp.pct : 0;

  return (
    <AppShell title="Poll">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-5 text-background relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, oklch(0.13 0 0), oklch(0.28 0 0))" }}>
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 6, repeat: Infinity }}
          className="absolute -top-16 -right-16 size-56 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.78 0.2 36) 0%, transparent 70%)" }} />
        <div className="relative text-4xl">{data?.poll?.cover_emoji ?? "ðŸ—³ï¸"}</div>
        <h2 className="relative mt-2 text-xl font-bold">{data?.poll?.title}</h2>
        {data?.poll?.description && <p className="relative mt-2 text-sm text-white/70">{data.poll.description}</p>}
        <div className="relative mt-4 flex items-center gap-3 text-xs text-white/70">
          <span className="inline-flex items-center gap-1"><Users className="size-3.5" /> {total} votes</span>
          <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> Live</span>
          <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }}
            className="inline-flex items-center gap-1 ml-auto px-2.5 py-1 rounded-full bg-white/15">
            <Share2 className="size-3.5" /> Share
          </button>
        </div>
      </motion.div>

      <div className="mt-5 space-y-2.5">
        {data?.options.map((opt: any, i: number) => {
          const row = stats.rows[i];
          const isSelected = selected === opt.id;
          const isMine = myVote?.option_id === opt.id;
          const isLeader = showResults && stats.leader?.id === opt.id && total > 0;
          return (
            <motion.button
              key={opt.id}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.98 }}
              disabled={!!myVote}
              onClick={() => setSelected(opt.id)}
              className={`relative w-full p-4 rounded-2xl text-left overflow-hidden border transition ${
                isMine ? "border-ember bg-ember-soft" : isSelected ? "border-ember bg-ember-soft" : isLeader ? "border-transparent" : "border-border bg-card"
              }`}
              style={isLeader ? { background: "linear-gradient(135deg, oklch(0.96 0.05 80), oklch(0.94 0.08 36))", boxShadow: `0 8px 24px -10px ${row.color}` } : {}}
            >
              {showResults && (
                <motion.div initial={{ width: 0 }} animate={{ width: `${row.pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0"
                  style={{ background: `linear-gradient(90deg, ${row.color}33, ${row.color}11)` }} />
              )}
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`size-5 rounded-full border-2 grid place-items-center shrink-0 ${isMine || isSelected ? "border-ember bg-ember" : "border-border"}`}>
                    {(isMine || isSelected) && <Check className="size-3 text-white" />}
                  </div>
                  <span className="font-medium truncate">{opt.label}</span>
                  {isLeader && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ background: row.color }}>
                      <Trophy className="size-2.5" /> LEADING
                    </span>
                  )}
                </div>
                {showResults && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">{row.value}</span>
                    <span className="text-sm font-bold" style={{ color: row.color }}>{row.pct}%</span>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {!myVote && (
          <motion.button
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
            whileTap={{ scale: 0.97 }} onClick={vote} disabled={!selected}
            className="mt-6 w-full py-3.5 rounded-2xl font-semibold text-background glow-orange disabled:opacity-40 disabled:shadow-none"
            style={{ background: "linear-gradient(135deg, var(--color-ember), oklch(0.55 0.22 36))" }}>
            Cast my vote
          </motion.button>
        )}
      </AnimatePresence>

      {showResults && total > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Total votes", value: total, icon: Users, glow: "oklch(0.75 0.18 250)" },
              { label: "Leader", value: `${stats.leader?.pct ?? 0}%`, icon: Trophy, glow: "oklch(0.78 0.2 80)" },
              { label: "Gap", value: `${gap}%`, icon: TrendingUp, glow: "oklch(0.75 0.2 36)" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl glass p-3 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 size-16 rounded-full blur-2xl opacity-60" style={{ background: s.glow }} />
                <s.icon className="size-3.5 text-muted-foreground" />
                <div className="mt-1 text-lg font-bold font-display">{s.value}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="rounded-3xl glass p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-[var(--color-ember)]" />
                <div className="text-sm font-semibold">Live breakdown</div>
              </div>
              <div className="flex items-center gap-1 p-0.5 rounded-full bg-white/40">
                {([
                  { k: "bar", icon: BarChart3 },
                  { k: "pie", icon: PieIcon },
                ] as const).map((c) => (
                  <button key={c.k} onClick={() => setChartType(c.k)}
                    className={`size-7 grid place-items-center rounded-full transition ${chartType === c.k ? "bg-foreground text-background" : "text-muted-foreground"}`}>
                    <c.icon className="size-3.5" />
                  </button>
                ))}
              </div>
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "bar" ? (
                  <BarChart data={stats.rows} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {stats.rows.map((r: any, i: number) => <Cell key={i} fill={r.color} />)}
                    </Bar>
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie data={stats.rows} dataKey="value" innerRadius={40} outerRadius={70} paddingAngle={3}>
                      {stats.rows.map((r: any, i: number) => <Cell key={i} fill={r.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: "none" }} />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-1.5">
              {stats.rows.map((r: any) => (
                <div key={r.id} className="flex items-center gap-1.5 text-[11px]">
                  <span className="size-2.5 rounded-full" style={{ background: r.color }} />
                  <span className="truncate flex-1">{r.name}</span>
                  <span className="font-semibold">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {stats.leader && stats.runnerUp && stats.runnerUp.value > 0 && (
            <div className="rounded-3xl glass p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="size-4 text-[var(--color-ember)]" />
                <div className="text-sm font-semibold">Head-to-head</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 text-right">
                  <div className="text-[11px] text-muted-foreground truncate">{stats.leader.name}</div>
                  <div className="text-2xl font-bold font-display" style={{ color: stats.leader.color }}>{stats.leader.pct}%</div>
                </div>
                <div className="text-xs font-bold text-muted-foreground">VS</div>
                <div className="flex-1">
                  <div className="text-[11px] text-muted-foreground truncate">{stats.runnerUp.name}</div>
                  <div className="text-2xl font-bold font-display" style={{ color: stats.runnerUp.color }}>{stats.runnerUp.pct}%</div>
                </div>
              </div>
              <div className="mt-3 h-2 rounded-full overflow-hidden flex">
                <div style={{ width: `${stats.leader.pct}%`, background: stats.leader.color }} />
                <div style={{ width: `${stats.runnerUp.pct}%`, background: stats.runnerUp.color }} />
                <div className="flex-1 bg-white/30" />
              </div>
              <div className="mt-2 text-[11px] text-muted-foreground text-center">
                <span className="font-semibold text-foreground">{stats.leader.name}</span> leads by <span className="font-semibold text-[var(--color-ember)]">{gap}%</span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AppShell>
  );
}

