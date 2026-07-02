import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/mobile/AppShell";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import {
  BarChart3, Users, Vote, TrendingUp, Award, Download, Share2,
  Eye, EyeOff, Search, ChevronDown, ChevronUp, Sparkles, PlusCircle,
  Activity, Clock, FileText,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/results")({ component: Results });

type Tab = "active" | "closed" | "drafts";

const PALETTE = [
  "#f97316", "#3b82f6", "#22c55e", "#a855f7",
  "#ec4899", "#14b8a6", "#f59e0b", "#6366f1",
];

// ─── PDF Export ───────────────────────────────────────────────────────────────
async function exportAsPDF(polls: any[], totalVotes: number, avg: number) {
  const toastId = toast.loading("Generating detailed PDF report…");
  try {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    let y = 0;

    const addPage = () => { doc.addPage(); y = 20; };
    const checkY = (needed: number) => { if (y + needed > H - 20) addPage(); };

    // ── Cover Page ─────────────────────────────────────────────────────────
    // Background gradient rectangle
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, W, H, "F");

    // Orange accent blob (top-right)
    doc.setFillColor(249, 115, 22);
    doc.circle(W - 10, 10, 45, "F");
    doc.setFillColor(15, 15, 15);
    doc.circle(W - 10, 10, 38, "F");

    // Logo square
    doc.setFillColor(249, 115, 22);
    doc.roundedRect(14, 18, 16, 16, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("P", 22, 29, { align: "center" });

    // Title
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("PulsePoll", 35, 30);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 180, 180);
    doc.text("Detailed Analytics Report", 35, 38);

    // Divider
    doc.setDrawColor(249, 115, 22);
    doc.setLineWidth(0.8);
    doc.line(14, 46, W - 14, 46);

    // Summary stats
    y = 60;
    const stats = [
      { label: "Total Polls", value: String(polls.length) },
      { label: "Total Votes", value: totalVotes.toLocaleString() },
      { label: "Avg Votes / Poll", value: String(avg) },
      { label: "Generated", value: new Date().toLocaleDateString("en-US", { dateStyle: "medium" }) },
    ];

    stats.forEach((s, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const cx = col === 0 ? 14 : W / 2 + 4;
      const cy = y + row * 28;

      doc.setFillColor(30, 30, 30);
      doc.roundedRect(cx, cy, W / 2 - 18, 22, 5, 5, "F");
      doc.setDrawColor(60, 60, 60);
      doc.setLineWidth(0.3);
      doc.roundedRect(cx, cy, W / 2 - 18, 22, 5, 5, "S");

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(249, 115, 22);
      doc.text(s.value, cx + 8, cy + 12);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(140, 140, 140);
      doc.text(s.label, cx + 8, cy + 19);
    });

    // Footer on cover
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text("Confidential • PulsePoll Analytics", W / 2, H - 12, { align: "center" });

    // ── Per-Poll Pages ──────────────────────────────────────────────────────
    polls.forEach((p: any, pollIdx: number) => {
      doc.addPage();
      y = 16;

      // White background for poll pages
      doc.setFillColor(250, 250, 250);
      doc.rect(0, 0, W, H, "F");

      // Poll page header bar
      doc.setFillColor(15, 15, 15);
      doc.rect(0, 0, W, 14, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(180, 180, 180);
      doc.text(`Poll ${pollIdx + 1} of ${polls.length}`, 14, 9);
      doc.text("PulsePoll Analytics", W - 14, 9, { align: "right" });

      y = 22;

      // Poll title section
      doc.setFillColor(249, 115, 22, 0.08);
      doc.setFillColor(255, 247, 237);
      doc.roundedRect(10, y, W - 20, 28, 6, 6, "F");
      doc.setDrawColor(249, 115, 22);
      doc.setLineWidth(0.5);
      doc.line(10, y, 10, y + 28);

      const emoji = p.cover_emoji ?? "📊";
      doc.setFontSize(16);
      doc.text(emoji, 17, y + 12);

      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 15, 15);
      const titleLines = doc.splitTextToSize(p.title, W - 48);
      doc.text(titleLines, 30, y + 10);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      doc.text(
        `Category: ${p.category ?? "General"} · Created: ${new Date(p.created_at).toLocaleDateString()}`,
        30, y + titleLines.length > 1 ? y + 22 : y + 20
      );

      y += 36;

      // Stats row
      const total = p.votes?.length ?? 0;
      const opts = p.poll_options ?? [];
      const winnerOpt = opts
        .map((o: any) => ({ o, c: p.votes?.filter((v: any) => v.option_id === o.id).length ?? 0 }))
        .sort((a: any, b: any) => b.c - a.c)[0];

      const summaryStats = [
        { label: "Total Votes", value: total.toString(), color: "#f97316" },
        { label: "Options", value: opts.length.toString(), color: "#3b82f6" },
        { label: "Winner", value: winnerOpt ? `${Math.round(total ? (winnerOpt.c / total) * 100 : 0)}%` : "—", color: "#22c55e" },
      ];

      const boxW = (W - 26) / 3;
      summaryStats.forEach((s, i) => {
        const bx = 10 + i * (boxW + 3);

        // Box background
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(bx, y, boxW, 22, 4, 4, "F");
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.3);
        doc.roundedRect(bx, y, boxW, 22, 4, 4, "S");

        // Color top bar
        const [r, g, b] = hexToRgb(s.color);
        doc.setFillColor(r, g, b);
        doc.roundedRect(bx, y, boxW, 3, 2, 2, "F");

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(r, g, b);
        doc.text(s.value, bx + boxW / 2, y + 13, { align: "center" });

        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(120, 120, 120);
        doc.text(s.label, bx + boxW / 2, y + 19, { align: "center" });
      });

      y += 30;

      // Options breakdown header
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 15, 15);
      doc.text("Vote Breakdown", 10, y);

      if (winnerOpt) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(249, 115, 22);
        doc.text(`🏆 Leading: ${winnerOpt.o.label}`, W - 10, y, { align: "right" });
      }

      y += 8;

      // Draw bar chart for each option
      opts.forEach((o: any, oi: number) => {
        checkY(18);
        const count = p.votes?.filter((v: any) => v.option_id === o.id).length ?? 0;
        const pct = total ? (count / total) * 100 : 0;
        const color = PALETTE[oi % PALETTE.length];
        const [r, g, b] = hexToRgb(color);
        const barMaxW = W - 70;
        const barW = Math.max((pct / 100) * barMaxW, pct > 0 ? 2 : 0);

        // Option label
        doc.setFontSize(8.5);
        doc.setFont("helvetica", oi === 0 && total > 0 ? "bold" : "normal");
        doc.setTextColor(15, 15, 15);
        const labelStr = doc.splitTextToSize(o.label, 50)[0];
        doc.text(labelStr, 10, y + 4);

        // Bar track
        doc.setFillColor(235, 235, 235);
        doc.roundedRect(62, y - 1, barMaxW, 8, 3, 3, "F");

        // Bar fill
        if (barW > 0) {
          doc.setFillColor(r, g, b);
          doc.roundedRect(62, y - 1, barW, 8, 3, 3, "F");
        }

        // % and count
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(r, g, b);
        doc.text(`${Math.round(pct)}%`, 62 + barMaxW + 3, y + 4.5);

        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(140, 140, 140);
        doc.text(`${count} votes`, 62 + barMaxW + 14, y + 4.5);

        y += 14;
      });

      y += 4;

      // Pie chart (drawn with arcs)
      if (total > 0 && opts.length > 1) {
        checkY(60);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 15, 15);
        doc.text("Distribution Chart", 10, y);
        y += 6;

        const cx = 42;
        const cy2 = y + 26;
        const radius = 22;
        let startAngle = -Math.PI / 2;

        opts.forEach((o: any, oi: number) => {
          const count = p.votes?.filter((v: any) => v.option_id === o.id).length ?? 0;
          const pct = total ? count / total : 0;
          if (pct === 0) return;
          const angle = pct * 2 * Math.PI;
          const endAngle = startAngle + angle;
          const color = PALETTE[oi % PALETTE.length];
          const [r, g, b] = hexToRgb(color);

          // Draw filled arc segment using approximation
          doc.setFillColor(r, g, b);
          drawArcSegment(doc, cx, cy2, radius, startAngle, endAngle);
          startAngle = endAngle;
        });

        // Donut hole
        doc.setFillColor(250, 250, 250);
        doc.circle(cx, cy2, 10, "F");

        // Centre label
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 15, 15);
        doc.text(String(total), cx, cy2 + 1.5, { align: "center" });
        doc.setFontSize(5.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(120, 120, 120);
        doc.text("votes", cx, cy2 + 6, { align: "center" });

        // Legend
        const lgX = cx + radius + 10;
        let lgY = y + 4;
        opts.forEach((o: any, oi: number) => {
          const count = p.votes?.filter((v: any) => v.option_id === o.id).length ?? 0;
          const pct = total ? Math.round((count / total) * 100) : 0;
          const color = PALETTE[oi % PALETTE.length];
          const [r, g, b] = hexToRgb(color);

          doc.setFillColor(r, g, b);
          doc.roundedRect(lgX, lgY - 3, 5, 5, 1, 1, "F");

          doc.setFontSize(7.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(15, 15, 15);
          const lgLabel = doc.splitTextToSize(o.label, 55)[0];
          doc.text(lgLabel, lgX + 7, lgY + 0.5);

          doc.setFontSize(7);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(r, g, b);
          doc.text(`${pct}%`, lgX + 7, lgY + 6);

          lgY += 12;
        });

        y += 60;
      }

      // Insights box
      checkY(28);
      doc.setFillColor(255, 247, 237);
      doc.roundedRect(10, y, W - 20, 24, 5, 5, "F");
      doc.setDrawColor(249, 115, 22);
      doc.setLineWidth(0.3);
      doc.roundedRect(10, y, W - 20, 24, 5, 5, "S");

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(249, 115, 22);
      doc.text("💡 Key Insight", 16, y + 8);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const insight = total === 0
        ? "No votes have been cast on this poll yet."
        : winnerOpt
        ? `"${winnerOpt.o.label}" leads with ${Math.round((winnerOpt.c / total) * 100)}% of votes (${winnerOpt.c} out of ${total}).`
        : "Votes are currently tied across options.";
      const insightLines = doc.splitTextToSize(insight, W - 36);
      doc.text(insightLines, 16, y + 15);

      y += 30;

      // Page footer
      doc.setFontSize(7);
      doc.setTextColor(160, 160, 160);
      doc.text(
        `PulsePoll Analytics · ${new Date().toLocaleDateString()} · Page ${pollIdx + 2}`,
        W / 2, H - 8, { align: "center" }
      );
    });

    // ── Summary Page ───────────────────────────────────────────────────────
    doc.addPage();
    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, W, H, "F");

    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, W, 14, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 180, 180);
    doc.text("Summary & Comparison", 14, 9);
    doc.text("PulsePoll Analytics", W - 14, 9, { align: "right" });

    y = 22;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 15, 15);
    doc.text("All Polls — Performance Comparison", 10, y);
    y += 12;

    // Comparative bar for each poll (by vote count)
    const maxVotes = Math.max(...polls.map(p => p.votes?.length ?? 0), 1);
    polls.forEach((p: any, i: number) => {
      checkY(16);
      const total = p.votes?.length ?? 0;
      const pct = (total / maxVotes) * 100;
      const color = PALETTE[i % PALETTE.length];
      const [r, g, b] = hexToRgb(color);
      const barMaxW = W - 80;

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 15, 15);
      const label = doc.splitTextToSize(`${i + 1}. ${p.title}`, 48)[0];
      doc.text(label, 10, y + 4);

      doc.setFillColor(235, 235, 235);
      doc.roundedRect(60, y - 1, barMaxW, 8, 3, 3, "F");

      if (pct > 0) {
        doc.setFillColor(r, g, b);
        doc.roundedRect(60, y - 1, (pct / 100) * barMaxW, 8, 3, 3, "F");
      }

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(r, g, b);
      doc.text(`${total}`, 60 + barMaxW + 3, y + 4.5);

      y += 13;
    });

    // Page footer
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.text(
      `PulsePoll Analytics · ${new Date().toLocaleDateString()} · Page ${polls.length + 2}`,
      W / 2, H - 8, { align: "center" }
    );

    // Save
    const filename = `PulsePoll-Report-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
    toast.dismiss(toastId);
    toast.success("📊 Detailed PDF report downloaded!");
  } catch (err) {
    console.error(err);
    toast.dismiss(toastId);
    toast.error("Failed to generate PDF. Please try again.");
  }
}

/** Draw a filled pie slice using small triangle approximation */
function drawArcSegment(doc: any, cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const steps = Math.max(4, Math.ceil(Math.abs(endAngle - startAngle) * r));
  const pts: [number, number][] = [[cx, cy]];
  for (let i = 0; i <= steps; i++) {
    const a = startAngle + (endAngle - startAngle) * (i / steps);
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  // Draw using lines
  doc.lines(
    pts.slice(1).map((pt, i) => [pt[0] - pts[i][0], pt[1] - pts[i][1]]),
    pts[0][0], pts[0][1], [1, 1], "F"
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

// ─── Component ────────────────────────────────────────────────────────────────
function Results() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("active");
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const [exporting, setExporting] = useState(false);

  const { data = [] } = useQuery({
    queryKey: ["results", user?.id],
    queryFn: async () => {
      if (!user) return [];
      return await apiRequest<any[]>("/polls/mine");
    },
    enabled: !!user,
  });

  const totalVotes = (data ?? []).reduce((a: number, p: any) => a + (p.votes?.length ?? 0), 0);
  const bestPoll = useMemo(() => [...(data ?? [])].sort((a: any, b: any) => (b.votes?.length ?? 0) - (a.votes?.length ?? 0))[0], [data]);
  const avg = data?.length ? Math.round(totalVotes / data.length) : 0;

  const filtered = useMemo(() => {
    let list = [...(data ?? [])];
    if (q.trim()) list = list.filter((p: any) => p.title.toLowerCase().includes(q.toLowerCase()));
    if (tab === "closed") list = list.filter((p: any) => Date.now() - new Date(p.created_at).getTime() > 14 * 86400000);
    else if (tab === "drafts") list = list.filter((p: any) => (p.poll_options?.length ?? 0) === 0);
    else list = list.filter((p: any) => (p.poll_options?.length ?? 0) > 0 && Date.now() - new Date(p.created_at).getTime() <= 14 * 86400000);
    return list;
  }, [data, q, tab]);

  const shareAll = () => {
    if (navigator.share) {
      navigator.share({ title: "My PulsePoll Results", url: window.location.origin + "/results" }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.origin + "/results");
      toast.success("Profile results link copied! 🎉");
    }
  };

  const handleExportPDF = async () => {
    if (exporting) return;
    if ((data ?? []).length === 0) { toast.error("No polls to export yet."); return; }
    setExporting(true);
    await exportAsPDF(data ?? [], totalVotes, avg);
    setExporting(false);
  };

  return (
    <AppShell title="Your Polls">
      {/* Hero summary */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        className="relative p-5 rounded-3xl text-background overflow-hidden inner-glow"
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
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="p-3 rounded-2xl glass inner-glow flex flex-col items-center gap-1 active:scale-95 transition disabled:opacity-60"
        >
          {exporting ? (
            <div className="size-4 border-2 border-ember border-t-transparent rounded-full animate-spin" />
          ) : (
            <FileText className="size-4 text-ember" />
          )}
          <span className="text-[11px] font-medium">{exporting ? "Exporting…" : "Export PDF"}</span>
        </button>
        <button onClick={shareAll} className="p-3 rounded-2xl glass inner-glow flex flex-col items-center gap-1 active:scale-95 transition">
          <Share2 className="size-4 text-ember" />
          <span className="text-[11px] font-medium">Share</span>
        </button>
        <Link to="/create" className="p-3 rounded-2xl glass inner-glow flex flex-col items-center gap-1 active:scale-95 transition">
          <PlusCircle className="size-4 text-ember" />
          <span className="text-[11px] font-medium">New poll</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="mt-5 inline-flex p-1 rounded-full glass inner-glow w-full">
        {(["active", "closed", "drafts"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 text-xs font-semibold py-2 rounded-full capitalize transition ${tab === t ? "bg-foreground text-background" : "text-muted-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Search */}
      <label className="mt-3 flex items-center gap-2 px-3 py-2 rounded-2xl glass inner-glow">
        <Search className="size-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your polls…"
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
                className="p-4 rounded-3xl glass inner-glow">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{p.cover_emoji ?? "🗳️ "}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{p.title}</div>
                    <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                      <Clock className="size-3" /> {new Date(p.created_at).toLocaleDateString()} · {total} votes
                    </div>
                  </div>
                  <button onClick={() => setHidden((s) => ({ ...s, [p.id]: !s[p.id] }))}
                    className="size-8 grid place-items-center rounded-full hover:bg-white/60 transition" title={isHidden ? "Show" : "Hide"}>
                    {isHidden ? <EyeOff className="size-4 text-muted-foreground" /> : <Eye className="size-4 text-muted-foreground" />}
                  </button>
                  <button onClick={() => setExpanded((s) => ({ ...s, [p.id]: !(s[p.id] ?? true) }))}
                    className="size-8 grid place-items-center rounded-full hover:bg-white/60 transition">
                    {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </button>
                </div>

                {winner && total > 0 && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-ember/10 text-ember text-[10px] font-semibold">
                    <TrendingUp className="size-3" /> Leading: {winner.o.label} · {Math.round((winner.c / total) * 100)}%
                  </div>
                )}

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="mt-3 space-y-2">
                        {p.poll_options?.map((o: any, oi: number) => {
                          const c = p.votes?.filter((v: any) => v.option_id === o.id).length ?? 0;
                          const pct = total ? Math.round((c / total) * 100) : 0;
                          const color = PALETTE[oi % PALETTE.length];
                          return (
                            <div key={o.id}>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="truncate">{o.label}</span>
                                <span className="text-muted-foreground tabular-nums">{pct}% · {c}</span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7 }}
                                  className="h-full rounded-full" style={{ background: color }} />
                              </div>
                            </div>
                          );
                        })}
                        {(!p.poll_options || p.poll_options.length === 0) && (
                          <div className="text-xs text-muted-foreground italic">No options yet — finish this draft.</div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <Link to="/poll/$id" params={{ id: p.id }}
                          className="flex-1 text-center text-xs font-semibold py-2 rounded-xl bg-foreground text-background">
                          View poll
                        </Link>
                        <button
                          onClick={() => {
                            const url = `${window.location.origin}/poll/${p.id}`;
                            if (navigator.share) {
                              navigator.share({ title: p.title, url }).catch(() => {});
                            } else {
                              navigator.clipboard?.writeText(url);
                              toast.success("Poll link copied! 🎉");
                            }
                          }}
                          className="flex-1 text-xs font-semibold py-2 rounded-xl bg-white/60 inline-flex items-center justify-center gap-1">
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
          <div className="text-center py-12 rounded-3xl glass inner-glow">
            <Sparkles className="size-6 mx-auto text-ember" />
            <div className="mt-2 text-sm font-semibold">Nothing in "{tab}"</div>
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
      className="p-3 rounded-2xl glass inner-glow">
      <div className="text-ember">{icon}</div>
      <div className="mt-1 text-lg font-bold tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
    </motion.div>
  );
}
