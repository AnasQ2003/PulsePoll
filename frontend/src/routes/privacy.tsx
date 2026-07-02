import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/mobile/PhoneShell";
import { TopBar } from "@/components/mobile/TopBar";
import { ShieldCheck, Eye, Database, Share2, Key, Info } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — PulsePoll" }, { name: "description", content: "How PulsePoll protects and handles your personal data." }] }),
  component: () => (
    <PhoneShell>
      <div className="h-full flex flex-col bg-background">
        <TopBar title="Privacy Policy" back right={<div />} />
        <main className="flex-1 overflow-y-auto px-5 py-6 space-y-6 text-xs leading-relaxed text-muted-foreground hide-scroll">
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl glass inner-glow flex items-start gap-3">
            <div className="size-8 rounded-xl bg-ember-soft text-ember flex items-center justify-center shrink-0">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--color-ember)] font-bold">Document Status: Active</p>
              <h2 className="text-foreground font-bold text-sm mt-0.5">Privacy & Trust</h2>
              <p className="mt-1 text-muted-foreground">Your trust is our priority. We collect only what is essential to run PulsePoll and guarantee that your personal vote selections remain private.</p>
            </div>
          </motion.div>

          <div className="h-px bg-white/40" />

          <section className="space-y-2">
            <h2 className="text-foreground font-bold text-sm flex items-center gap-1.5">
              <Database className="size-4 text-ember shrink-0" /> 1. Data Collection & Usage
            </h2>
            <p>We limit data collection to the minimum required details for a premium product:</p>
            <ul className="list-disc pl-4 space-y-1 mt-1 text-muted-foreground">
              <li><strong className="text-foreground">Authentication Details:</strong> Email, username, hashed password, and display name needed to secure your account.</li>
              <li><strong className="text-foreground">Activity Log:</strong> Polls you create, options you submit, votes cast, and active category views to personalize your feed.</li>
              <li><strong className="text-foreground">Technical Identifiers:</strong> Basic, anonymized telemetry (device model, application version, screen resolution) to log errors and prevent UI crashes.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-bold text-sm flex items-center gap-1.5">
              <Eye className="size-4 text-ember shrink-0" /> 2. Complete Vote Secrecy
            </h2>
            <p>We strongly support anonymous user participation:</p>
            <p className="mt-1"><strong className="text-foreground">Your choices are private.</strong> When voting on any poll, we record the vote in the database to compile statistical aggregates (counts and percentages). Neither the poll creator nor other app users can see who voted for a specific option. Statistical results are only visible in aggregate to prevent correlation targeting.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-bold text-sm flex items-center gap-1.5">
              <Share2 className="size-4 text-ember shrink-0" /> 3. Data Sharing Restrictions
            </h2>
            <p>We do not rent, trade, or sell your personal data to advertisers or third-party marketing companies. We utilize trusted, highly secure infrastructure providers (cloud database hosting, authentication backends, transactional email microservices) that are contractually prohibited from using your data for any other purpose.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-bold text-sm flex items-center gap-1.5">
              <Key className="size-4 text-ember shrink-0" /> 4. Security & Retention
            </h2>
            <p>All communication with PulsePoll API endpoints is encrypted using Transport Layer Security (TLS) protocol. Passwords are salted and hashed on entry using industry-standard cryptography. We retain active account profiles until they are deleted. When you delete your account, personal data is permanently scrubbed or anonymized in our databases within 30 days.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-bold text-sm flex items-center gap-1.5">
              <Info className="size-4 text-ember shrink-0" /> 5. Contact & Inquiries
            </h2>
            <p>If you have questions regarding this policy or wish to request data export or deletion under GDPR / CCPA guidelines, please contact us at privacy@pulsepoll.app.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-bold text-sm flex items-center gap-1.5">
              <Database className="size-4 text-ember shrink-0" /> 6. Cookie Policy & Local Browser Storage
            </h2>
            <p>PulsePoll uses local storage mechanisms (such as localStorage and session cookies) strictly to maintain your logged-in state, save your theme preferences, and prevent repeat-voting abuses. We do not deploy third-party advertising cookies, cross-site trackers, or tracking pixels of any kind.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-bold text-sm flex items-center gap-1.5">
              <Key className="size-4 text-ember shrink-0" /> 7. Children's Data Protection Policy
            </h2>
            <p>PulsePoll is not directed at or designed to collect information from children under 13 years of age. If we learn that we have inadvertently collected personal details from an individual under 13 without verified parental consent, we will take swift action to purge that data immediately from our active databases.</p>
          </section>

          <div className="p-4 rounded-2xl glass-strong text-center text-[10px] text-muted-foreground">
            © 2026 PulsePoll Inc. All rights reserved. Registered address: 128 Innovation Way, Suite 400. Contact: legal@pulsepoll.app.
          </div>
        </main>
      </div>
    </PhoneShell>
  ),
});
