'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Loader from '@/components/Loader';
import { QuickShareButton, SectionShareBar } from '@/components/ShareButtons';
import { downloadOfficialFormPdf } from '@/lib/pdf/clientPdfDownload';
import {
  Bell,
  FileText,
  Building,
  Briefcase,
  Gift,
  Download,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const dynamic = 'force-dynamic';

function EmployeesCornerContent() {
  const searchParams = useSearchParams();
  const { i18n } = useTranslation();
  const isUr = i18n.language === 'ur';

  const tabParam = searchParams.get('tab');
  const activeTab = tabParam || 'notifications';
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadErr, setDownloadErr] = useState('');

  const handleDownloadOfficialPdf = async (
    id: number,
    formType: 'fo1' | 'fo2',
    payload: Record<string, unknown>
  ) => {
    setDownloadErr('');
    setDownloadingId(id);
    try {
      await downloadOfficialFormPdf({ formType, data: payload });
    } catch (err) {
      setDownloadErr(err instanceof Error ? err.message : 'Could not download PDF from server.');
    } finally {
      setDownloadingId(null);
    }
  };

  const subPages = [
    { id: 'notifications', labelEn: 'Notifications', labelUr: 'نوٹیفیکیشنز', icon: Bell },
    { id: 'fo1', labelEn: 'FO1', labelUr: 'ایف او 1', icon: FileText },
    { id: 'fo2', labelEn: 'FO2', labelUr: 'ایف او 2', icon: FileText },
    { id: 'fo3', labelEn: 'FO3', labelUr: 'ایف او 3', icon: FileText },
    { id: 'forms', labelEn: 'Forms', labelUr: 'فارم', icon: Briefcase },
    { id: 'subsidies', labelEn: 'Govt Subsidies', labelUr: 'سرمایہ کاری و مراعات', icon: Gift }
  ];

  const sampleNotifications = [
    { id: 1, titleEn: 'Revised Pay Scale & Ad-hoc Relief Allowance 2026 Notification', titleUr: 'ترمیم شدہ پے سکیل اور ایڈہاک ریلیف الائونس 2026 نوٹیفکیشن', date: '2026-07-20', ref: 'No. F.1(2)Imp/2026', cat: 'Pay & Allowances' },
    { id: 2, titleEn: 'Transfer & Posting Orders of Executive Engineers (BPS-18)', titleUr: 'ایگزیکٹو انجینئرز کی تبادلے اور تعیناتی کے احکامات', date: '2026-07-18', ref: 'No. SO(Estt)849/2026', cat: 'Transfer' },
    { id: 3, titleEn: 'Annual Confidential Report (ACR) Completion Schedule 2026', titleUr: 'سالانہ خفیہ رپورٹ (ACR) کی تکمیل کا شیڈول 2026', date: '2026-07-15', ref: 'No. 4/12/ACR/2026', cat: 'General' }
  ];

  const sampleFO1 = [
    { id: 101, titleEn: 'FO1 Guidelines: Field Office Seniority Register 2026', titleUr: 'ایف او 1 رہنما اصول: فیلڈ آفس سینیارٹی رجسٹر', date: '2026-06-10', ref: 'FO1-SEC-2026/01' },
    { id: 102, titleEn: 'FO1 Circular: Gazetted Officers Duty Roster & Attendance Verification', titleUr: 'ایف او 1 سرکولر: گزیٹڈ افسران کی حاضری کی تصدیق', date: '2026-05-22', ref: 'FO1-SEC-2026/08' }
  ];

  const sampleFO2 = [
    { id: 201, titleEn: 'FO2 Regulation: Efficiency & Discipline (E&D) Hearing Procedures', titleUr: 'ایف او 2 ضوابط: کارکردگی اور نظم و ضبط کا طریقہ کار', date: '2026-06-14', ref: 'FO2-ED-2026/12' },
    { id: 202, titleEn: 'FO2 Standing Order: Official Travel & Daily Allowance (TA/DA) Claims', titleUr: 'ایف او 2 آرڈر: سرکاری سفر اور روزانہ الائونس کلیمز', date: '2026-04-30', ref: 'FO2-FIN-2026/04' }
  ];

  const sampleFO3 = [
    { id: 301, titleEn: 'FO3 Manual: General Provident Fund (GPF) Advance Rules & Commutation', titleUr: 'ایف او 3 مینول: جنرل پراویڈنٹ فنڈ قوانین', date: '2026-05-04', ref: 'FO3-GPF-2026/09' },
    { id: 302, titleEn: 'FO3 Guidelines: Pension Gratuity Computation & Direct Bank Transfer', titleUr: 'ایف او 3 ہدایات: پنشن کی ڈائریکٹ بینک منتقلی', date: '2026-03-19', ref: 'FO3-PEN-2026/15' }
  ];

  const sampleForms = [
    { id: 401, titleEn: 'Government Employee Medical Reimbursement Claim Form (Form Med-4)', titleUr: 'سرکاری ملازمین میڈیکل بل کلیم فارم', size: '1.2 MB', cat: 'Medical' },
    { id: 402, titleEn: 'Earned Leave & Casual Leave Application Form (Form L-12)', titleUr: 'رخصت کی درخواست کا فارم', size: '450 KB', cat: 'Leave' },
    { id: 403, titleEn: 'GPF Loan & House Building Advance Application (Form HBA-1)', titleUr: 'جی پی فنڈ ایڈوانس درخواست فارم', size: '890 KB', cat: 'Loans' }
  ];

  const sampleSubsidies = [
    { id: 501, titleEn: 'Federal Employees Housing Authority (FEGHS) Apartment Allotment Scheme', titleUr: 'وفاقی ملازمین ہاؤسنگ اتھارٹی فلیٹ الاٹمنٹ سکیم', status: 'Applications Open', budget: 'Up to 30% Subsidy' },
    { id: 502, titleEn: 'Utility Stores Relief Package for Govt Servants (BPS 1-16)', titleUr: 'سرکاری ملازمین کے لیے یوٹیلیٹی سٹورز ریلیف پیکیج', status: 'Active', budget: 'Monthly Subsidy' },
    { id: 503, titleEn: 'Benevolent Fund Higher Education Scholarship Grant 2026', titleUr: 'بنیولنٹ فنڈ اعلٰی تعلیمی وظائف گرائینٹ 2026', status: 'Open for Children', budget: 'PKR 50,000 / year' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner — Soft White & Pastel */}
      <div className="bg-gradient-to-br from-white via-emerald-50/50 to-sky-50/40 text-slate-900 rounded-2xl p-6 md:p-8 shadow-xs border border-slate-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-600" strokeWidth={2.25} />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Public Sector Portal</span>
          </div>
          <h1 className={`text-2xl md:text-3xl font-extrabold text-slate-900 ${isUr ? 'font-urdu' : ''}`}>
            {isUr ? 'ایمپلائز کارنر' : 'Employees Corner'}
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl">
            Official service desk for serving civil servants, pensioners, field office circulars, downloadable service forms, and government welfare subsidies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link
            href="/forms/pension-papers"
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg font-semibold text-xs transition-colors"
          >
            Pension Papers (16 A4) →
          </Link>
          <Link
            href="/forms/fo2"
            className="bg-sky-700 hover:bg-sky-800 text-white px-4 py-2.5 rounded-lg font-semibold text-xs transition-colors"
          >
            FO-2 (PAY02) A4 Landscape →
          </Link>
          <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-2 shadow-xs">
            <Building className="w-4 h-4 text-emerald-600" strokeWidth={2.25} />
            <span>Establishment Division Service Desk</span>
          </div>
        </div>
      </div>

      <SectionShareBar
        path={`/employees-corner?tab=${activeTab}`}
        title="Employees' Corner — Official Notifications, Pay Scales, FO1/FO2/FO3 & Subsidies"
        description="Official service desk for serving civil servants, pensioners, field office circulars, and welfare subsidies on GovtJobs.pk."
        badge="Employees Portal"
      />

      {/* Sub-Pages Navigation Tabs */}
      <div className="bg-white rounded-xl border border-govt-border p-2 shadow-sm flex flex-wrap gap-1">
        {subPages.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const label = isUr ? item.labelUr : item.labelEn;

          return (
            <Link
              key={item.id}
              href={`/employees-corner?tab=${item.id}`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition ${
                isActive
                  ? 'bg-govt-emerald text-white shadow'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-govt-emerald'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-govt-gold' : 'text-slate-400'}`} />
              <span className={isUr ? 'font-urdu' : ''}>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Content Rendering based on Active Sub-Page */}
      <div className="bg-white rounded-xl border border-govt-border p-6 md:p-8 shadow-sm space-y-6">

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="border-b pb-3 flex items-center justify-between">
              <div>
                <h2 className={`text-xl font-extrabold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
                  {isUr ? 'سرکاری نوٹیفیکیشنز' : 'Official Office Notifications & Circulars'}
                </h2>
                <p className="text-xs text-govt-muted">Pay scale revisions, transfer orders, and office memorandums</p>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded border border-emerald-200">
                {sampleNotifications.length} Published
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {sampleNotifications.map((n) => (
                <div key={n.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 p-3 rounded-lg transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-govt-emerald bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {n.cat}
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono">{n.ref}</span>
                    </div>
                    <h3 className={`text-sm font-bold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
                      {isUr ? n.titleUr : n.titleEn}
                    </h3>
                    <p className="text-[11px] text-slate-500">Date: {n.date}</p>
                  </div>
                  <button className="bg-govt-emerald text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow hover:bg-govt-emerald-dark transition shrink-0">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FO1 TAB */}
        {activeTab === 'fo1' && (
          <div className="space-y-6">
            <div className="border-b pb-3">
              <h2 className={`text-xl font-extrabold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
                FO1
              </h2>
              <p className="text-xs text-govt-muted">Gazetted Officers Seniority Registers & Duty Rosters</p>
            </div>

            {downloadErr && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
                {downloadErr}
              </div>
            )}

            <div className="divide-y divide-gray-100">
              {sampleFO1.map((item) => (
                <div key={item.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 p-3 rounded-lg transition">
                  <div className="space-y-1">
                    <span className="text-[11px] text-gray-400 font-mono">{item.ref}</span>
                    <h3 className={`text-sm font-bold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
                      {isUr ? item.titleUr : item.titleEn}
                    </h3>
                    <p className="text-[11px] text-slate-500">Date: {item.date}</p>
                  </div>
                  <button
                    type="button"
                    disabled={downloadingId === item.id}
                    onClick={() =>
                      handleDownloadOfficialPdf(item.id, 'fo1', {
                        title: item.titleEn,
                        refNo: item.ref,
                        date: item.date,
                        remarks: 'Official FO-1 (PAY01) blank field office entry sheet generated on GovtJobs.pk',
                      })
                    }
                    className="bg-govt-emerald text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow hover:bg-govt-emerald-dark disabled:opacity-60 transition shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadingId === item.id ? 'Generating PDF...' : 'Download FO1 PDF'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FO2 TAB */}
        {activeTab === 'fo2' && (
          <div className="space-y-6">
            <div className="border-b pb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className={`text-xl font-extrabold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
                  FO2 (FORM: PAY02)
                </h2>
                <p className="text-xs text-govt-muted">Official Payroll System Amendment Form &amp; Regulations</p>
              </div>
              <Link
                href="/forms/fo2"
                className="bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition"
              >
                Fill &amp; Download FO-2 (A4 Landscape) →
              </Link>
            </div>

            {downloadErr && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
                {downloadErr}
              </div>
            )}

            <div className="divide-y divide-gray-100">
              {sampleFO2.map((item) => (
                <div key={item.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 p-3 rounded-lg transition">
                  <div className="space-y-1">
                    <span className="text-[11px] text-gray-400 font-mono">{item.ref}</span>
                    <h3 className={`text-sm font-bold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
                      {isUr ? item.titleUr : item.titleEn}
                    </h3>
                    <p className="text-[11px] text-slate-500">Date: {item.date}</p>
                  </div>
                  <button
                    type="button"
                    disabled={downloadingId === item.id}
                    onClick={() =>
                      handleDownloadOfficialPdf(item.id, 'fo2', {
                        officeOf: item.titleEn.toUpperCase(),
                      })
                    }
                    className="bg-govt-emerald text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow hover:bg-govt-emerald-dark disabled:opacity-60 transition shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadingId === item.id ? 'Generating PDF...' : 'Download FO2 PDF'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FO3 TAB */}
        {activeTab === 'fo3' && (
          <div className="space-y-6">
            <div className="border-b pb-3">
              <h2 className={`text-xl font-extrabold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
                FO3
              </h2>
              <p className="text-xs text-govt-muted">General Provident Fund (GPF) Advance & Pension Gratuity Rules</p>
            </div>

            <div className="divide-y divide-gray-100">
              {sampleFO3.map((item) => (
                <div key={item.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 p-3 rounded-lg transition">
                  <div className="space-y-1">
                    <span className="text-[11px] text-gray-400 font-mono">{item.ref}</span>
                    <h3 className={`text-sm font-bold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
                      {isUr ? item.titleUr : item.titleEn}
                    </h3>
                    <p className="text-[11px] text-slate-500">Date: {item.date}</p>
                  </div>
                  <button className="bg-govt-emerald text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow hover:bg-govt-emerald-dark transition shrink-0">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download FO3</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FORMS TAB */}
        {activeTab === 'forms' && (
          <div className="space-y-6">
            <div className="border-b pb-3">
              <h2 className={`text-xl font-extrabold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
                {isUr ? 'سروس فارمز' : 'Forms'}
              </h2>
              <p className="text-xs text-govt-muted">Medical reimbursement, leave requests, and GPF advance forms</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleForms.map((f) => (
                <div key={f.id} className="bg-slate-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {f.cat}
                    </span>
                    <h3 className={`text-xs font-bold text-govt-charcoal mt-2 ${isUr ? 'font-urdu' : ''}`}>
                      {isUr ? f.titleUr : f.titleEn}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-200">
                    <span>PDF Document ({f.size})</span>
                    <button className="bg-govt-emerald text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow hover:bg-govt-emerald-dark transition">
                      <Download className="w-3 h-3" />
                      <span>Download Form</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GOVT SUBSIDIES TAB */}
        {activeTab === 'subsidies' && (
          <div className="space-y-6">
            <div className="border-b pb-3">
              <h2 className={`text-xl font-extrabold text-govt-charcoal ${isUr ? 'font-urdu' : ''}`}>
                {isUr ? 'حکومتی سبسیڈیز اور رعایتیں' : 'Govt Subsidies'}
              </h2>
              <p className="text-xs text-govt-muted">Housing allotments, utility store packages, and education grants</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sampleSubsidies.map((sub) => (
                <div key={sub.id} className="bg-white rounded-xl border border-govt-border p-5 shadow-sm space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded">
                      {sub.status}
                    </span>
                    <h3 className={`text-sm font-bold text-govt-charcoal mt-2 ${isUr ? 'font-urdu' : ''}`}>
                      {isUr ? sub.titleUr : sub.titleEn}
                    </h3>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-govt-emerald">{sub.budget}</span>
                    <button className="text-xs font-bold text-govt-emerald hover:underline flex items-center gap-1">
                      <span>Apply Online</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function EmployeesCornerPage() {
  return (
    <Suspense fallback={<Loader />}>
      <EmployeesCornerContent />
    </Suspense>
  );
}
