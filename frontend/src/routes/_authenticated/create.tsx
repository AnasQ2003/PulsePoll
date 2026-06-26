import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Trash2, Globe, Users, Check, Search, Lightbulb, Eye, Sparkles, Type, ListChecks, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/mobile/AppShell";
import { apiRequest } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/create")({ component: Create });

const EMOJIS = ["🗳️", "🚀", "🎨", "🍕", "🎬", "⚽", "🎵", "💡", "🌍", "🔥"];
const TEMPLATES = [
  { title: "What should we name our new product?", opts: ["Aurora", "Nimbus", "Zenith"], emoji: "💡" },
  { title: "Pick tonight's movie genre", opts: ["Thriller", "Comedy", "Sci-fi", "Drama"], emoji: "🎬" },
  { title: "Best pizza topping, settle it", opts: ["Pepperoni", "Mushroom", "Pineapple", "Margherita"], emoji: "🍕" },
];

function Create() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("General");
  const [emoji, setEmoji] = useState("🗳️");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [mode, setMode] = useState<"everyone" | "specific">("everyone");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!title.trim()) return toast.error("Title is required");
    const validOpts = options.map(o => o.trim()).filter(Boolean);
    if (validOpts.length < 2) return toast.error("At least 2 options");
    setSaving(true);
    try {
      const poll = await apiRequest<{ id: string }>("/polls", {
        method: "POST",
        body: JSON.stringify({
          title,
          description: desc,
          category,
          cover_emoji: emoji,
          voting_mode: mode,
          options: validOpts,
        }),
      });
      toast.success("Poll published 🚀");
      navigate({ to: "/poll/$id", params: { id: poll.id } });
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally { setSaving(false); }
  }

  return (
    <AppShell title="Create Poll">
      <div className="space-y-4 pb-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl p-4 glass overflow-hidden">
          <div className="absolute -top-10 -right-10 size-32 rounded-full blur-3xl opacity-70"
            style={{ background: "radial-gradient(circle, oklch(0.78 0.2 36) 0%, transparent 70%)" }} />
          <div className="relative flex items-start gap-3">
            <div className="size-10 rounded-2xl grid place-items-center shrink-0"
              style={{ background: "linear-gradient(135deg, oklch(0.78 0.2 36), oklch(0.7 0.18 80))", boxShadow: "0 8px 24px -8px oklch(0.78 0.2 36)" }}>
              <Lightbulb className="size-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold">New here? It's easy.</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Pick a cover → ask a question → add 2+ options → publish. Your community votes live.</div>
            </div>
          </div>
        </motion.div>

        <div className="rounded-3xl glass p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wand2 className="size-3.5 text-[var(--color-ember)]" />
            <div className="text-xs font-semibold">Start from a template</div>
          </div>
          <div className="flex gap-2 overflow-x-auto hide-scroll -mx-1 px-1 pb-1">
            {TEMPLATES.map((tp, i) => (
              <button key={i} onClick={() => { setTitle(tp.title); setOptions(tp.opts); setEmoji(tp.emoji); toast.success("Template loaded ✨"); }}
                className="shrink-0 w-48 text-left rounded-2xl p-3 bg-white/50 hover:bg-white/70 transition border border-white/40">
                <div className="text-lg">{tp.emoji}</div>
                <div className="text-[11px] font-semibold mt-1 line-clamp-2">{tp.title}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{tp.opts.length} options</div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-3xl glass">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-3.5 text-[var(--color-ember)]" />
            <label className="text-xs font-semibold">Cover emoji</label>
          </div>
          <div className="mt-2 flex gap-2 flex-wrap">
            {EMOJIS.map(e => (
              <motion.button key={e} whileTap={{ scale: 0.85 }} onClick={() => setEmoji(e)}
                className={`size-11 rounded-2xl text-xl grid place-items-center transition ${emoji === e ? "bg-ember-soft ring-2 ring-[var(--color-ember)]" : "bg-white/50"}`}>
                {e}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-3xl glass space-y-3">
          <div className="flex items-center gap-2">
            <Type className="size-3.5 text-[var(--color-ember)]" />
            <label className="text-xs font-semibold">Question</label>
            <span className={`ml-auto text-[10px] ${title.length > 90 ? "text-destructive" : "text-muted-foreground"}`}>{title.length}/100</span>
          </div>
          <input value={title} onChange={(e) => setTitle(e.target.value.slice(0, 100))} placeholder="Ask a question…"
            className="w-full bg-transparent text-lg font-semibold outline-none placeholder:text-muted-foreground/60" />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value.slice(0, 240))} placeholder="Add a description (optional)"
            rows={2} className="w-full bg-transparent text-sm outline-none resize-none placeholder:text-muted-foreground" />
          <div className="text-[10px] text-muted-foreground">💡 Tip: short, specific questions get 3× more votes.</div>
          <div className="flex gap-2 flex-wrap pt-1">
            {["General", "Technology", "Culture", "Food & Drinks", "Sports"].map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1 rounded-full text-xs transition ${category === c ? "bg-foreground text-background shadow" : "bg-white/50 text-muted-foreground"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-3xl glass">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListChecks className="size-3.5 text-[var(--color-ember)]" />
              <label className="text-xs font-semibold">Options <span className="text-muted-foreground font-normal">({options.filter(o => o.trim()).length}/10)</span></label>
            </div>
            <button onClick={() => options.length < 10 && setOptions([...options, ""])}
              className="text-xs font-medium text-[var(--color-ember)] inline-flex items-center gap-1"><Plus className="size-3" /> Add</button>
          </div>
          <div className="mt-3 space-y-2">
            <AnimatePresence>
              {options.map((opt, i) => (
                <motion.div key={i} layout
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-ember-soft text-[var(--color-ember)] text-xs font-bold grid place-items-center">{i + 1}</div>
                  <input value={opt} onChange={(e) => setOptions(options.map((o, j) => j === i ? e.target.value : o))}
                    placeholder={`Option ${i + 1}`} className="flex-1 px-3 py-2.5 rounded-xl bg-white/50 outline-none text-sm" />
                  {options.length > 2 && (
                    <button onClick={() => setOptions(options.filter((_, j) => j !== i))} className="size-9 grid place-items-center text-destructive">
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-4 rounded-3xl glass">
          <label className="text-xs font-medium text-muted-foreground">Who can vote?</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {([
              { id: "everyone", icon: Globe, label: "Everyone", sub: "All PulsePoll users" },
              { id: "specific", icon: Users, label: "Selected", sub: "Pick people" },
            ] as const).map((opt) => (
              <button key={opt.id} type="button" onClick={() => setMode(opt.id)}
                className={`relative p-3 rounded-2xl text-left transition ${mode === opt.id ? "bg-ember-soft ring-2 ring-[var(--color-ember)]" : "bg-white/50"}`}>
                <opt.icon className={`size-4 mb-1 ${mode === opt.id ? "text-[var(--color-ember)]" : "text-muted-foreground"}`} />
                <div className="text-sm font-semibold">{opt.label}</div>
                <div className="text-[11px] text-muted-foreground">{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl glass p-4">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="size-3.5 text-[var(--color-ember)]" />
            <div className="text-xs font-semibold">Live preview</div>
          </div>
          <div className="rounded-2xl p-4 text-background relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, oklch(0.13 0 0), oklch(0.28 0 0))" }}>
            <div className="text-3xl">{emoji}</div>
            <div className="mt-1.5 text-base font-bold">{title || "Your question will appear here"}</div>
            {desc && <div className="mt-1 text-[11px] text-white/70">{desc}</div>}
            <div className="mt-3 space-y-1.5">
              {options.filter(o => o.trim()).slice(0, 4).map((o, i) => (
                <div key={i} className="px-3 py-2 rounded-xl bg-white/10 text-xs font-medium">{o}</div>
              ))}
              {options.filter(o => o.trim()).length === 0 && (
                <div className="text-[11px] text-white/50 italic">Add options to preview them.</div>
              )}
            </div>
          </div>
        </div>

        <motion.button whileTap={{ scale: 0.97 }} disabled={saving} onClick={save}
          className="w-full py-3.5 rounded-2xl font-semibold text-background glow-orange"
          style={{ background: "linear-gradient(135deg, var(--color-ember), oklch(0.55 0.22 36))" }}>
          {saving ? "Publishing…" : "Publish poll 🚀"}
        </motion.button>
      </div>
    </AppShell>
  );
}
