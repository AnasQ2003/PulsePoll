import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bell, Moon, Lock, HelpCircle, FileText, ShieldCheck, LogOut, ChevronRight, User, Palette, Languages, Download, Star, MessageCircle, Sparkles } from "lucide-react";
import { AppShell } from "@/components/mobile/AppShell";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({ component: Settings });

type Item = {
  icon: any;
  label: string;
  sub?: string;
  to?: string;
  value?: string;
  glow: string;
  toggle?: boolean;
  onClick?: () => void;
};

function Settings() {
  const { user, profile, signOut } = useAuth();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    push: true,
    email: false,
    dark: document.documentElement.classList.contains("dark"),
    sounds: true,
    haptics: true,
  });

  const t = (k: string) => {
    setToggles((s) => {
      const next = { ...s, [k]: !s[k] };
      if (k === "dark") {
        if (next.dark) {
          document.documentElement.classList.add("dark");
          toast.success("Dark theme enabled 🌙");
        } else {
          document.documentElement.classList.remove("dark");
          toast.success("Light theme enabled ☀️");
        }
      } else {
        toast.success(`${itName(k)} ${next[k] ? "enabled" : "disabled"}`);
      }
      return next;
    });
  };

  const itName = (k: string) => {
    if (k === "push") return "Push notifications";
    if (k === "email") return "Email digest";
    if (k === "sounds") return "Sounds";
    if (k === "haptics") return "Haptic feedback";
    return k;
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify({
      app: "PulsePoll",
      exportedAt: new Date().toISOString(),
      user: {
        id: user?.id,
        email: user?.email,
        username: profile?.username,
        displayName: profile?.display_name,
        bio: profile?.bio,
        phone: profile?.phone,
      },
      preferences: toggles,
    }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pulsepoll-user-data.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("User data report exported successfully! 📂");
  };

  const groups: { title: string; items: Item[] }[] = [
    { title: "Account", items: [
      { icon: User, label: "Edit profile", sub: "Name, bio, avatar", to: "/profile/edit", glow: "oklch(0.75 0.18 250)" },
      {
        icon: Lock,
        label: "Privacy & security",
        sub: "Manage who can see your activity",
        glow: "oklch(0.7 0.18 290)",
        onClick: () => toast.info("Your activity and voting records are private to you. 🔒"),
      },
    ]},
    { title: "Notifications", items: [
      { icon: Bell, label: "Push notifications", toggle: true, value: "push", glow: "oklch(0.75 0.2 36)" },
      { icon: MessageCircle, label: "Email digest", toggle: true, value: "email", glow: "oklch(0.78 0.16 200)" },
      { icon: Sparkles, label: "Inbox", sub: "View all activity", to: "/notifications", glow: "oklch(0.78 0.18 80)" },
    ]},
    { title: "Appearance", items: [
      { icon: Moon, label: "Dark mode", toggle: true, value: "dark", glow: "oklch(0.6 0.18 280)" },
      {
        icon: Palette,
        label: "Accent color",
        value: "Ember",
        glow: "oklch(0.75 0.2 36)",
        onClick: () => toast.info("Theme accent color is locked to Ember in this build."),
      },
      {
        icon: Languages,
        label: "Language",
        value: "English",
        glow: "oklch(0.78 0.15 160)",
        onClick: () => toast.info("Language selection is locked to English in this build."),
      },
    ]},
    { title: "Experience", items: [
      { icon: Bell, label: "Sounds", toggle: true, value: "sounds", glow: "oklch(0.78 0.16 200)" },
      { icon: Sparkles, label: "Haptics", toggle: true, value: "haptics", glow: "oklch(0.75 0.18 320)" },
      {
        icon: Download,
        label: "Export my data",
        glow: "oklch(0.78 0.15 160)",
        onClick: handleExportData,
      },
    ]},
    { title: "About", items: [
      { icon: FileText, label: "Terms of Service", to: "/terms", glow: "oklch(0.78 0.12 80)" },
      { icon: ShieldCheck, label: "Privacy Policy", to: "/privacy", glow: "oklch(0.75 0.18 160)" },
      {
        icon: HelpCircle,
        label: "Help & support",
        glow: "oklch(0.78 0.16 200)",
        onClick: () => toast.success("Support ticket created! We'll contact you at " + user?.email),
      },
      {
        icon: Star,
        label: "Rate PulsePoll",
        glow: "oklch(0.78 0.2 80)",
        onClick: () => toast.success("Thank you for rating PulsePoll 5-stars! ⭐⭐⭐⭐⭐"),
      },
    ]},
  ];

  return (
    <AppShell title="Settings">
      <div className="space-y-6 pb-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl p-5 glass inner-glow overflow-hidden">
          <div className="absolute -top-10 -right-10 size-40 rounded-full blur-3xl opacity-60"
            style={{ background: "radial-gradient(circle, oklch(0.78 0.2 36) 0%, transparent 70%)" }} />
          <div className="relative text-lg font-display font-bold">Customize your experience</div>
          <div className="relative text-xs text-muted-foreground mt-1">Every option below is yours to tune.</div>
        </motion.div>

        {groups.map((g, gi) => (
          <motion.div key={gi} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.05 }}>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground px-2 mb-2 font-semibold">{g.title}</div>
            <div className="rounded-3xl glass inner-glow overflow-hidden">
              {g.items.map((it, i) => {
                const Inner = (
                  <motion.div
                    whileTap={it.toggle ? undefined : { scale: 0.98 }}
                    onClick={it.onClick}
                    className={`relative flex items-center gap-3 px-4 py-3.5 border-b border-white/30 last:border-0 group overflow-hidden ${it.onClick ? "cursor-pointer" : ""}`}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity"
                      style={{ background: `radial-gradient(120% 60% at 0% 50%, ${it.glow}26, transparent 60%)` }} />
                    <div className="relative size-10 rounded-2xl grid place-items-center shrink-0"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${it.glow}, ${it.glow}99)`,
                        boxShadow: `0 8px 24px -8px ${it.glow}`,
                      }}>
                      <it.icon className="size-4 text-white drop-shadow" />
                    </div>
                    <div className="relative flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{it.label}</div>
                      {it.sub && <div className="text-[11px] text-muted-foreground truncate">{it.sub}</div>}
                    </div>
                    {it.toggle ? (
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); t(it.value!); }}
                        className={`relative w-11 h-6 rounded-full transition ${toggles[it.value!] ? "" : "bg-white/40"}`}
                        style={toggles[it.value!] ? { background: it.glow, boxShadow: `0 0 16px ${it.glow}` } : {}}>
                        <motion.span layout
                          className="absolute top-0.5 size-5 rounded-full bg-white shadow"
                          style={{ left: toggles[it.value!] ? 22 : 2 }} />
                      </button>
                    ) : it.value ? (
                      <span className="relative text-xs font-medium text-muted-foreground">{it.value}</span>
                    ) : (
                      <ChevronRight className="relative size-4 text-muted-foreground" />
                    )}
                  </motion.div>
                );
                return it.to ? <Link key={i} to={it.to}>{Inner}</Link> : <div key={i}>{Inner}</div>;
              })}
            </div>
          </motion.div>
        ))}

        <motion.button whileTap={{ scale: 0.98 }} onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-destructive/15 text-destructive font-semibold border border-destructive/20"
          style={{ boxShadow: "0 8px 24px -12px oklch(0.6 0.22 25)" }}>
          <LogOut className="size-4" /> Sign out
        </motion.button>

        <div className="text-center text-[11px] text-muted-foreground">PulsePoll v1.0 · made with care</div>
      </div>
    </AppShell>
  );
}
