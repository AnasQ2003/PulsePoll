import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/mobile/PhoneShell";
import { TopBar } from "@/components/mobile/TopBar";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — PulsePoll" }, { name: "description", content: "How PulsePoll handles your data." }] }),
  component: () => (
    <PhoneShell>
      <div className="h-full flex flex-col">
        <TopBar title="Privacy Policy" back right={<div />} />
        <main className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-sm leading-relaxed text-muted-foreground">
          <p className="text-xs uppercase tracking-wider text-[var(--color-ember)]">Last updated · June 2026</p>
          <p>Your privacy matters. This policy explains what information PulsePoll collects, how we use it, and the controls you have over it. By using PulsePoll you agree to the practices described here.</p>

          <section className="space-y-2">
            <h2 className="text-foreground font-semibold text-base">1. Information We Collect</h2>
            <p><span className="text-foreground font-medium">Account data:</span> email, display name, username, and (optionally) avatar, bio and phone number.</p>
            <p><span className="text-foreground font-medium">Poll activity:</span> the polls you create, the options you author, the votes you cast, and the audiences you assign.</p>
            <p><span className="text-foreground font-medium">Device & usage data:</span> basic technical details such as device type, app version, language, and anonymised usage events that help us diagnose bugs and improve the experience.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-semibold text-base">2. How We Use Your Data</h2>
            <p>We use your information to operate the service: authenticate you, show you relevant polls, tally results, deliver notifications, and protect against abuse. We also use aggregated, de-identified data to understand product performance and prioritise improvements.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-semibold text-base">3. Vote Privacy</h2>
            <p>Your individual votes are private. Poll creators see only the aggregate results (option totals and percentages), never who voted for what. PulsePoll staff do not inspect individual votes except where strictly necessary to investigate fraud or comply with a lawful request.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-semibold text-base">4. Sharing & Disclosure</h2>
            <p>We do not sell your personal data. We share data only with the providers required to run PulsePoll — secure hosting, authentication, and email delivery — under contracts that limit use to that purpose. We may disclose data if required by valid legal process, or to protect the rights, safety, or property of PulsePoll and its users.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-semibold text-base">5. Data Retention</h2>
            <p>Account data is retained for as long as your account is active. When you delete your account, your profile is removed and your polls are anonymised within 30 days. Backups containing residual data are purged on a rolling 90-day schedule.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-semibold text-base">6. Security</h2>
            <p>We use encryption in transit (TLS) and at rest for the database, scoped access controls, row-level security policies, and continuous monitoring. No system is perfectly secure — please use a strong, unique password and notify us immediately of suspicious activity.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-semibold text-base">7. Your Rights & Controls</h2>
            <p>You may view and edit your profile at any time, export the polls you've authored, and delete your account from Settings. Depending on where you live, you may also have rights to access, correct, port, restrict, or object to processing of your personal data — contact us to exercise them.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-semibold text-base">8. Children</h2>
            <p>PulsePoll is not directed at children under 13 (or the minimum age in your country). If you believe a child has provided us with personal data, contact us and we will remove the account and associated data.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-semibold text-base">9. International Transfers</h2>
            <p>PulsePoll is operated globally. Your data may be processed in jurisdictions other than your own. Where required, we rely on standard contractual clauses and equivalent safeguards to protect international transfers.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-semibold text-base">10. Changes & Contact</h2>
            <p>We will notify you of material changes to this policy at least 14 days before they take effect. Questions or requests? Reach out from Settings → Support and we'll respond within five business days.</p>
          </section>
        </main>
      </div>
    </PhoneShell>
  ),
});
