import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import { Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact Us — GovtJobs.pk',
  description:
    'Get in touch with the GovtJobs.pk editorial and support team for job posting inquiries, corrections, MCQ feedback, or advertising partnerships.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
      <div className="liquid-glass-card p-6 sm:p-10 space-y-8 text-slate-700 text-sm">
        <header className="border-b border-slate-200 pb-5 space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <MessageSquare className="w-3.5 h-3.5" />
            Support &amp; Editorial Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Contact Us
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Have a question, correction, or suggestion? We would love to hear from you.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-2 font-extrabold text-slate-900">
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>Email Desk</span>
            </div>
            <p className="text-xs text-slate-600">support@govtjobs.pk</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-2 font-extrabold text-slate-900">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Response Hours</span>
            </div>
            <p className="text-xs text-slate-600">Mon – Sat, 9:00 AM – 6:00 PM PKT</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center gap-2 font-extrabold text-slate-900">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Coverage</span>
            </div>
            <p className="text-xs text-slate-600">Federal &amp; All Provinces of Pakistan</p>
          </div>
        </div>

        <section className="space-y-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-5">
          <h2 className="text-base font-extrabold text-slate-900">
            Report an Error or Submit a Job Notification
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            If you spot a typo in an MCQ explanation, a broken PDF link, or want to share an official recruitment advertisement for verification, please email us with the page URL and reference details. Our editorial team reviews all submissions within 24 hours.
          </p>
        </section>
      </div>
    </div>
  );
}
