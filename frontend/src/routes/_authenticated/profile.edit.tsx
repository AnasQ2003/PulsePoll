import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/mobile/AppShell";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/profile/edit")({ component: EditProfile });

function EditProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const nav = useNavigate();
  const [display, setDisplay] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplay(profile.display_name ?? "");
      setUsername(profile.username ?? "");
      setBio(profile.bio ?? "");
      setPhone(profile.phone ?? "");
    }
  }, [profile]);

  async function save() {
    if (!user) return;
    setSaving(true);
    try {
      const updates = {
        display_name: display,
        username,
        bio,
        phone,
      };
      await apiRequest("/profiles/me", {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      toast.success("Profile updated");
      await refreshProfile();
      nav({ to: "/profile" });
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  const initials = (display || user?.email || "U").slice(0, 2).toUpperCase();

  return (
    <AppShell title="Edit profile" back>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center pt-2 pb-4">
        <div className="size-24 rounded-3xl text-background grid place-items-center text-3xl font-bold glow-orange"
          style={{ background: "linear-gradient(135deg, var(--color-ember), oklch(0.55 0.22 36))" }}>
          {initials}
        </div>
        <button className="mt-3 text-xs font-medium text-ember">Change photo</button>
      </motion.div>

      <div className="space-y-3">
        <Field label="Display name" value={display} onChange={setDisplay} />
        <Field label="Username" value={username} onChange={setUsername} prefix="@" />
        <Field label="Phone" value={phone} onChange={setPhone} placeholder="+1 555 0100" />
        <div className="p-3 rounded-2xl bg-muted/60 border border-border">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Bio</div>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
            placeholder="Tell people what you care about" className="mt-1 w-full bg-transparent text-sm outline-none resize-none" />
        </div>
      </div>

      <motion.button whileTap={{ scale: 0.97 }} disabled={saving} onClick={save}
        className="mt-6 w-full py-3.5 rounded-2xl font-semibold text-background glow-orange"
        style={{ background: "linear-gradient(135deg, var(--color-ember), oklch(0.55 0.22 36))" }}>
        {saving ? "Saving…" : "Save changes"}
      </motion.button>
    </AppShell>
  );
}

function Field({ label, value, onChange, prefix, placeholder }: any) {
  return (
    <div className="p-3 rounded-2xl bg-muted/60 border border-border focus-within:border-ember transition">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 flex items-center gap-1">
        {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="flex-1 bg-transparent text-sm outline-none" />
      </div>
    </div>
  );
}
