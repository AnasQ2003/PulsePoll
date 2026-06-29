import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Pencil, Mail, Phone, Award, Trophy, Flame, Sparkles, BarChart3,
  Bookmark, Bell, Settings, LogOut, Share2, Copy, Check, Calendar,
  Heart, Zap, Star, Target, Activity,
} from "lucide-react";
import { AppShell } from "@/components/mobile/AppShell";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/profile")({ component: Profile });

const achievements = [
  { icon: Flame, label: "Streak 7d", tint: "var(--color-ember)" },
  { icon: Trophy, label: "Top voter", tint: "oklch(0.7 0.2 80)" },
  { icon: Star, label: "Curator", tint: "oklch(0.65 0.2 320)" },
  { icon: Target, label: "Sharpshooter", tint: "oklch(0.6 0.2 200)" },
  { icon: Sparkles, label: "Early bird", tint: "oklch(0.65 0.2 140)" },
  { icon: Heart, label: "Beloved", tint: "oklch(0.65 0.22 20)" },
];

function Profile() {
  const { user, profile, signOut } = useAuth();
  const [tab, setTab] = useState<"overview" | "polls" | "votes">("overview");
  const [copied, setCopied] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ["my-stats", user?.id],
    queryFn: () => apiRequest<{ voted: number; created: number }>("/profiles/stats"),
    enabled: !!user,
  });

  const { data: myPolls = [] } = useQuery({
    queryKey: ["my-polls", user?.id],
    queryFn: () => apiRequest<any[]>("/polls/mine"),
    enabled: !!user,
  });

  const initials = (profile?.display_name ?? user?.email ?? "U").slice(0, 2).toUpperCase();
  const xp = (stats?.voted ?? 0) * 10 + (stats?.created ?? 0) * 50;
  const level = Math.max(1, Math.floor(xp / 200) + 1);
  const xpInLevel = xp % 200;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`@${profile?.username ?? "me"} on PulsePoll`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AppShell title="Profile" right={
      <Link to="/profile/edit" className="size-9 grid place-items-center rounded-full glass inner-glow">
        <Pencil className="size-4" />
      </Link>
    }>
      {/* Header card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative p-6 rounded-3xl text-background overflow-hidden"
        style={{ background: "linear-gradient(135deg, oklch(0.13 0 0), oklch(0.28 0 0))" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -right-16 -top-16 size-56 rounded-full"
          style={{ background: "conic-gradient(from 0deg, transparent, var(--color-ember), transparent)", opacity: 0.4 }} />
        <div className="relative z-10 flex items-center gap-4">
          <div className="size-20 rounded-3xl bg-ember text-background grid place-items-center text-2xl font-bold glow-orange">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-xl truncate">{profile?.display_name ?? "Anonymous"}</div>
            <div className="text-xs text-white/70 truncate">@{profile?.username ?? "user"}</div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-ember/20 text-ember">
                <Award className="size-3" /> Lv {level}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/10">
                <Calendar className="size-3" /> Joined {new Date(user?.created_at ?? Date.now()).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>
        {profile?.bio && <p className="relative z-10 mt-4 text-sm text-white/80">{profile.bio}</p>}

        {/* XP bar */}
        <div className="relative z-10 mt-4">
          <div className="flex justify-between text-[10px] text-white/70 mb-1">
            <span>{xp} XP · Level {level}</span><span>{xpInLevel}/200 to next</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(xpInLevel / 200) * 100}%` }} transition={{ duration: 0.8 }}
              className="h-full rounded-full" style={{ background: "linear-gradient(90deg, var(--color-ember), oklch(0.75 0.18 80))" }} />
          </div>
        </div>

        {/* Quick actions */}
        <div className="relative z-10 mt-4 flex gap-2">
          <button onClick={handleCopy} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-full bg-white/15 backdrop-blur text-xs font-semibold">
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} {copied ? "Copied" : "Copy handle"}
          </button>
          <button className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-full bg-white/15 backdrop-blur text-xs font-semibold">
            <Share2 className="size-3.5" /> Share
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat icon={<BarChart3 className="size-4" />} label="Polls" value={stats?.created ?? 0} />
        <Stat icon={<Activity className="size-4" />} label="Votes" value={stats?.voted ?? 0} />
        <Stat icon={<Zap className="size-4" />} label="XP" value={xp} />
      </div>

      {/* Achievements */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Trophy className="size-4 text-ember" /> Achievements</h3>
          <span className="text-[11px] text-muted-foreground">{achievements.length} unlocked</span>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto hide-scroll -mx-1 px-1">
          {achievements.map((a, i) => (
            <motion.div key={a.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
              className="shrink-0 w-20 p-3 rounded-2xl glass inner-glow flex flex-col items-center gap-1 text-center">
              <div className="size-9 rounded-full grid place-items-center text-background" style={{ background: a.tint }}>
                <a.icon className="size-4" />
              </div>
              <div className="text-[10px] font-semibold leading-tight">{a.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-5 inline-flex p-1 rounded-full glass inner-glow w-full">
        {(["overview", "polls", "votes"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 text-xs font-semibold py-2 rounded-full capitalize transition ${tab === t ? "bg-foreground text-background" : "text-muted-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === "overview" && (
          <div className="space-y-2">
            <Row icon={<Mail className="size-4" />} label="Email" value={user?.email ?? "—"} />
            <Row icon={<Phone className="size-4" />} label="Phone" value={profile?.phone ?? "Not added"} />
            <Link to="/notifications" className="block">
              <Row icon={<Bell className="size-4" />} label="Notifications" value="Manage alerts" />
            </Link>
            <Link to="/settings" className="block">
              <Row icon={<Settings className="size-4" />} label="Settings" value="Privacy, theme, account" />
            </Link>
            <Row icon={<Bookmark className="size-4" />} label="Saved polls" value="12 saved" />
          </div>
        )}
        {tab === "polls" && (
          <div className="space-y-2">
            {myPolls.length === 0 && <div className="text-center text-sm text-muted-foreground py-8 rounded-3xl glass">No polls yet.</div>}
            {myPolls.map((p: any, i: number) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to="/poll/$id" params={{ id: p.id }} className="flex items-center gap-3 p-3 rounded-2xl glass inner-glow">
                  <div className="size-10 rounded-xl bg-ember-soft grid place-items-center text-lg">{p.cover_emoji ?? "🗳️"}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{p.title}</div>
                    <div className="text-[11px] text-muted-foreground">{p.vote_count ?? 0} votes · {new Date(p.created_at).toLocaleDateString()}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        {tab === "votes" && (
          <div className="rounded-3xl glass inner-glow p-6 text-center">
            <Activity className="size-6 mx-auto text-ember" />
            <div className="mt-2 font-semibold text-sm">{stats?.voted ?? 0} votes cast</div>
            <div className="text-xs text-muted-foreground">Your voting history is private to you.</div>
          </div>
        )}
      </div>

      <Link to="/profile/edit" className="mt-5 block w-full py-3.5 rounded-2xl font-semibold text-background text-center glow-orange"
        style={{ background: "linear-gradient(135deg, var(--color-ember), oklch(0.55 0.22 36))" }}>
        Edit profile
      </Link>

      <button onClick={() => signOut()}
        className="mt-2 w-full py-3 rounded-2xl bg-destructive/10 text-destructive font-semibold text-sm inline-flex items-center justify-center gap-2">
        <LogOut className="size-4" /> Sign out
      </button>

      <div className="h-4" />
    </AppShell>
  );
}

function Stat({ icon, label, value }: any) {
  return (
    <motion.div whileHover={{ y: -2 }} className="p-3 rounded-2xl glass inner-glow">
      <div className="text-ember">{icon}</div>
      <div className="mt-1 text-lg font-bold tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
    </motion.div>
  );
}
function Row({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl glass inner-glow">
      <div className="size-9 rounded-xl bg-ember-soft grid place-items-center text-ember">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</div>
        <div className="text-sm font-medium truncate">{value}</div>
      </div>
    </div>
  );
}
