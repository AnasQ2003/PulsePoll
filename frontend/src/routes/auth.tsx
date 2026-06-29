import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { PhoneShell } from "@/components/mobile/PhoneShell";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/api";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — PulsePoll" }, { name: "description", content: "Sign in or create your PulsePoll account." }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("anas@example.com");
  const [password, setPassword] = useState("anas123");
  const [name, setName] = useState("Anas");
  const [showPwd, setShowPwd] = useState(false);
  const [accept, setAccept] = useState(true);
  const [loading, setLoading] = useState(false);
  const [termsOpen, setTermsOpen] = useState<"terms" | "privacy" | null>(null);
  const navigate = useNavigate();
  const { setAuthSession } = useAuth();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!accept) { toast.error("Please accept the Terms & Privacy Policy"); return; }
    setLoading(true);
    try {
      if (mode === "signup") {
        const username = email.split("@")[0] + Math.floor(Math.random() * 100);
        const res = await apiRequest<{ token: string; user: any }>("/auth/register", {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
            username,
            display_name: name || email.split("@")[0],
          }),
        });
        toast.success("Account created! ✨");
        setAuthSession(res.token, res.user);
      } else {
        const res = await apiRequest<{ token: string; user: any }>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        toast.success("Signed in");
        setAuthSession(res.token, res.user);
      }
      navigate({ to: "/home", replace: true });
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally { setLoading(false); }
  }

  return (
    <PhoneShell>
      <div className="h-full flex flex-col relative overflow-hidden">
        {/* Liquid background */}
        <motion.div
          className="absolute -top-40 -right-32 size-[420px] rounded-full liquid-blob"
          animate={{ scale: [1, 1.15, 1], rotate: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "radial-gradient(circle, oklch(0.82 0.16 36 / 0.55), transparent 60%)" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-32 size-[420px] rounded-full liquid-blob"
          animate={{ scale: [1.1, 0.95, 1.1], rotate: [0, -30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: "radial-gradient(circle, oklch(0.78 0.14 250 / 0.5), transparent 60%)" }}
        />

        {/* Centered card */}
        <div className="flex-1 flex items-center justify-center px-5 py-6 z-10 overflow-y-auto hide-scroll">
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="w-full max-w-sm glass-strong rounded-[2rem] p-6 sm:p-7 relative"
            style={{ boxShadow: "0 30px 80px -20px oklch(0 0 0 / 0.28), inset 0 1px 0 oklch(1 0 0 / 0.9)" }}
          >
            {/* Brand */}
            <div className="flex flex-col items-center text-center">
              <motion.div initial={{ scale: 0.5, opacity: 0, y: -8 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative size-14 rounded-2xl grid place-items-center glow-orange overflow-hidden"
                style={{ background: "linear-gradient(135deg, var(--color-ember), oklch(0.58 0.22 30))" }}>
                <motion.span className="absolute inset-0 shimmer opacity-60" />
                <svg viewBox="0 0 24 24" fill="none" className="relative z-10 size-7 text-background" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="4" height="9" rx="1.2" />
                  <rect x="10" y="6" width="4" height="14" rx="1.2" />
                  <rect x="17" y="14" width="4" height="6" rx="1.2" />
                  <path d="M5 9.5l3-3 3 2 5-5" />
                  <path d="M13 3.5h3v3" />
                </svg>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full glass">
                <span className="size-1.5 rounded-full bg-[var(--color-ember)] animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wide text-[var(--color-ember)]">POLLUX</span>
              </motion.div>
              <h1 className="mt-3 text-2xl font-bold leading-tight">
                <AnimatedText key={mode} text={mode === "login" ? "Welcome back." : "Create account."} />
              </h1>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {mode === "login" ? "Sign in to keep voting and shaping decisions." : "A few details and you're in."}
              </p>
            </div>

            {/* Liquid Toggle */}
            <div className="mt-5">
              <div className="relative grid grid-cols-2 p-1 rounded-full glass">
                <motion.div
                  layout transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.18 0 0), oklch(0.32 0 0))",
                    boxShadow: "0 6px 20px -8px oklch(0 0 0 / 0.5)",
                    left: mode === "login" ? 4 : "50%",
                  }}
                />
                {(["login", "signup"] as const).map((m) => (
                  <button key={m} type="button" onClick={() => setMode(m)}
                    className={`relative z-10 py-2.5 text-sm font-medium capitalize transition-colors ${mode === m ? "text-background" : "text-foreground"}`}>
                    {m === "login" ? "Sign in" : "Sign up"}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={submit} className="mt-5 relative">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: mode === "signup" ? 28 : -28, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: mode === "signup" ? -28 : 28, filter: "blur(6px)" }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3"
                >
                  {mode === "signup" && (
                    <Field icon={<UserIcon className="size-4" />} placeholder="Display name" value={name} onChange={setName} />
                  )}
                  <Field icon={<Mail className="size-4" />} placeholder="Email address" value={email} onChange={setEmail} type="email" />
                  
                  {/* Password Input with inline eye button (prevents overlap) */}
                  <label className="flex items-center gap-3 px-4 py-3.5 rounded-2xl prominent-field focus-within:ring-2 focus-within:ring-[var(--color-ember)]/40 transition">
                    <span className="text-muted-foreground"><Lock className="size-4" /></span>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPwd ? "text" : "password"}
                      placeholder="Password"
                      className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground min-w-0"
                    />
                    <button type="button" onClick={() => setShowPwd((v) => !v)}
                      className="text-muted-foreground hover:text-foreground transition shrink-0"
                      aria-label={showPwd ? "Hide password" : "Show password"}>
                      {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </label>

                  <label className="flex items-start gap-2 pt-1 text-xs text-muted-foreground select-none">
                    <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)}
                      className="mt-0.5 size-4 accent-[oklch(0.68_0.21_36)]" />
                    <span>
                      I agree to the{" "}
                      <button type="button" onClick={() => setTermsOpen("terms")} className="text-[var(--color-ember)] underline">Terms</button>
                      {" "}and{" "}
                      <button type="button" onClick={() => setTermsOpen("privacy")} className="text-[var(--color-ember)] underline">Privacy Policy</button>.
                    </span>
                  </label>

                  <motion.button
                    whileTap={{ scale: 0.97 }} disabled={loading} type="submit"
                    className="mt-1 w-full py-3.5 rounded-2xl font-semibold text-background relative overflow-hidden inline-flex items-center justify-center gap-2 glow-orange animate-pulse"
                    style={{ background: "linear-gradient(135deg, var(--color-ember), oklch(0.55 0.22 36))" }}>
                    <span className="absolute inset-0 shimmer opacity-50" />
                    <span className="relative z-10">{loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</span>
                    {!loading && <ArrowRight className="size-4 relative z-10" />}
                  </motion.button>

                  <p className="text-center text-xs text-muted-foreground pt-1">
                    {mode === "login" ? "New here?" : "Already have an account?"}{" "}
                    <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}
                      className="text-foreground font-medium">
                      {mode === "login" ? "Create an account" : "Sign in"}
                    </button>
                  </p>
                </motion.div>
              </AnimatePresence>
            </form>
          </motion.div>
        </div>

        <AnimatePresence>
          {termsOpen && (
            <motion.div
              className="absolute inset-0 z-50 bg-black/30 backdrop-blur-xl flex items-end"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setTermsOpen(null)}>
              <motion.div
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 280, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-h-[80%] glass-strong rounded-t-3xl p-6 overflow-y-auto">
                <div className="mx-auto h-1 w-10 rounded-full bg-border mb-4" />
                <h2 className="text-xl font-bold">{termsOpen === "terms" ? "Terms of Service" : "Privacy Policy"}</h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {termsOpen === "terms"
                    ? "By using Pollux you agree to vote honestly, treat fellow voters respectfully, and accept that poll results are advisory in nature. We may suspend accounts that violate our terms."
                    : "We collect the minimum data needed to run Pollux: your email, profile details you provide, and the votes you cast. Your individual votes are private; only aggregate results are shown."}
                </p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Full version available at <Link to={termsOpen === "terms" ? "/terms" : "/privacy"} className="text-[var(--color-ember)] underline">/{termsOpen}</Link>.
                </p>
                <button onClick={() => setTermsOpen(null)} className="mt-5 w-full py-3 rounded-2xl bg-foreground text-background font-semibold">
                  Got it
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PhoneShell>
  );
}

function Field({ icon, value, onChange, ...rest }: any) {
  return (
    <label className="flex items-center gap-3 px-4 py-3.5 rounded-2xl prominent-field focus-within:ring-2 focus-within:ring-[var(--color-ember)]/40 transition">
      <span className="text-muted-foreground">{icon}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} {...rest}
        className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground min-w-0" />
    </label>
  );
}

function AnimatedText({ text }: { text: string }) {
  return (
    <span>
      {text.split("").map((c, i) => (
        <motion.span key={i + c} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.02, type: "spring", stiffness: 300, damping: 24 }} className="inline-block">
          {c === " " ? "\u00A0" : c}
        </motion.span>
      ))}
    </span>
  );
}
