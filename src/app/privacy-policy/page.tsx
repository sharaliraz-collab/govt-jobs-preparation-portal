import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import { Shield, Lock, Cookie, Mail } from 'lucide-react';

export const metadata: Metadata = buildPageMetadata({
  title: 'Privacy Policy — GovtJobs.pk',
  description:
    'Read the Privacy Policy of GovtJobs.pk covering personal data protection, cookies, Google AdSense & DoubleClick DART cookies, and user privacy rights.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
      <article className="liquid-glass-card p-6 sm:p-10 space-y-6 text-slate-700 text-sm leading-relaxed">
        <header className="border-b border-slate-200 pb-5 space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <Shield className="w-3.5 h-3.5" />
            Legal &amp; Compliance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: November 2026
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            1. Information We Collect
          </h2>
          <p>
            At <strong>GovtJobs.pk</strong>, accessible from our official portal, protecting the privacy of our visitors and registered aspirants is one of our highest priorities. We collect information only when you voluntarily register for an account, save job postings, attempt online MCQ quizzes, or submit an inquiry:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Account Information:</strong> Name, email address, and encrypted password when you create a free aspirant profile.</li>
            <li><strong>Quiz &amp; Prep Progress:</strong> Your quiz scores, attempt history, and bookmarked job postings so you can track your preparation.</li>
            <li><strong>Log Files &amp; Analytics:</strong> Standard non-identifying browser metadata (IP address, browser type, referring/exit pages, and timestamps) used strictly to improve portal reliability and content relevance.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Cookie className="w-4 h-4 text-emerald-600" />
            2. Cookies, Google AdSense &amp; DoubleClick DART Cookie
          </h2>
          <p>
            We use cookies to store visitor preferences (such as your preferred English or Urdu language setting) and to authenticate logged-in sessions.
          </p>
          <p>
            <strong>Google AdSense &amp; Third-Party Advertising:</strong> Google, as a third-party vendor, uses cookies (including the DoubleClick DART cookie) to serve ads to users based on their visit to GovtJobs.pk and other websites on the internet. Users may opt out of the use of the DART cookie for personalized advertising by visiting the{' '}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 font-bold underline hover:text-emerald-800"
            >
              Google Ad and Content Network Privacy Policy
            </a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>To provide, operate, and maintain free job alerts, downloadable past papers, and timed MCQ tests.</li>
            <li>To personalize your dashboard with saved jobs and quiz performance analytics.</li>
            <li>To detect and prevent fraudulent submissions or unauthorized access.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-600" />
            4. Contact Us About Privacy
          </h2>
          <p>
            If you have any questions or wish to request deletion of your account data, please reach out through our{' '}
            <a href="/contact" className="text-emerald-700 font-bold underline">
              Contact Us
            </a>{' '}
            page.
          </p>
        </section>
      </article>
    </div>
  );
}
