import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = buildPageMetadata({
  title: 'Official Disclaimer — GovtJobs.pk',
  description:
    'Important disclaimer regarding government job advertisements, recruitment agencies (FPSC, PPSC, SPSC, KPPSC, NTS), and educational test preparation materials on GovtJobs.pk.',
  path: '/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
      <article className="liquid-glass-card p-6 sm:p-10 space-y-6 text-slate-700 text-sm leading-relaxed">
        <header className="border-b border-slate-200 pb-5 space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            <AlertCircle className="w-3.5 h-3.5" />
            Public Notice &amp; Disclaimer
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Disclaimer
          </h1>
          <p className="text-xs text-slate-500">
            Non-Affiliation &amp; Informational Accuracy Statement
          </p>
        </header>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm font-medium">
          <strong>Non-Government Affiliation Notice:</strong> GovtJobs.pk is an independent educational and career information portal. We are <strong>NOT</strong> directly affiliated with the Government of Pakistan, any provincial government, FPSC, PPSC, SPSC, KPPSC, BPSC, NTS, or any official recruitment agency.
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            1. Source of Job Advertisements
          </h2>
          <p>
            All job notifications, syllabus updates, application forms, and official notices published on GovtJobs.pk are compiled in good faith from publicly available official government gazettes, national daily newspapers (Dawn, Jang, Express, Kawish, etc.), and official testing service websites for the convenience of job seekers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900">
            2. Verification by Applicants
          </h2>
          <p>
            While our editorial team strives to verify every job posting, deadline, and qualification requirement before publication, applicants are strongly advised to verify details on the respective department or commission&apos;s official website before submitting applications or depositing any bank challan fee.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900">
            3. No Recruitment Fees Charged
          </h2>
          <p>
            GovtJobs.pk never charges candidates for viewing job listings, downloading past papers, or taking online MCQ practice quizzes, nor do we act as a recruitment agent.
          </p>
        </section>
      </article>
    </div>
  );
}
