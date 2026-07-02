import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/mobile/AppShell";
import { apiRequest } from "@/lib/api";
import {
  Bell, Vote, Sparkles, MessageCircle, TrendingUp, Users,
  Trophy, Flame, CheckCircle2, Settings as SettingsIcon,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/notifications")({ component: Notifications });

const ICON_MAP: Record<string, { icon: any; glow: string }> = {
  "🎉": { icon: Sparkles, glow: "oklch(0.70 0.20 320)" },
  "📊": { icon: Vote, glow: "oklch(0.68 0.21 36)" },
  "🔥": { icon: Flame, glow: "oklch(0.68 0.22 30)" },
  "🏆": { icon: Trophy, glow: "oklch(0.75 0.18 80)" },
  "💬": { icon: MessageCircle, glow: "oklch(0.65 0.18 250)" },
  "📈": { icon: TrendingUp, glow: "oklch(0.70 0.20 150)" },
  "👥": { icon: Users, glow: "oklch(0.65 0.20 200)" },
  "✅": { icon: CheckCircle2, glow: "oklch(0.70 0.18 150)" },
  "🔔": { icon: Bell, glow: "oklch(0.55 0.05 250)" },
};

function Notifications() {
  const qc = useQueryClient();

  const { data: notifications = [] } = useQuery<any[]>({
    queryKey: ["notifications"],
    queryFn: () => apiRequest<any[]>("/notifications"),
  });

  const markReadMutation = useMutation({
    mutationFn: () => apiRequest("/notifications/read", { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  const getRelativeTime = (dateStr: string) => {
    const elapsed = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(elapsed / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <AppShell title="Notifications" back>
      {/* Header strip */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 rounded-3xl glass-strong inner-glow mb-4"
      >
        <div>
          <div className="text-[10px] uppercase tracking-widest text-ember font-bold">Inbox</div>
          <div className="font-semibold text-sm mt-0.5">
            {unreadCount > 0 ? `${unreadCount} new updates` : "You're all caught up"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={() => markReadMutation.mutate()}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-card border border-border"
            >
              Mark all read
            </button>
          )}
          <Link to="/settings" className="size-9 grid place-items-center rounded-full glass inner-glow" aria-label="Notification settings">
            <SettingsIcon className="size-4" />
          </Link>
        </div>
      </motion.div>

      <div className="space-y-2.5">
        {notifications.map((it, i) => {
          const mapping = ICON_MAP[it.icon] || ICON_MAP["🔔"];
          const Icon = mapping.icon;
          const glow = mapping.glow;

          return (
          <motion.div key={it.id}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
          >
            <Link
              to={it.route || "/home"}
              className={`relative block p-4 rounded-2xl overflow-hidden active:scale-[0.99] transition
                ${it.unread
                  ? "inner-glow border border-ember/20 bg-gradient-to-br from-white/90 to-white/60 shadow-sm"
                  : "glass opacity-70"
                }`}
            >
              {/* Unread left accent bar */}
              {it.unread && (
                <div
                  className="absolute left-0 inset-y-0 w-1 rounded-full"
                  style={{ background: glow }}
                />
              )}
              {/* Colored inner glow */}
              <div
                className="pointer-events-none absolute -left-6 -top-6 size-32 rounded-full"
                style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`, opacity: it.unread ? 0.35 : 0.15, filter: "blur(8px)" }}
              />
              <div
                className="pointer-events-none absolute -right-10 -bottom-10 size-28 rounded-full"
                style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`, opacity: it.unread ? 0.22 : 0.08, filter: "blur(10px)" }}
              />

              <div className="relative flex gap-3">
                <div
                  className={`size-11 rounded-2xl grid place-items-center shrink-0 text-background ${!it.unread ? "opacity-60" : ""}`}
                  style={{
                    background: `linear-gradient(135deg, ${glow}, color-mix(in oklch, ${glow} 60%, white))`,
                    boxShadow: it.unread ? `0 8px 24px -8px ${glow}` : "none",
                  }}
                >
                  <Icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className={`text-sm flex items-center gap-1.5 ${it.unread ? "font-bold" : "font-medium text-muted-foreground"}`}>
                      {it.title}
                      {it.unread && (
                        <span className="size-2 rounded-full" style={{ background: glow, boxShadow: `0 0 8px ${glow}` }} />
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{getRelativeTime(it.created_at)}</span>
                  </div>
                  <div className={`text-xs mt-1 leading-relaxed ${it.unread ? "text-foreground/80" : "text-muted-foreground"}`}>{it.body}</div>
                </div>
              </div>
            </Link>
          </motion.div>
          );
        })}

        {notifications.length === 0 && (
          <div className="text-center py-12 rounded-3xl glass inner-glow">
            <Bell className="size-8 mx-auto text-muted-foreground" />
            <div className="mt-2 text-sm font-semibold">Inbox is empty</div>
            <div className="text-xs text-muted-foreground">We'll notify you when someone votes or follows.</div>
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-[11px] text-muted-foreground pb-2">
        You’ve reached the end · <Link to="/settings" className="text-ember font-semibold">Notification preferences</Link>
      </div>
    </AppShell>
  );
}
