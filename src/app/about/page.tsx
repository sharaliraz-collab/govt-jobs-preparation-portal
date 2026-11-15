import type { Metadata } from 'next';
import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo';
import { Award, BookOpen, Briefcase, FileCheck, Shield } from 'lucide-react';

export const metadata: Metadata = buildPageMetadata({
  title: 'About Us — GovtJobs.pk',
  description:
    'Learn about GovtJobs.pk, Pakistan’s premier portal for verified federal & provincial government job alerts, solved past papers, and free online MCQ test preparation.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
      <article className="liquid-glass-card p-6 sm:p-10 space-y-8 text-slate-700 text-sm leading-relaxed">
        <header className="border-b border-slate-200 pb-5 space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <Award className="w-3.5 h-3.5" />
            Our Mission
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            About GovtJobs.pk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Empowering Civil Service &amp; Government Job Aspirants Across Pakistan
          </p>
        </header>

        <section className="space-y-3">
          <p>
            <strong>GovtJobs.pk</strong> was built to bridge the information gap for hundreds of thousands of students and job seekers across Pakistan. Whether you are preparing for <strong>FPSC, PPSC, SPSC, KPPSC, BPSC, NTS, ETEA, MDCAT</strong>, or departmental recruitment exams (Police Constable, Ministry of Defence, Educators), our platform brings verified job alerts and structured exam preparation together in one fast, bilingual (English &amp; Urdu) portal.
          </p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: Briefcase,
              title: 'Daily Verified Job Alerts',
              desc: 'Federal and provincial vacancies with official advertisement clippings, eligibility criteria, and deadline tracking.',
            },
            {
              icon: FileCheck,
              title: 'Interactive Timed MCQ Quizzes',
              desc: 'Thousands of subject-wise MCQs covering English, Pakistan Studies, Islamic Studies, General Science, Physics, and Biology.',
            },
            {
              icon: BookOpen,
              title: 'Solved Past Papers & Syllabus',
              desc: 'Downloadable PDF past papers, study notes, and full-length mock tests modeled on real commission exams.',
            },
            {
              icon: Shield,
              title: 'Free & Accessible on Mobile',
              desc: 'Designed for fast loading across Pakistan with full English and Urdu support.',
            },
          ].map((item) => (
            <div key={item.title} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 font-extrabold text-slate-900">
                <item.icon className="w-4 h-4 text-emerald-600 shrink-0" />
                <h3>{item.title}</h3>
              </div>
              <p className="text-xs text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href="/jobs"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
          >
            Browse Latest Jobs
          </Link>
          <Link
            href="/quizzes"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
          >
            Start MCQ Practice
          </Link>
        </div>
      </article>
    </div>
  );
}
