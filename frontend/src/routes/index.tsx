import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { PhoneShell } from "@/components/mobile/PhoneShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PulsePoll — Welcome" },
      { name: "description", content: "Premium poll app. Vote, create and follow live polls." },
    ],
  }),
  component: Splash,
});

function Splash() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const dur = 2200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      // ease-in-out-quint
      const e = p < 0.5 ? 16 * p ** 5 : 1 - Math.pow(-2 * p + 2, 5) / 2;
      setPct(Math.round(e * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (pct < 100) return;
    const t = setTimeout(() => navigate({ to: "/auth" }), 220);
    return () => clearTimeout(t);
  }, [ready, user, navigate, pct]);

  return (
    <PhoneShell>
      <div className="h-full w-full grid place-items-center relative overflow-hidden">
        {/* Liquid background */}
        <motion.div
          className="absolute -top-32 -left-16 size-[420px] rounded-full liquid-blob"
          animate={{ scale: [1, 1.15, 1], x: [0, 20, 0], y: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "radial-gradient(circle, oklch(0.82 0.16 36 / 0.55), transparent 60%)" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-24 size-[460px] rounded-full liquid-blob"
          animate={{ scale: [1.1, 0.95, 1.1], x: [0, -16, 0], y: [0, 12, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "radial-gradient(circle, oklch(0.78 0.14 250 / 0.45), transparent 60%)" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 size-72 rounded-full liquid-blob"
          animate={{ scale: [1, 1.25, 1], rotate: [0, 60, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "radial-gradient(circle, oklch(0.88 0.11 320 / 0.4), transparent 60%)" }}
        />

        <div className="text-center px-6 z-10">
          {/* Logo with liquid glass card */}
          <motion.div
            initial={{ scale: 0.5, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="mx-auto size-28 rounded-[2rem] grid place-items-center mb-6 glass-strong relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{
                background: "conic-gradient(from 0deg, transparent 0%, oklch(0.82 0.16 36 / 0.6) 30%, transparent 50%)",
                filter: "blur(8px)",
              }}
            />
            <Logo />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
            className="text-5xl font-bold tracking-tight"
          >
            PulsePoll
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
            className="mt-2 text-sm text-muted-foreground"
          >
            Polls, beautifully done.
          </motion.p>

          {/* Liquid progress */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="mt-12 mx-auto w-56"
          >
            <div className="relative h-2.5 rounded-full overflow-hidden glass">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, oklch(0.78 0.17 36), oklch(0.72 0.18 320))",
                  boxShadow: "0 0 20px oklch(0.78 0.17 36 / 0.6)",
                }}
              />
              <motion.div
                className="absolute inset-y-0 w-1/3 opacity-60"
                style={{ background: "linear-gradient(90deg, transparent, white, transparent)" }}
                animate={{ x: ["-100%", "300%"] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground font-medium tracking-wider">
              <div className="flex items-center gap-1.5">
                <motion.span
                  className="size-1.5 rounded-full bg-[var(--color-ember)]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                LOADING
              </div>
              <motion.span key={pct} initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                {pct}%
              </motion.span>
            </div>
          </motion.div>
        </div>
      </div>
    </PhoneShell>
  );
}

function Logo() {
  return (
    <svg viewBox="0 0 48 48" className="size-14 relative z-10" fill="none">
      <rect x="8" y="22" width="6" height="18" rx="2" fill="var(--color-ember)" />
      <rect x="21" y="14" width="6" height="26" rx="2" fill="oklch(0.13 0 0)" />
      <rect x="34" y="8" width="6" height="32" rx="2" fill="var(--color-ember)" />
    </svg>
  );
}
