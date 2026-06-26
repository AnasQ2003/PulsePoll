import { createFileRoute } from "@tanstack/react-router";
import { PhoneShell } from "@/components/mobile/PhoneShell";
import { TopBar } from "@/components/mobile/TopBar";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Service — PulsePoll" }, { name: "description", content: "PulsePoll terms of service." }] }),
  component: () => (
    <PhoneShell>
      <div className="h-full flex flex-col">
        <TopBar title="Terms of Service" back right={<div />} />
        <main className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-sm leading-relaxed text-muted-foreground">
          <p className="text-xs uppercase tracking-wider text-[var(--color-ember)]">Last updated · June 2026</p>

          <section className="space-y-2">
            <h2 className="text-foreground font-semibold text-base">1. Using PulsePoll</h2>
            <p>PulsePoll is a polling platform that helps groups make decisions together. By creating an account or accessing the service in any way, you agree to be bound by these Terms. If you do not agree, please do not use PulsePoll.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-semibold text-base">2. Eligibility & Accounts</h2>
            <p>You must be at least 13 years old (or the minimum digital-consent age in your country) to use PulsePoll. You are responsible for keeping your credentials confidential and for every action taken under your account. Notify us immediately of any unauthorized use.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-semibold text-base">3. Polls You Create</h2>
            <p>When you create a poll you control its question, options, audience and lifecycle. You may restrict voting to specific users or open it to everyone. You are solely responsible for the content of polls you publish and for honouring any commitments implied by their outcome.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-semibold text-base">4. Voting Integrity</h2>
            <p>Every voter gets one vote per poll. Attempting to manipulate results — creating fake accounts, automating votes, coercing other users, or exploiting bugs to vote more than once — is strictly prohibited and will result in immediate suspension.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-semibold text-base">5. Prohibited Content</h2>
            <p>You may not post polls, options or profile content that is illegal, defamatory, hateful, sexually explicit toward minors, or that infringes intellectual-property rights. You may not use PulsePoll to harass, dox, or threaten others, or to organise real-world harm.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-semibold text-base">6. Intellectual Property</h2>
            <p>You retain ownership of the polls and content you submit. By posting, you grant PulsePoll a worldwide, royalty-free licence to host, display, and distribute that content inside the app strictly as needed to operate the service.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-semibold text-base">7. Termination</h2>
            <p>We may suspend, delete or restrict accounts that violate these Terms, abuse other users, or compromise the platform's integrity. You may delete your own account at any time from Settings; doing so removes your profile and revokes future access to your polls.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-semibold text-base">8. Disclaimers & Liability</h2>
            <p>PulsePoll is provided "as is" without warranties of any kind, express or implied. Poll outcomes are advisory and not legally binding. To the maximum extent permitted by law, PulsePoll and its operators are not liable for any indirect, incidental or consequential damages arising from use of the service.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-semibold text-base">9. Changes to These Terms</h2>
            <p>We may update these Terms as PulsePoll evolves. Material changes will be announced inside the app at least 14 days before they take effect. Continued use after that date constitutes acceptance of the updated Terms.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-foreground font-semibold text-base">10. Contact</h2>
            <p>Questions about these Terms? Reach the PulsePoll team from Settings → Support, and we'll respond within five business days.</p>
          </section>
        </main>
      </div>
    </PhoneShell>
  ),
});
