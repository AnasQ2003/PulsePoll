import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/mobile/AppShell";
import {
  Bell, Vote, Sparkles, MessageCircle, TrendingUp, Users,
  Trophy, Flame, CheckCircle2, Settings as SettingsIcon,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/notifications")({ component: Notifications });

type Item = {
  icon: any;
  glow: string; // oklch color
  title: string;
  body: string;
  time: string;
  to: string;
  unread?: boolean;
};

const items: Item[] = [
  { icon: Vote,          glow: "oklch(0.68 0.21 36)",  title: "Your poll closed",      body: "“Best pizza topping” reached 247 votes — tap to see the winner.", time: "2h",  to: "/results",     unread: true },
  { icon: Sparkles,      glow: "oklch(0.70 0.20 320)", title: "Featured poll",         body: "Your poll is trending #3 in Tech this week.",                       time: "5h",  to: "/discover",    unread: true },
  { icon: MessageCircle, glow: "oklch(0.65 0.18 250)", title: "New comment",           body: "Alex left a comment: “This one’s tough… going with B.”",            time: "1d",  to: "/discover" },
  { icon: TrendingUp,    glow: "oklch(0.70 0.20 150)", title: "Trending in your feed", body: "5 new polls match your interests in Culture & Music.",              time: "1d",  to: "/discover" },
  { icon: Users,         glow: "oklch(0.65 0.20 200)", title: "New follower",          body: "Priya R. started following your polls.",                            time: "2d",  to: "/profile" },
  { icon: Trophy,        glow: "oklch(0.75 0.18 80)",  title: "Badge unlocked",        body: "You earned the “Daily Voter” streak badge — keep going!",           time: "2d",  to: "/profile" },
  { icon: Flame,         glow: "oklch(0.68 0.22 30)",  title: "Streak at risk",        body: "Vote on 1 poll today to keep your 7-day streak alive.",             time: "3d",  to: "/home" },
  { icon: CheckCircle2,  glow: "oklch(0.70 0.18 150)", title: "Account verified",      body: "Your email is verified. You can now create unlimited polls.",       time: "5d",  to: "/settings" },
  { icon: Bell,          glow: "oklch(0.55 0.05 250)", title: "Welcome to Pollux",     body: "Cast your first vote and customise your interests to get started.", time: "1w", to: "/home" },
];

function Notifications() {
  const unread = items.filter((i) => i.unread).length;

  return (
    <AppShell title="Notifications" back>
      {/* Header strip */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 rounded-3xl glass-strong mb-4"
      >
        <div>
          <div className="text-[10px] uppercase tracking-widest text-ember font-bold">Inbox</div>
          <div className="font-semibold text-sm mt-0.5">
            {unread > 0 ? `${unread} new updates` : "You're all caught up"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-card border border-border">
            Mark all read
          </button>
          <Link to="/settings" className="size-9 grid place-items-center rounded-full glass" aria-label="Notification settings">
            <SettingsIcon className="size-4" />
          </Link>
        </div>
      </motion.div>

      <div className="space-y-2.5">
        {items.map((it, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
          >
            <Link
              to={it.to}
              className="relative block p-4 rounded-2xl glass overflow-hidden active:scale-[0.99] transition"
            >
              {/* Colored inner glow */}
              <div
                className="pointer-events-none absolute -left-6 -top-6 size-32 rounded-full"
                style={{ background: `radial-gradient(circle, ${it.glow} 0%, transparent 70%)`, opacity: 0.35, filter: "blur(8px)" }}
              />
              <div
                className="pointer-events-none absolute -right-10 -bottom-10 size-28 rounded-full"
                style={{ background: `radial-gradient(circle, ${it.glow} 0%, transparent 70%)`, opacity: 0.22, filter: "blur(10px)" }}
              />

              <div className="relative flex gap-3">
                <div
                  className="size-11 rounded-2xl grid place-items-center shrink-0 text-background"
                  style={{
                    background: `linear-gradient(135deg, ${it.glow}, color-mix(in oklch, ${it.glow} 60%, white))`,
                    boxShadow: `0 8px 24px -8px ${it.glow}`,
                  }}
                >
                  <it.icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-sm flex items-center gap-1.5">
                      {it.title}
                      {it.unread && (
                        <span className="size-1.5 rounded-full" style={{ background: it.glow, boxShadow: `0 0 8px ${it.glow}` }} />
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{it.time}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{it.body}</div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-center text-[11px] text-muted-foreground pb-2">
        You’ve reached the end · <Link to="/settings" className="text-ember font-semibold">Notification preferences</Link>
      </div>
    </AppShell>
  );
}
