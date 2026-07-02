import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/mobile/PhoneShell";
import { TopBar } from "@/components/mobile/TopBar";
import { FileText, ShieldAlert, Scale, UserCheck, Flame, Info } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Service — PulsePoll" }, { name: "description", content: "PulsePoll terms of service and user agreements." }] }),
  component: () => (
    <PhoneShell>
      <div className="h-full flex flex-col bg-background">
        <TopBar title="Terms of Service" back right={<div />} />
        <main className="flex-1 overflow-y-auto px-5 py-6 space-y-6 text-xs leading-relaxed text-muted-foreground hide-scroll">
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl glass inner-glow flex items-start gap-3">
            <div className="size-8 rounded-xl bg-ember-soft text-ember flex items-center justify-center shrink-0">
              <FileText className="size-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--color-ember)] font-bold">Document Status: Active</p>
              <h2 className="text-foreground font-bold text-sm mt-0.5">Terms of Service & Usage</h2>
              <p className="mt-1 text-muted-foreground">Please read these terms carefully. They govern your use of the PulsePoll platform, including creating polls, casting votes, and managing user content.</p>
            </div>
          </motion.div>

          <div className="h-px bg-white/40" />

          <section className="space-y-2">
            <h2 className="text-foreground font-bold text-sm flex items-center gap-1.5">
              <UserCheck className="size-4 text-ember shrink-0" /> 1. Acceptance of Agreement
            </h2>
            <p>Welcome to PulsePoll. By creating an account, logging in, using the mobile application interface, accessing any of our API endpoints, or interacting with the service in any capacity, you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Service, our Privacy Policy, and any supplemental rules or guidelines published within the app. If you do not accept these terms in their entirety, you must immediately cease all use of PulsePoll.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-bold text-sm flex items-center gap-1.5">
              <Scale className="size-4 text-ember shrink-0" /> 2. Eligibility & Account Security
            </h2>
            <p>You must be at least 13 years of age (or the minimum legal age of digital consent in your jurisdiction, whichever is greater) to establish a PulsePoll account. If you register on behalf of an organization or legal entity, you warrant that you possess full authorized authority to bind them to this agreement.</p>
            <p className="mt-1">You are solely responsible for maintaining the absolute confidentiality of your login credentials (username, password, and authentication tokens) and for any actions taken under your account. You agree to notify our support team immediately of any unauthorized access, breach of security, or credential leakage. PulsePoll will not be held liable for any loss, liability, or damage resulting from your failure to protect your login information.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-bold text-sm flex items-center gap-1.5">
              <Flame className="size-4 text-ember shrink-0" /> 3. Community Guidelines & Integrity
            </h2>
            <p>To ensure fair and transparent outcomes, we enforce a strict policy on voting integrity:</p>
            <ul className="list-disc pl-4 space-y-1 mt-1 text-muted-foreground">
              <li><strong className="text-foreground">One Vote Per Person:</strong> Each natural person is allowed exactly one vote per poll. You may not vote multiple times on a single poll using alternate accounts or device-spoofing techniques.</li>
              <li><strong className="text-foreground">Anti-Automation:</strong> The use of bots, scripts, automated web-scrapers, macro tools, or coordinate networks to inflate, manipulate, or bias poll results is strictly prohibited.</li>
              <li><strong className="text-foreground">Coercion Free:</strong> Offering direct monetary incentives, bribes, or using threats/intimidation to force other users to vote in a specific direction will result in account ban.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-bold text-sm flex items-center gap-1.5">
              <ShieldAlert className="size-4 text-ember shrink-0" /> 4. Content Ownership & Moderation
            </h2>
            <p>You retain full intellectual property ownership of the poll descriptions, options, display names, and avatars you submit to PulsePoll. However, by publishing content on the platform, you grant PulsePoll a non-exclusive, royalty-free, worldwide, perpetual license to host, cache, distribute, reproduce, and display your polls for the operational purposes of the platform.</p>
            <p className="mt-1">We reserve the right, but assume no obligation, to pre-screen, monitor, flag, filter, or delete any user content that we determine, in our sole discretion, violates these terms, is abusive, promotes hate speech, infringes third-party copyright/trademarks, or is otherwise harmful to the community.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-bold text-sm flex items-center gap-1.5">
              <Info className="size-4 text-ember shrink-0" /> 5. Service Disclaimers & Limits
            </h2>
            <p>PulsePoll is provided to you on an "AS IS" and "AS AVAILABLE" basis, without warranty of any kind, express or implied. Poll outcomes are purely advisory and hold no legal, binding, or financial authority. We do not guarantee that the app will be uninterrupted, bug-free, or entirely secure from malicious intrusion.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-bold text-sm flex items-center gap-1.5">
              <ShieldAlert className="size-4 text-ember shrink-0" /> 6. Account Suspension & Termination
            </h2>
            <p>We reserve the right, in our sole discretion, to suspend, disable, or permanently terminate your account and access to PulsePoll without prior notice or liability if we detect violations of these terms, fraudulent actions, automated scripting (bots), user harassment, or behavior detrimental to the integrity of our polling ecosystem.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-bold text-sm flex items-center gap-1.5">
              <Scale className="size-4 text-ember shrink-0" /> 7. Amendments & Modifications
            </h2>
            <p>PulsePoll reserves the right to revise, update, or modify these Terms of Service at any time. When modifications are published, we will update the active status indicators. Your continued use of the application after such alterations constitutes your full binding acknowledgment and acceptance of the updated Terms.</p>
          </section>

          <div className="p-4 rounded-2xl glass-strong text-center text-[10px] text-muted-foreground">
            © 2026 PulsePoll Inc. All rights reserved. Registered address: 128 Innovation Way, Suite 400. Contact: legal@pulsepoll.app.
          </div>
        </main>
      </div>
    </PhoneShell>
  ),
});
