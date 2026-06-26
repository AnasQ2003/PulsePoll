import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { PlusCircle, Settings, FileText, ShieldCheck, LogOut, UserCog } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function RadialMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signOut } = useAuth();
  const items = [
    { icon: PlusCircle, label: "Create Poll", to: "/create", color: "var(--color-ember)" },
    { icon: UserCog, label: "Edit Profile", to: "/profile/edit", color: "oklch(0.13 0 0)" },
    { icon: Settings, label: "Settings", to: "/settings", color: "oklch(0.13 0 0)" },
    { icon: FileText, label: "Terms", to: "/terms", color: "oklch(0.13 0 0)" },
    { icon: ShieldCheck, label: "Privacy", to: "/privacy", color: "oklch(0.13 0 0)" },
    { icon: LogOut, label: "Sign out", onClick: () => signOut(), color: "oklch(0.60 0.24 27)" },
  ] as Array<{ icon: any; label: string; to?: string; onClick?: () => void; color: string }>;

  const count = items.length;
  const radius = 130;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 bg-background/30 backdrop-blur-2xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="absolute left-1/2 -translate-x-1/2"
            style={{ bottom: "5.5rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative size-[320px]">
              {items.map((it, i) => {
                const start = -170;
                const end = -10;
                const angle = start + ((end - start) * (count === 1 ? 0.5 : i / (count - 1)));
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;
                const Inner = (
                  <motion.div
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                    animate={{ x, y, opacity: 1, scale: 1 }}
                    exit={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                    transition={{ type: "spring", stiffness: 320, damping: 22, delay: i * 0.04 }}
                    className="absolute left-1/2 bottom-0 -translate-x-1/2 flex flex-col items-center gap-1.5"
                  >
                    <div className="size-14 rounded-2xl glass-strong grid place-items-center" style={{ color: it.color }}>
                      <it.icon className="size-6" />
                    </div>
                    <span className="text-[11px] font-medium text-foreground glass px-2 py-0.5 rounded-full whitespace-nowrap">
                      {it.label}
                    </span>
                  </motion.div>
                );
                return it.to ? (
                  <Link key={it.label} to={it.to} onClick={onClose}>{Inner}</Link>
                ) : (
                  <button key={it.label} onClick={() => { it.onClick?.(); onClose(); }}>{Inner}</button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
