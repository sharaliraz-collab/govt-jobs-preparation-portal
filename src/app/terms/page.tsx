import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import { FileText } from 'lucide-react';

export const metadata: Metadata = buildPageMetadata({
  title: 'Terms & Conditions — GovtJobs.pk',
  description:
    'Terms and Conditions governing the use of GovtJobs.pk job alerts, downloadable past papers, application forms, and online MCQ practice quizzes.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
      <article className="liquid-glass-card p-6 sm:p-10 space-y-6 text-slate-700 text-sm leading-relaxed">
        <header className="border-b border-slate-200 pb-5 space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <FileText className="w-3.5 h-3.5" />
            Terms of Use
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: November 2026
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using <strong>GovtJobs.pk</strong>, you agree to comply with and be bound by these Terms and Conditions. If you disagree with any part of these terms, please discontinue use of the website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900">
            2. Permitted Educational &amp; Personal Use
          </h2>
          <p>
            All MCQ quizzes, study guides, solved past papers, and job summaries provided on this portal are for personal, non-commercial exam preparation. Automated scraping, bulk redistribution, or framing of our proprietary quiz bank without prior written consent is prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900">
            3. User Accounts
          </h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. We reserve the right to suspend accounts that engage in abusive behavior, spam, or unauthorized access attempts.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900">
            4. Limitation of Liability
          </h2>
          <p>
            GovtJobs.pk provides recruitment information and educational test-prep materials on an &ldquo;as-is&rdquo; basis. We shall not be held liable for missed application deadlines, changes in recruitment schedules by official commissions, or exam outcomes.
          </p>
        </section>
      </article>
    </div>
  );
}
