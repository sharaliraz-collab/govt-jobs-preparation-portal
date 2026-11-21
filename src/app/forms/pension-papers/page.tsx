'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import './pension-print.css';
import {
  DEFAULT_PENSION_DATA,
  MONTHS,
  PENSION_PAGES_META,
  PensionFormData,
  SAMPLE_PENSION_DATA,
  SavedPensionCase,
  calculatePension,
  computeSuperannuationDate,
  formatMoney,
  formatYMD,
  normalizeDateInput,
  parseDateStr,
  validatePensionData,
} from '@/lib/pensionEngine';
import { buildPensionPagesHtml } from '@/lib/pensionPagesHtml';
import {
  DecodedPrefill,
  SharePrefillMode,
  buildPensionSharePayload,
  decodePrefillHash,
} from '@/lib/pensionShare';
import { downloadOfficialFormPdf } from '@/lib/pdf/clientPdfDownload';

const STORAGE_KEY = 'govtjobs_pension_draft_v2';
const LEGACY_STORAGE_KEY = 'pen';
const CASES_STORAGE_KEY = 'govtjobs_pension_saved_cases_v1';

const A4_WIDTH_PX = 793.7008; // 210mm @ 96dpi
const A4_HEIGHT_PX = 1122.5197; // 297mm @ 96dpi

type StepId = 1 | 2 | 3 | 4 | 5;

const STEPS: Array<{ id: StepId; label: string; short: string }> = [
  { id: 1, label: '1. Personal', short: 'Personal' },
  { id: 2, label: '2. Office & Bank', short: 'Office' },
  { id: 3, label: '3. Service & Pay', short: 'Service' },
  { id: 4, label: '4. Commutation', short: 'Commut.' },
  { id: 5, label: '5. Verify & PDF', short: 'PDF' },
];

const PENSION_CLASSES = [
  'SUPERANNUATION PENSION',
  'RETIRING PENSION',
  'FAMILY PENSION',
  'INVALID PENSION',
  'COMPENSATION PENSION',
];

function formatCnic(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 13);
  return (
    digits.slice(0, 5) +
    (digits.length > 5 ? '-' + digits.slice(5, 12) : '') +
    (digits.length > 12 ? '-' + digits.slice(12) : '')
  );
}

function dateStrToIso(dateStr: string): string {
  const d = parseDateStr(dateStr);
  return d ? d.toISOString().slice(0, 10) : '';
}

function isoToDateStr(iso: string): string {
  if (!iso) return '';
  const parts = iso.split('-');
  if (parts.length !== 3) return '';
  const mo = Number(parts[1]) - 1;
  if (mo < 0 || mo > 11) return '';
  return `${parts[2]}-${MONTHS[mo]}-${parts[0]}`;
}

export default function PensionPapersStudioPage() {
  const [data, setData] = useState<PensionFormData>(DEFAULT_PENSION_DATA);
  const [hydrated, setHydrated] = useState(false);
  const [activeStep, setActiveStep] = useState<StepId>(1);
  const [mobilePane, setMobilePane] = useState<'edit' | 'preview'>('edit');

  // Optional advanced accordions (kept tidy by default for fast simple cases)
  const [showOrderFields, setShowOrderFields] = useState(false);
  const [showGovtService, setShowGovtService] = useState(true);
  const [showNonQualifying, setShowNonQualifying] = useState(false);
  const [showMilitaryAndAdd, setShowMilitaryAndAdd] = useState(false);
  const [showPayRows, setShowPayRows] = useState(false);
  const [showSpecialPension, setShowSpecialPension] = useState(false);

  // Saved employee cases & WhatsApp Share drawers
  const [savedCases, setSavedCases] = useState<SavedPensionCase[]>([]);
  const [showCasesModal, setShowCasesModal] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [sharePhone, setSharePhone] = useState('');
  const [shareNote, setShareNote] = useState('');
  const [copiedMode, setCopiedMode] = useState<SharePrefillMode | null>(null);
  const [prefillBanner, setPrefillBanner] = useState<DecodedPrefill | null>(null);
  const [statusNotice, setStatusNotice] = useState('');

  // PDF page selection & preview zoom
  const [selectedPages, setSelectedPages] = useState<boolean[]>(() =>
    PENSION_PAGES_META.map(() => true)
  );
  const [pdfLoading, setPdfLoading] = useState<string | null>(null);
  const [zoomMode, setZoomMode] = useState<'fit' | '75' | '100'>('fit');
  const [fitScale, setFitScale] = useState<number>(0.85);

  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const pageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  // Load persisted draft, saved cases, and any WhatsApp #prefill=... shared payload
  useEffect(() => {
    try {
      let baseData: PensionFormData = { ...DEFAULT_PENSION_DATA };
      const savedDraft =
        window.localStorage.getItem(STORAGE_KEY) ||
        window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && typeof parsed === 'object') {
          baseData = { ...baseData, ...parsed };
        }
      }

      const incoming = decodePrefillHash(window.location.hash);
      if (incoming) {
        if (incoming.mode === 'office') {
          // Keep existing personal details if any, or start clean personal fields with shared office details
          baseData = { ...DEFAULT_PENSION_DATA, ...incoming.data };
          setActiveStep(1);
        } else {
          baseData = { ...DEFAULT_PENSION_DATA, ...incoming.data };
          setActiveStep(5);
        }
        setPrefillBanner(incoming);
        // Scrub hash cleanly from address bar so page refresh preserves subsequent edits
        try {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        } catch {
          /* ignore */
        }
      }

      setData(baseData);

      const rawCases = window.localStorage.getItem(CASES_STORAGE_KEY);
      if (rawCases) {
        const parsedCases = JSON.parse(rawCases);
        if (Array.isArray(parsedCases)) setSavedCases(parsedCases);
      }
    } catch {
      /* ignore corrupted localStorage */
    } finally {
      setHydrated(true);
    }
  }, []);

  // Auto-save draft locally
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore quota error */
    }
  }, [data, hydrated]);

  // Measure preview pane width to scale A4 sheets crisply without horizontal scrollbar
  useEffect(() => {
    const el = previewContainerRef.current;
    if (!el) return;
    const update = () => {
      const available = el.clientWidth - 32;
      if (available > 120) {
        const ratio = Math.min(1, available / A4_WIDTH_PX);
        setFitScale(Number(ratio.toFixed(3)));
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mobilePane]);

  const flashNotice = useCallback((msg: string) => {
    setStatusNotice(msg);
    window.setTimeout(() => {
      setStatusNotice((prev) => (prev === msg ? '' : prev));
    }, 3500);
  }, []);

  const calc = useMemo(() => calculatePension(data), [data]);
  const issues = useMemo(() => validatePensionData(data, calc), [data, calc]);
  const errorCount = useMemo(() => issues.filter((i) => i.level === 'error').length, [issues]);
  const warningCount = useMemo(() => issues.filter((i) => i.level === 'warning').length, [issues]);
  const pagesHtml = useMemo(() => buildPensionPagesHtml(data, calc), [data, calc]);

  const effectiveScale = zoomMode === 'fit' ? fitScale : zoomMode === '75' ? 0.75 : 1;
  const selectedPageCount = selectedPages.filter(Boolean).length;

  const fontCss =
    data.font === 'TNR'
      ? '"Times New Roman", Times, serif'
      : '"Bookman Old Style", Bookman, "URW Bookman", Georgia, "Times New Roman", serif';

  const setField = (key: string, value: string, type?: 'id' | 'cnic' | 'num' | 'date' | 'raw') => {
    let v = value;
    if (type === 'id') v = v.replace(/\D/g, '').slice(0, 8);
    else if (type === 'cnic') v = formatCnic(v);
    else if (type === 'num') v = v.replace(/[^\d.]/g, '');
    else if (type !== 'date' && type !== 'raw') v = v.toUpperCase();
    setData((prev) => ({ ...prev, [key]: v }));
  };

  const handleDateBlur = (key: string) => {
    setData((prev) => ({ ...prev, [key]: normalizeDateInput(prev[key] || '') }));
  };

  const handleAutoSuperannuation = () => {
    const dor = computeSuperannuationDate(data.dob || '');
    if (!dor) {
      flashNotice('Enter a valid Date of Birth first (e.g., 15-Mar-1966).');
      return;
    }
    setData((prev) => ({
      ...prev,
      dor,
      kind: 'Retired',
      cls: 'SUPERANNUATION PENSION',
      g0t: prev.g0t || dor,
    }));
    flashNotice(`Superannuation date set to ${dor} (1 day before 60th birthday).`);
  };

  const handleSyncGovtService = () => {
    if (!data.doj || !data.dor) {
      flashNotice('Enter Date of Joining and Date of Retirement first.');
      return;
    }
    setData((prev) => ({
      ...prev,
      g0n: prev.g0n || 'SINDH',
      g0f: prev.doj,
      g0t: prev.dor,
    }));
    setShowGovtService(true);
    flashNotice('Q.13 Government Service row auto-filled from Joining & Retirement dates.');
  };

  const handleSaveCase = () => {
    const label = (data.name || '').trim() || 'UNNAMED EMPLOYEE';
    const newCase: SavedPensionCase = {
      id: `${data.pid || 'case'}-${Date.now()}`,
      label,
      pid: data.pid || 'No ID',
      updatedAt: new Date().toISOString(),
      data: { ...data },
    };
    const next = [newCase, ...savedCases.filter((c) => !(c.pid === newCase.pid && c.label === newCase.label))].slice(0, 30);
    setSavedCases(next);
    try {
      window.localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    flashNotice(`Saved case for ${label} in this browser.`);
  };

  const handleLoadCase = (item: SavedPensionCase) => {
    setData({ ...DEFAULT_PENSION_DATA, ...item.data });
    setShowCasesModal(false);
    flashNotice(`Loaded saved case: ${item.label}`);
  };

  const handleDeleteCase = (id: string) => {
    const next = savedCases.filter((c) => c.id !== id);
    setSavedCases(next);
    try {
      window.localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const handleExportJson = () => {
    const safeName = (data.name || 'pension-case')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName || 'pension-case'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    flashNotice('Backup JSON exported — transfer to any PC and import anytime.');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        if (parsed && typeof parsed === 'object') {
          setData({ ...DEFAULT_PENSION_DATA, ...parsed });
          flashNotice(`Imported case from ${file.name}.`);
        }
      } catch {
        flashNotice('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCopyShareLink = async (mode: SharePrefillMode) => {
    const payload = buildPensionSharePayload(mode, data, {
      phone: sharePhone,
      senderNote: shareNote,
    });
    try {
      await navigator.clipboard.writeText(payload.shareUrl);
      setCopiedMode(mode);
      window.setTimeout(() => setCopiedMode((prev) => (prev === mode ? null : prev)), 2200);
      flashNotice(
        mode === 'tool'
          ? 'Tool link copied — paste in WhatsApp for rich preview card.'
          : mode === 'office'
          ? 'Office pre-fill link copied — send to employee so they can add personal details.'
          : 'Full draft link copied — send to clerk / printer PC to print all 16 pages.'
      );
    } catch {
      flashNotice('Could not copy automatically — use the Share on WhatsApp button instead.');
    }
  };

  const handleOpenWhatsApp = (mode: SharePrefillMode) => {
    const payload = buildPensionSharePayload(mode, data, {
      phone: sharePhone,
      senderNote: shareNote,
    });
    window.open(payload.whatsappHref, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadSelectedPdf = async () => {
    if (pdfLoading) return;
    const indices = selectedPages
      .map((checked, idx) => (checked ? idx : -1))
      .filter((idx) => idx >= 0);
    if (indices.length === 0) {
      flashNotice('Select at least one page to download as PDF.');
      return;
    }
    setPdfLoading('all');
    try {
      const filename = await downloadOfficialFormPdf({
        formType: 'pension-papers',
        data,
        selectedPages: indices,
      });
      flashNotice(`Official PDF downloaded (${indices.length} pages): ${filename}`);
    } catch (err) {
      flashNotice(err instanceof Error ? err.message : 'Server PDF generation failed.');
    } finally {
      setPdfLoading(null);
    }
  };

  const handleDownloadSinglePagePdf = async (pageIdx: number) => {
    if (pdfLoading) return;
    setPdfLoading(`page-${pageIdx}`);
    try {
      const filename = await downloadOfficialFormPdf({
        formType: 'pension-papers',
        data,
        selectedPages: [pageIdx],
      });
      flashNotice(`Page ${pageIdx + 1} PDF downloaded: ${filename}`);
    } catch (err) {
      flashNotice(err instanceof Error ? err.message : 'Server PDF generation failed.');
    } finally {
      setPdfLoading(null);
    }
  };

  const jumpToField = (step: StepId, fieldKey: string) => {
    setActiveStep(step);
    setMobilePane('edit');
    window.setTimeout(() => {
      const el = document.querySelector<HTMLElement>(`[data-field="${fieldKey}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
    }, 80);
  };

  const scrollToPreviewPage = (idx: number) => {
    setMobilePane('preview');
    window.setTimeout(() => {
      const el = pageRefs.current[idx];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const renderDateInput = (key: string, label: string, placeholder = '01-Jan-1995') => {
    const val = data[key] || '';
    const isInvalid = Boolean(val && !parseDateStr(val));
    return (
      <div>
        {label && (
          <label className="block text-[11px] font-medium text-slate-700 mb-1">{label}</label>
        )}
        <div className="flex items-stretch gap-1">
          <input
            type="text"
            data-field={key}
            value={val}
            maxLength={11}
            placeholder={placeholder}
            onChange={(e) => setField(key, e.target.value, 'date')}
            onBlur={() => handleDateBlur(key)}
            className={`w-full px-2.5 py-1.5 rounded border text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-slate-900 ${
              isInvalid ? 'border-rose-500 bg-rose-50/40' : 'border-slate-300'
            }`}
          />
          <label
            title="Pick from calendar"
            className="relative shrink-0 px-2 rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 text-[11px] font-medium text-slate-700 flex items-center cursor-pointer select-none"
          >
            Cal
            <input
              type="date"
              tabIndex={-1}
              value={dateStrToIso(val)}
              onChange={(e) => {
                const converted = isoToDateStr(e.target.value);
                if (converted) setField(key, converted, 'date');
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
        </div>
      </div>
    );
  };

  const renderTextInput = (
    key: string,
    label: string,
    opts?: {
      placeholder?: string;
      type?: 'id' | 'cnic' | 'num' | 'raw';
      maxLength?: number;
      hint?: string;
    }
  ) => {
    const val = data[key] || '';
    const invalidId = opts?.type === 'id' && Boolean(val) && val.length !== 8;
    const invalidCnic = opts?.type === 'cnic' && Boolean(val) && val.length !== 15;
    return (
      <div>
        <label className="block text-[11px] font-medium text-slate-700 mb-1">{label}</label>
        <input
          type="text"
          data-field={key}
          value={val}
          maxLength={opts?.maxLength}
          inputMode={
            opts?.type === 'id' || opts?.type === 'cnic'
              ? 'numeric'
              : opts?.type === 'num'
              ? 'decimal'
              : undefined
          }
          placeholder={opts?.placeholder}
          onChange={(e) => setField(key, e.target.value, opts?.type)}
          className={`w-full px-2.5 py-1.5 rounded border text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-slate-900 ${
            invalidId || invalidCnic ? 'border-rose-500 bg-rose-50/40' : 'border-slate-300'
          }`}
        />
        {opts?.hint && <p className="mt-0.5 text-[10px] text-slate-500">{opts.hint}</p>}
      </div>
    );
  };

  return (
    <div className="bg-slate-100/80 min-h-screen text-slate-900 font-sans">
      {/* Top Sticky Editorial Utility & Live Calculation Bar (Hidden on Print) */}
      <div className="pp-no-print bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-5 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <Link href="/" className="hover:text-slate-900">
                  Home
                </Link>
                <span>/</span>
                <Link href="/forms" className="hover:text-slate-900">
                  Official Forms
                </Link>
                <span>/</span>
                <span className="text-slate-900 font-medium">Pension Papers Studio</span>
              </div>
              <h1 className="text-sm sm:text-base font-serif font-semibold text-slate-950 tracking-tight truncate">
                Government Pension Papers — Fill Once &amp; Download All 16 Official A4 PDF Pages
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                disabled={Boolean(pdfLoading)}
                onClick={handleDownloadSelectedPdf}
                className="px-3.5 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white text-xs font-semibold transition-colors"
              >
                {pdfLoading === 'all'
                  ? 'Generating Official PDF...'
                  : `Download PDF (${selectedPageCount}/16)`}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSharePanel((v) => !v);
                  setShowCasesModal(false);
                }}
                className={`px-3 py-1.5 rounded-md border text-xs font-semibold transition-colors ${
                  showSharePanel
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:border-emerald-600'
                }`}
              >
                Share on WhatsApp
              </button>
              <button
                type="button"
                onClick={handleSaveCase}
                className="px-2.5 py-1.5 rounded-md border border-slate-300 bg-white hover:border-slate-500 text-slate-800 text-xs font-medium transition-colors"
              >
                Save Case
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCasesModal((v) => !v);
                  setShowSharePanel(false);
                }}
                className="px-2.5 py-1.5 rounded-md border border-slate-300 bg-white hover:border-slate-500 text-slate-800 text-xs font-medium transition-colors"
              >
                Saved ({savedCases.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setData({ ...SAMPLE_PENSION_DATA });
                  flashNotice('Sample retiring employee loaded — inspect all 16 live A4 pages.');
                }}
                className="px-2.5 py-1.5 rounded-md border border-slate-300 bg-slate-50 hover:border-slate-500 text-slate-800 text-xs font-medium transition-colors"
              >
                Load Sample
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Clear all entered fields and start a blank pension case?')) {
                    setData({ ...DEFAULT_PENSION_DATA });
                    flashNotice('Started a blank pension case.');
                  }
                }}
                className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-white hover:border-rose-400 hover:text-rose-700 text-slate-600 text-xs font-medium transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Live Calculation Verification Strip */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            <div className="bg-slate-50 border border-slate-200/80 rounded px-2.5 py-1.5">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                Qualifying Service
              </div>
              <div className="font-semibold text-slate-950 tabular-nums">
                {calc.tqYMD ? formatYMD(calc.tqYMD) : '—'}
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded px-2.5 py-1.5">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                Gross Pension (Monthly)
              </div>
              <div className="font-semibold text-slate-950 tabular-nums">
                {calc.gross ? `Rs. ${formatMoney(calc.gross)}` : '—'}
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded px-2.5 py-1.5">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                Net Monthly Pension
              </div>
              <div className="font-semibold text-emerald-800 tabular-nums">
                {calc.tn ? `Rs. ${formatMoney(calc.tn)}` : '—'}
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded px-2.5 py-1.5">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                Age Next B&apos;day · Rate
              </div>
              <div className="font-semibold text-slate-950 tabular-nums">
                {calc.age ? `${calc.age} yrs · ${calc.rate ? calc.rate.toFixed(4) : 'N/A'}` : '—'}
              </div>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200 rounded px-2.5 py-1.5">
              <div className="text-[10px] uppercase tracking-wider text-emerald-800">
                Lump Sum Commutation
              </div>
              <div className="font-semibold text-emerald-950 tabular-nums">
                {calc.lump ? `Rs. ${formatMoney(calc.lump)}` : '—'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveStep(5);
                setMobilePane('edit');
              }}
              className={`text-left rounded px-2.5 py-1.5 border transition-colors ${
                errorCount > 0
                  ? 'bg-rose-50 border-rose-200 hover:border-rose-400'
                  : warningCount > 0
                  ? 'bg-amber-50 border-amber-200 hover:border-amber-400'
                  : 'bg-emerald-50 border-emerald-200 hover:border-emerald-400'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider text-slate-600">
                Pre-Print Check
              </div>
              <div
                className={`font-semibold tabular-nums ${
                  errorCount > 0
                    ? 'text-rose-800'
                    : warningCount > 0
                    ? 'text-amber-900'
                    : 'text-emerald-800'
                }`}
              >
                {errorCount > 0
                  ? `${errorCount} Required · ${warningCount} Warn`
                  : warningCount > 0
                  ? `Ready · ${warningCount} Notice`
                  : 'All Verified Ready'}
              </div>
            </button>
          </div>

          {statusNotice && (
            <div className="mt-2 px-3 py-1.5 rounded bg-slate-900 text-white text-xs flex items-center justify-between">
              <span>{statusNotice}</span>
              <button
                type="button"
                onClick={() => setStatusNotice('')}
                className="text-slate-300 hover:text-white text-[11px] ml-3"
              >
                Dismiss
              </button>
            </div>
          )}

          {prefillBanner && (
            <div className="mt-2 px-3.5 py-2.5 rounded-md border border-emerald-300 bg-emerald-50 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-0.5">
                <p className="font-semibold">
                  {prefillBanner.mode === 'office'
                    ? 'Office & D.D.O details pre-filled from WhatsApp link — please enter your Personal, Bank & Service details.'
                    : `Loaded shared pension draft${data.name ? ` for ${data.name}` : ''} — review Step 5 and click Print / Save PDF.`}
                </p>
                {prefillBanner.senderNote && (
                  <p className="text-[11px] text-emerald-800">
                    Sender note: {prefillBanner.senderNote}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {prefillBanner.mode === 'office' ? (
                  <button
                    type="button"
                    onClick={() => setShowSharePanel(true)}
                    className="px-2.5 py-1 rounded bg-emerald-700 text-white text-[11px] font-semibold hover:bg-emerald-800"
                  >
                    Send Back on WhatsApp When Done
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveCase}
                    className="px-2.5 py-1 rounded bg-slate-900 text-white text-[11px] font-semibold hover:bg-slate-800"
                  >
                    Save to This PC&apos;s Cases
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPrefillBanner(null)}
                  className="text-[11px] text-emerald-800 hover:text-emerald-950 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* WhatsApp Collaborative Link Sharing Panel */}
          {showSharePanel && (
            <div className="mt-2.5 p-4 rounded-md border border-slate-300 bg-slate-50 space-y-3.5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-xs font-semibold text-slate-950 uppercase tracking-wider">
                    Share on WhatsApp — Send Link to Add Details or Print
                  </h2>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Pre-filled details travel privately inside the URL hash (#prefill) and are never
                    uploaded to any server.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSharePanel(false)}
                  className="px-2.5 py-1 rounded border border-slate-200 bg-white text-[11px] text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Recipient WhatsApp Number (optional — e.g., 0300-1234567)
                  </label>
                  <input
                    type="text"
                    value={sharePhone}
                    onChange={(e) => setSharePhone(e.target.value)}
                    placeholder="Leave blank to choose contact or group in WhatsApp"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Short Note for Recipient (optional)
                  </label>
                  <input
                    type="text"
                    maxLength={140}
                    value={shareNote}
                    onChange={(e) => setShareNote(e.target.value)}
                    placeholder="e.g., Please fill CNIC, DOB & Bank IBAN and send back by Friday"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-2.5">
                {/* Card 1: Clerk -> Employee */}
                <div className="bg-white border border-slate-200 rounded-md p-3 flex flex-col justify-between gap-2.5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                      For D.D.O / Office Clerk → Employee
                    </p>
                    <h3 className="text-xs font-semibold text-slate-950 mt-0.5">
                      Send Link to Employee to Add Details
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      Pre-fills your Office, Department, D.D.O &amp; DAO station so the retiring
                      employee only enters their own Name, CNIC, DOB &amp; Bank Account on phone.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenWhatsApp('office')}
                      className="flex-1 py-1.5 px-2.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold transition-colors"
                    >
                      WhatsApp Employee
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyShareLink('office')}
                      className="py-1.5 px-2.5 rounded border border-slate-300 bg-white hover:border-slate-600 text-[11px] font-medium text-slate-800"
                    >
                      {copiedMode === 'office' ? 'Copied' : 'Copy Link'}
                    </button>
                  </div>
                </div>

                {/* Card 2: Employee -> Clerk / Printer PC */}
                <div className="bg-white border border-slate-200 rounded-md p-3 flex flex-col justify-between gap-2.5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      For Employee → Clerk / Printer PC
                    </p>
                    <h3 className="text-xs font-semibold text-slate-950 mt-0.5">
                      Send Filled Details Back to Print
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      Packages all entered Personal, Service, Pay &amp; Bank details into one
                      private link. Open on the office computer to verify &amp; print all 16 pages.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenWhatsApp('full')}
                      className="flex-1 py-1.5 px-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold transition-colors"
                    >
                      WhatsApp Full Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyShareLink('full')}
                      className="py-1.5 px-2.5 rounded border border-slate-300 bg-white hover:border-slate-600 text-[11px] font-medium text-slate-800"
                    >
                      {copiedMode === 'full' ? 'Copied' : 'Copy Link'}
                    </button>
                  </div>
                </div>

                {/* Card 3: Clean Tool Share (Rich Preview Card) */}
                <div className="bg-white border border-slate-200 rounded-md p-3 flex flex-col justify-between gap-2.5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      For Staff Groups &amp; Colleagues
                    </p>
                    <h3 className="text-xs font-semibold text-slate-950 mt-0.5">
                      Share Blank Tool Link (Rich Card)
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      Shares the clean GovtJobs.pk Pension Papers Studio URL with full WhatsApp
                      preview image so any employee can prepare their own papers free.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenWhatsApp('tool')}
                      className="flex-1 py-1.5 px-2.5 rounded border border-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-[11px] font-semibold transition-colors"
                    >
                      Share in Group
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyShareLink('tool')}
                      className="py-1.5 px-2.5 rounded border border-slate-300 bg-white hover:border-slate-600 text-[11px] font-medium text-slate-800"
                    >
                      {copiedMode === 'tool' ? 'Copied' : 'Copy Link'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Saved Cases & Backup Panel */}
          {showCasesModal && (
            <div className="mt-2.5 p-3.5 rounded-md border border-slate-300 bg-slate-50 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Saved Employee Cases (Stored Locally in This Browser Only)
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Switch between multiple retiring employees or export a JSON backup to print on
                    another PC.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:border-slate-500 text-[11px] font-medium"
                  >
                    Export Backup (.json)
                  </button>
                  <button
                    type="button"
                    onClick={() => importInputRef.current?.click()}
                    className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:border-slate-500 text-[11px] font-medium"
                  >
                    Import Backup
                  </button>
                  <input
                    ref={importInputRef}
                    type="file"
                    accept="application/json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCasesModal(false)}
                    className="px-2.5 py-1 rounded border border-slate-200 bg-white text-[11px] text-slate-600"
                  >
                    Close
                  </button>
                </div>
              </div>

              {savedCases.length === 0 ? (
                <p className="text-xs text-slate-500 py-2">
                  No saved cases yet. Fill an employee&apos;s details and click <b>Save Case</b>.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {savedCases.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 rounded p-2.5 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 truncate">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-slate-500 tabular-nums">
                          ID: {item.pid} · {new Date(item.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleLoadCase(item)}
                          className="px-2 py-1 rounded bg-slate-900 text-white text-[11px] font-medium"
                        >
                          Open
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCase(item.id)}
                          className="px-2 py-1 rounded border border-slate-200 text-[11px] text-rose-700 hover:border-rose-400"
                        >
                          Del
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mobile Mode Switcher */}
          <div className="lg:hidden mt-2.5 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setMobilePane('edit')}
              className={`py-1.5 rounded text-xs font-semibold border ${
                mobilePane === 'edit'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              Fill Details
            </button>
            <button
              type="button"
              onClick={() => setMobilePane('preview')}
              className={`py-1.5 rounded text-xs font-semibold border ${
                mobilePane === 'preview'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              Live A4 Preview (16 Pages)
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Workspace: Left Guided Editor + Right Pixel-Perfect A4 Preview */}
      <div className="max-w-[1600px] mx-auto lg:grid lg:grid-cols-[440px_1fr] items-start pp-print-root">
        {/* LEFT PANE: GUIDED 5-STEP FORM (Hidden on Print) */}
        <aside
          className={`pp-no-print bg-white border-r border-slate-200 lg:sticky lg:top-[116px] lg:h-[calc(100vh-116px)] lg:overflow-y-auto ${
            mobilePane === 'edit' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Step Tabs */}
          <div className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 px-3 py-2 grid grid-cols-5 gap-1">
            {STEPS.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setActiveStep(st.id)}
                className={`px-1.5 py-1.5 rounded text-[11px] font-semibold transition-colors truncate ${
                  activeStep === st.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400 hover:text-slate-900'
                }`}
              >
                {st.id}. {st.short}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-4">
            {/* STEP 1: EMPLOYEE PERSONAL PARTICULARS */}
            {activeStep === 1 && (
              <div className="space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                    Step 1 — Employee Personal Particulars
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Auto-fills Cover, Forwarding Letter, Form 3 (Part I &amp; II), All Certificates,
                    Descriptive Roll, and LPC.
                  </p>
                </div>

                <div className="grid grid-cols-[90px_1fr] gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Title
                    </label>
                    <select
                      data-field="pre"
                      value={data.pre || 'Mr.'}
                      onChange={(e) => setField('pre', e.target.value, 'raw')}
                      className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs font-semibold bg-white"
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Mst.">Mst.</option>
                      <option value="Miss">Miss</option>
                    </select>
                  </div>
                  {renderTextInput('name', 'Employee Full Name*', {
                    placeholder: 'e.g., ABDUL GHAFFAR SOOMRO',
                  })}
                </div>

                <div className="grid grid-cols-[90px_1fr] gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Relation
                    </label>
                    <select
                      data-field="rel"
                      value={data.rel || 'S/O'}
                      onChange={(e) => setField('rel', e.target.value, 'raw')}
                      className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs font-semibold bg-white"
                    >
                      <option value="S/O">S/O</option>
                      <option value="D/O">D/O</option>
                      <option value="W/O">W/O</option>
                    </select>
                  </div>
                  {renderTextInput('father', 'Father / Husband Name*', {
                    placeholder: 'e.g., MUHAMMAD IBRAHIM SOOMRO',
                  })}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {renderTextInput('pid', 'Personal / Pay Roll ID (8 digits)', {
                    type: 'id',
                    maxLength: 8,
                    placeholder: '10482915',
                  })}
                  {renderTextInput('cnic', 'CNIC (00000-0000000-0)*', {
                    type: 'cnic',
                    maxLength: 15,
                    placeholder: '45203-1234567-1',
                  })}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {renderTextInput('caste', 'Caste', { placeholder: 'e.g., SOOMRO' })}
                  {renderTextInput('nat', 'Nationality', { placeholder: 'PAKISTANI' })}
                </div>

                <div>
                  {renderDateInput('dob', 'Date of Birth (DD-Mon-YYYY)*', '15-Mar-1966')}
                  {parseDateStr(data.dob) && (
                    <button
                      type="button"
                      onClick={handleAutoSuperannuation}
                      className="mt-1.5 text-[11px] font-medium text-emerald-800 hover:text-emerald-950 underline underline-offset-4"
                    >
                      Auto-fill 60-yr Superannuation Date ({computeSuperannuationDate(data.dob)}) →
                    </button>
                  )}
                </div>

                {renderTextInput('desig', 'Designation / Post (with BPS)*', {
                  placeholder: 'e.g., HIGH SCHOOL TEACHER (BPS-16)',
                })}

                <div className="grid grid-cols-2 gap-2">
                  {renderTextInput('height', 'Height', { placeholder: 'e.g., 5 FT 8 INCHES' })}
                  {renderTextInput('marks', 'Identification Marks', {
                    placeholder: 'e.g., MOLE ON RIGHT CHEEK',
                  })}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Postal Address*
                  </label>
                  <textarea
                    rows={2}
                    data-field="addr"
                    value={data.addr || ''}
                    placeholder="HOUSE NO., STREET / VILLAGE, TEHSIL, DISTRICT"
                    onChange={(e) => setField('addr', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: OFFICE, DDO & BANK */}
            {activeStep === 2 && (
              <div className="space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                    Step 2 — Department, D.D.O &amp; Payment Bank
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Populates DAO forwarding letter, DDO signature blocks, Commutation Payment
                    Certificate, and Descriptive Roll.
                  </p>
                </div>

                {renderTextInput('dept', 'Department*', {
                  placeholder: 'e.g., SCHOOL EDUCATION & LITERACY',
                })}
                {renderTextInput('office', 'Office / School / Unit Name*', {
                  placeholder: 'e.g., GOVT BOYS HIGH SCHOOL, KHAIRPUR',
                })}

                <div className="grid grid-cols-2 gap-2">
                  {renderTextInput('ddo', 'D.D.O Full Name', {
                    placeholder: 'e.g., GHULAM SARWAR SHAIKH',
                  })}
                  {renderTextInput('ddod', 'D.D.O Designation', {
                    placeholder: 'e.g., HEAD MASTER (BPS-17)',
                  })}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {renderTextInput('ddoPlace', 'Office Station / City', {
                    placeholder: 'e.g., KHAIRPUR MIRS',
                  })}
                  {renderTextInput('pplace', 'DAO / Place of Payment*', {
                    placeholder: 'e.g., KHAIRPUR MIRS',
                  })}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Class of Pension Applied For
                  </label>
                  <select
                    data-field="cls"
                    value={
                      PENSION_CLASSES.includes(data.cls || '')
                        ? data.cls
                        : 'SUPERANNUATION PENSION'
                    }
                    onChange={(e) => setField('cls', e.target.value, 'raw')}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold bg-white"
                  >
                    {PENSION_CLASSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {renderTextInput('bank', 'Pension Bank & Branch Name', {
                  placeholder: 'e.g., NATIONAL BANK OF PAKISTAN (MAIN BRANCH)',
                })}
                <div className="grid grid-cols-2 gap-2">
                  {renderTextInput('acct', 'Bank Account / IBAN No.', {
                    placeholder: 'PK42NBPA...',
                  })}
                  {renderTextInput('ppo', 'P.P.O No. (if issued)', {
                    placeholder: 'Leave blank if new',
                  })}
                </div>

                {/* Optional Retirement Order / Sanction Authority Fields */}
                <div className="border border-slate-200 rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowOrderFields((v) => !v)}
                    className="w-full px-3 py-2 bg-slate-50 text-left text-[11px] font-semibold text-slate-700 flex items-center justify-between"
                  >
                    <span>Optional: Retirement Order No. &amp; Sanctioning Authority</span>
                    <span>{showOrderFields ? 'Hide' : 'Open'}</span>
                  </button>
                  {showOrderFields && (
                    <div className="p-3 space-y-2.5 border-t border-slate-200">
                      <div className="grid grid-cols-2 gap-2">
                        {renderTextInput('orderNo', 'Retirement Order No.', {
                          placeholder: 'NO. DEO/2026/1482',
                        })}
                        {renderDateInput('orderDate', 'Order Date', '02-Mar-2026')}
                      </div>
                      {renderTextInput('sanctionAuth', 'Sanctioning Authority', {
                        placeholder: 'e.g., DIRECTOR SCHOOLS SUKKUR',
                      })}
                      {renderTextInput('authNo', 'AG Authority No. (if any)', {
                        placeholder: 'Optional',
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: SERVICE DATES & PAY CALCULATION */}
            {activeStep === 3 && (
              <div className="space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                    Step 3 — Service Dates, Emoluments &amp; Qualifying Service
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Calculates exact Years / Months / Days and Gross Pension automatically.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {renderDateInput('doj', 'Date of Joining*', '12-Aug-1994')}
                  {renderDateInput('dor', 'Retirement / Death Date*', '14-Mar-2026')}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {renderDateInput('dapp', 'Application / Letter Date', '16-Mar-2026')}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Retirement Status
                    </label>
                    <select
                      data-field="kind"
                      value={data.kind || 'Retired'}
                      onChange={(e) => setField('kind', e.target.value, 'raw')}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold bg-white"
                    >
                      <option value="Retired">Retired</option>
                      <option value="Expired">Expired (In-Service Death)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {renderTextInput('lastpay', 'Last Basic Pay (Rs.)*', {
                    type: 'num',
                    placeholder: '96850',
                    hint: 'Printed on A.T.C.5 LPC & used if emoluments blank.',
                  })}
                  {renderTextInput('emol', 'Average Emoluments (Rs.)', {
                    type: 'num',
                    placeholder: 'Auto = Last Pay',
                    hint: 'Leave blank to use Last Basic Pay directly.',
                  })}
                </div>

                {/* Q.13 Government Service Chronological Table */}
                <div className="border border-slate-200 rounded-md overflow-hidden">
                  <div className="px-3 py-2 bg-slate-50 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setShowGovtService((v) => !v)}
                      className="text-[11px] font-semibold text-slate-800 text-left"
                    >
                      Government Service History (Q.13) {showGovtService ? '▾' : '▸'}
                    </button>
                    <button
                      type="button"
                      onClick={handleSyncGovtService}
                      className="text-[10px] font-semibold text-emerald-800 hover:underline"
                    >
                      Auto-fill from DOJ–DOR
                    </button>
                  </div>
                  {showGovtService && (
                    <div className="p-2.5 space-y-2 border-t border-slate-200">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="grid grid-cols-[1.2fr_1fr_1fr] gap-1.5">
                          <input
                            type="text"
                            data-field={`g${i}n`}
                            value={data[`g${i}n`] || ''}
                            placeholder={i === 0 ? 'SINDH' : 'Other Govt'}
                            onChange={(e) => setField(`g${i}n`, e.target.value)}
                            className="px-2 py-1 rounded border border-slate-300 text-[11px] font-semibold"
                          />
                          <input
                            type="text"
                            value={data[`g${i}f`] || ''}
                            maxLength={11}
                            placeholder="From"
                            onChange={(e) => setField(`g${i}f`, e.target.value, 'date')}
                            onBlur={() => handleDateBlur(`g${i}f`)}
                            className="px-2 py-1 rounded border border-slate-300 text-[11px] font-semibold"
                          />
                          <input
                            type="text"
                            value={data[`g${i}t`] || ''}
                            maxLength={11}
                            placeholder="To"
                            onChange={(e) => setField(`g${i}t`, e.target.value, 'date')}
                            onBlur={() => handleDateBlur(`g${i}t`)}
                            className="px-2 py-1 rounded border border-slate-300 text-[11px] font-semibold"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Collapsible Advanced: 4-Row Emoluments (Section 3) */}
                <div className="border border-slate-200 rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowPayRows((v) => !v)}
                    className="w-full px-3 py-2 bg-slate-50 text-left text-[11px] font-semibold text-slate-700 flex items-center justify-between"
                  >
                    <span>Optional: 4-Period Pay Breakdown (Section 3 Table)</span>
                    <span>{showPayRows ? 'Hide' : 'Open'}</span>
                  </button>
                  {showPayRows && (
                    <div className="p-2.5 space-y-2 border-t border-slate-200">
                      <p className="text-[10px] text-slate-500">
                        Only needed if pay changed during the last 12 months before retirement.
                      </p>
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="grid grid-cols-[1fr_1fr_82px] gap-1.5">
                          <input
                            type="text"
                            value={data[`p${i}f`] || ''}
                            maxLength={11}
                            placeholder={`From ${i + 1}`}
                            onChange={(e) => setField(`p${i}f`, e.target.value, 'date')}
                            onBlur={() => handleDateBlur(`p${i}f`)}
                            className="px-2 py-1 rounded border border-slate-300 text-[11px] font-semibold"
                          />
                          <input
                            type="text"
                            value={data[`p${i}t`] || ''}
                            maxLength={11}
                            placeholder="To"
                            onChange={(e) => setField(`p${i}t`, e.target.value, 'date')}
                            onBlur={() => handleDateBlur(`p${i}t`)}
                            className="px-2 py-1 rounded border border-slate-300 text-[11px] font-semibold"
                          />
                          <input
                            type="text"
                            inputMode="decimal"
                            value={data[`p${i}r`] || ''}
                            placeholder="Rate Rs."
                            onChange={(e) => setField(`p${i}r`, e.target.value, 'num')}
                            className="px-2 py-1 rounded border border-slate-300 text-[11px] font-semibold"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Collapsible Advanced: Non-Qualifying Service (7 rows) */}
                <div className="border border-slate-200 rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowNonQualifying((v) => !v)}
                    className="w-full px-3 py-2 bg-slate-50 text-left text-[11px] font-semibold text-slate-700 flex items-center justify-between"
                  >
                    <span>Optional: Non-Qualifying Service Interruptions (I–VII)</span>
                    <span>{showNonQualifying ? 'Hide' : 'Open'}</span>
                  </button>
                  {showNonQualifying && (
                    <div className="p-2.5 space-y-2 border-t border-slate-200">
                      {[
                        'I. Age < 18 yrs',
                        'II. Extraordinary Leave',
                        'III. Suspension',
                        'IV. Breaks in service',
                        'V. Uncondoned break',
                        'VI. Forfeited by resignation',
                        'VII. Unauthorized absence',
                      ].map((label, i) => (
                        <div key={i} className="space-y-0.5">
                          <span className="text-[10px] font-medium text-slate-600">{label}</span>
                          <div className="grid grid-cols-2 gap-1.5">
                            <input
                              type="text"
                              value={data[`n${i}f`] || ''}
                              maxLength={11}
                              placeholder="From (DD-Mon-YYYY)"
                              onChange={(e) => setField(`n${i}f`, e.target.value, 'date')}
                              onBlur={() => handleDateBlur(`n${i}f`)}
                              className="px-2 py-1 rounded border border-slate-300 text-[11px] font-semibold"
                            />
                            <input
                              type="text"
                              value={data[`n${i}t`] || ''}
                              maxLength={11}
                              placeholder="To (DD-Mon-YYYY)"
                              onChange={(e) => setField(`n${i}t`, e.target.value, 'date')}
                              onBlur={() => handleDateBlur(`n${i}t`)}
                              className="px-2 py-1 rounded border border-slate-300 text-[11px] font-semibold"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Collapsible Advanced: Military Service & Additions */}
                <div className="border border-slate-200 rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowMilitaryAndAdd((v) => !v)}
                    className="w-full px-3 py-2 bg-slate-50 text-left text-[11px] font-semibold text-slate-700 flex items-center justify-between"
                  >
                    <span>Optional: Military Service (Q.12) &amp; Additions</span>
                    <span>{showMilitaryAndAdd ? 'Hide' : 'Open'}</span>
                  </button>
                  {showMilitaryAndAdd && (
                    <div className="p-2.5 space-y-2.5 border-t border-slate-200">
                      <p className="text-[10px] font-semibold text-slate-600 uppercase">
                        Military / War Service Spells
                      </p>
                      {[0, 1].map((i) => (
                        <div key={`m${i}`} className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            value={data[`m${i}f`] || ''}
                            maxLength={11}
                            placeholder={`Spell ${i + 1} From`}
                            onChange={(e) => setField(`m${i}f`, e.target.value, 'date')}
                            onBlur={() => handleDateBlur(`m${i}f`)}
                            className="px-2 py-1 rounded border border-slate-300 text-[11px] font-semibold"
                          />
                          <input
                            type="text"
                            value={data[`m${i}t`] || ''}
                            maxLength={11}
                            placeholder="To"
                            onChange={(e) => setField(`m${i}t`, e.target.value, 'date')}
                            onBlur={() => handleDateBlur(`m${i}t`)}
                            className="px-2 py-1 rounded border border-slate-300 text-[11px] font-semibold"
                          />
                        </div>
                      ))}
                      <p className="text-[10px] font-semibold text-slate-600 uppercase pt-1">
                        Condonation / Other Additions
                      </p>
                      {['(ii) Condonation of deficiency', '(iii) Other addition'].map((lbl, i) => (
                        <div key={`a${i}`} className="space-y-0.5">
                          <span className="text-[10px] text-slate-500">{lbl}</span>
                          <div className="grid grid-cols-2 gap-1.5">
                            <input
                              type="text"
                              value={data[`a${i}f`] || ''}
                              maxLength={11}
                              placeholder="From"
                              onChange={(e) => setField(`a${i}f`, e.target.value, 'date')}
                              onBlur={() => handleDateBlur(`a${i}f`)}
                              className="px-2 py-1 rounded border border-slate-300 text-[11px] font-semibold"
                            />
                            <input
                              type="text"
                              value={data[`a${i}t`] || ''}
                              maxLength={11}
                              placeholder="To"
                              onChange={(e) => setField(`a${i}t`, e.target.value, 'date')}
                              onBlur={() => handleDateBlur(`a${i}t`)}
                              className="px-2 py-1 rounded border border-slate-300 text-[11px] font-semibold"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: COMMUTATION, ROUNDING & LPC DETAILS */}
            {activeStep === 4 && (
              <div className="space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                    Step 4 — Commutation, Rules &amp; Last-Pay Certificate
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Uses official 2001 Revised Commutation Table (Ages 28–60) and writes Lump Sum in
                    words automatically.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Commutation % of Gross Pension
                  </label>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {['35', '25', '0'].map((pctVal) => (
                      <button
                        key={pctVal}
                        type="button"
                        onClick={() => setField('pct', pctVal, 'num')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                          (data.pct || '35') === pctVal
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {pctVal === '35'
                          ? '35% Standard'
                          : pctVal === '25'
                          ? '25%'
                          : '0% (No Commutation)'}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    data-field="pct"
                    inputMode="decimal"
                    value={data.pct || ''}
                    onChange={(e) => setField('pct', e.target.value, 'num')}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Qualifying Years Rounding Method
                  </label>
                  <select
                    value={data.roundRule || 'official'}
                    onChange={(e) => setField('roundRule', e.target.value, 'raw')}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold bg-white"
                  >
                    <option value="official">
                      Official Pension Rule (≥ 6 months rounds up to +1 yr, max 30)
                    </option>
                    <option value="exact">Exact Fractional Years (Y + M/12 + D/360, max 30)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      LPC Charge Handover
                    </label>
                    <select
                      value={data.chargeHalf || 'Afternoon'}
                      onChange={(e) => setField('chargeHalf', e.target.value, 'raw')}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold bg-white"
                    >
                      <option value="Afternoon">Afternoon</option>
                      <option value="Forenoon">Forenoon</option>
                    </select>
                  </div>
                  {renderDateInput('paidUpTo', 'LPC Paid Up To (optional)', data.dor || '14-Mar-2026')}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Official Document Typeface
                  </label>
                  <select
                    value={data.font || 'BOOK'}
                    onChange={(e) => setField('font', e.target.value, 'raw')}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold bg-white"
                  >
                    <option value="BOOK">Bookman Old Style (Govt. Standard)</option>
                    <option value="TNR">Times New Roman (Classic Serif)</option>
                  </select>
                </div>

                {calc.lump > 0 && (
                  <div className="p-3 rounded-md border border-emerald-200 bg-emerald-50/70 text-xs space-y-1">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                      Auto-Generated Amount in Words (Page 13)
                    </div>
                    <p className="font-semibold text-emerald-950 leading-relaxed">
                      RUPEES {calc.lumpWords}
                    </p>
                  </div>
                )}

                {/* Collapsible Special Additional Pension */}
                <div className="border border-slate-200 rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowSpecialPension((v) => !v)}
                    className="w-full px-3 py-2 bg-slate-50 text-left text-[11px] font-semibold text-slate-700 flex items-center justify-between"
                  >
                    <span>Optional: Special Additional Pension (Section 4)</span>
                    <span>{showSpecialPension ? 'Hide' : 'Open'}</span>
                  </button>
                  {showSpecialPension && (
                    <div className="p-3 space-y-2.5 border-t border-slate-200">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-700 mb-1">
                          Less 1/4th Special Pension?
                        </label>
                        <select
                          value={data.qtr || 'No'}
                          onChange={(e) => setField('qtr', e.target.value, 'raw')}
                          className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs font-semibold bg-white"
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {renderTextInput('ya', 'Gr. III Yrs', { type: 'num' })}
                        {renderTextInput('yb', 'Gr. II Yrs', { type: 'num' })}
                        {renderTextInput('yc', 'Gr. I Yrs', { type: 'num' })}
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {renderTextInput('ra', 'Rate III', { type: 'num' })}
                        {renderTextInput('rb', 'Rate II', { type: 'num' })}
                        {renderTextInput('rc', 'Rate I', { type: 'num' })}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {renderTextInput('xa', 'Max III', { type: 'num' })}
                        {renderTextInput('xb', 'Max II', { type: 'num' })}
                        {renderTextInput('xc', 'Max I', { type: 'num' })}
                        {renderTextInput('xt', 'Combined Max', { type: 'num' })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5: ZERO-MISTAKE VERIFICATION & DIRECT SERVER PDF DOWNLOAD */}
            {activeStep === 5 && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                    Step 5 — Zero-Mistake Check &amp; Direct PDF Download
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Checks common DAO / AG Sindh objection triggers before generating your official PDF.
                  </p>
                </div>

                {/* Validation Audit */}
                {issues.length === 0 ? (
                  <div className="p-3.5 rounded-md border border-emerald-200 bg-emerald-50 text-xs text-emerald-950">
                    <p className="font-semibold">All 16 Pension Papers Verified Ready</p>
                    <p className="mt-1 text-emerald-800">
                      CNIC, Payroll ID, dates, qualifying service, bank details, and commutation
                      math all passed automated verification.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {issues.map((issue, idx) => (
                      <div
                        key={`${issue.field}-${idx}`}
                        className={`p-2.5 rounded border text-xs flex items-start justify-between gap-2 ${
                          issue.level === 'error'
                            ? 'bg-rose-50 border-rose-200 text-rose-900'
                            : 'bg-amber-50 border-amber-200 text-amber-950'
                        }`}
                      >
                        <div>
                          <span className="font-semibold uppercase text-[10px] mr-1.5">
                            {issue.level === 'error' ? 'Required:' : 'Check:'}
                          </span>
                          <span>{issue.message}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => jumpToField(issue.step, issue.field)}
                          className="shrink-0 px-2 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-semibold text-slate-900 hover:border-slate-900"
                        >
                          Fix →
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Selective Page PDF Picker */}
                <div className="border border-slate-200 rounded-md p-3 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-900">
                      Pages to Include in PDF ({selectedPageCount} / 16)
                    </span>
                    <div className="flex items-center gap-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setSelectedPages(PENSION_PAGES_META.map(() => true))}
                        className="text-emerald-800 font-medium hover:underline"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPages(PENSION_PAGES_META.map(() => false))}
                        className="text-slate-600 hover:underline"
                      >
                        None
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                    {PENSION_PAGES_META.map((pg) => (
                      <div
                        key={pg.pageNo}
                        className="flex items-center justify-between gap-2 py-1 border-b border-slate-100 last:border-0 text-xs"
                      >
                        <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={selectedPages[pg.index]}
                            onChange={(e) => {
                              const next = [...selectedPages];
                              next[pg.index] = e.target.checked;
                              setSelectedPages(next);
                            }}
                            className="rounded border-slate-300"
                          />
                          <span className="truncate text-slate-800">
                            <b className="tabular-nums">P.{pg.pageNo}</b> {pg.fullTitle}
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() => scrollToPreviewPage(pg.index)}
                          className="text-[10px] text-slate-500 hover:text-slate-900 shrink-0 underline"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={Boolean(pdfLoading)}
                    onClick={handleDownloadSelectedPdf}
                    className="w-full py-2.5 rounded-md bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white text-xs font-semibold transition-colors"
                  >
                    {pdfLoading === 'all'
                      ? 'Generating Official PDF on Server...'
                      : `Download Official PDF (${selectedPageCount} Selected Pages)`}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSharePanel(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-2 rounded-md border border-slate-300 bg-white hover:border-slate-900 text-slate-900 text-xs font-semibold transition-colors"
                  >
                    Send Filled Draft on WhatsApp to Office / Clerk →
                  </button>
                </div>
              </div>
            )}

            {/* Step Prev/Next Footer */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                type="button"
                disabled={activeStep === 1}
                onClick={() => setActiveStep((s) => Math.max(1, s - 1) as StepId)}
                className="px-3 py-1.5 rounded border border-slate-300 bg-white text-xs font-medium text-slate-700 disabled:opacity-40"
              >
                ← Previous
              </button>
              <span className="text-[11px] text-slate-500 tabular-nums">Step {activeStep} of 5</span>
              {activeStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep((s) => Math.min(5, s + 1) as StepId)}
                  className="px-3.5 py-1.5 rounded bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="button"
                  disabled={Boolean(pdfLoading)}
                  onClick={handleDownloadSelectedPdf}
                  className="px-3.5 py-1.5 rounded bg-emerald-700 disabled:opacity-60 text-white text-xs font-semibold hover:bg-emerald-800"
                >
                  {pdfLoading === 'all' ? 'Generating...' : 'Download PDF'}
                </button>
              )}
            </div>

            <p className="text-[10px] text-slate-500 leading-relaxed pt-1">
              Direct Server PDF: Your draft stays saved locally in this browser. Clicking Download
              PDF renders a crisp official A4 PDF with the GovtJobs.pk document footer and discards
              temporary request data immediately — nothing is stored on our database.
            </p>
          </div>
        </aside>

        {/* RIGHT PANE: PIXEL-PERFECT A4 LIVE PREVIEW SHEETS */}
        <section
          ref={previewContainerRef}
          className={`p-3 sm:p-5 overflow-x-auto pp-print-root ${
            mobilePane === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Preview Toolbar + Quick Page Jump Pills (Hidden on Print) */}
          <div className="pp-no-print bg-white border border-slate-200 rounded-lg p-3 mb-4 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-semibold text-slate-900">
                Live A4 Preview — 16 Official Double-Bordered Sheets (210 × 297 mm)
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-slate-500 mr-1">Zoom:</span>
                {(
                  [
                    { id: 'fit', label: `Fit (${Math.round(fitScale * 100)}%)` },
                    { id: '75', label: '75%' },
                    { id: '100', label: '100% True A4' },
                  ] as const
                ).map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setZoomMode(z.id)}
                    className={`px-2 py-1 rounded border font-medium ${
                      zoomMode === z.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {z.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
              {PENSION_PAGES_META.map((pg) => (
                <button
                  key={pg.pageNo}
                  type="button"
                  onClick={() => scrollToPreviewPage(pg.index)}
                  className="px-2 py-1 rounded border border-slate-200 bg-slate-50 hover:bg-slate-900 hover:text-white hover:border-slate-900 text-[10px] font-medium text-slate-700 whitespace-nowrap transition-colors"
                >
                  P.{pg.pageNo} {pg.shortTitle}
                </button>
              ))}
            </div>
          </div>

          {/* 16 Rendered Official A4 Sheets */}
          <div style={{ ['--pp-font' as string]: fontCss }}>
            {pagesHtml.map((html, idx) => {
              const meta = PENSION_PAGES_META[idx];
              const included = selectedPages[idx];
              const scaledW = Math.round(A4_WIDTH_PX * effectiveScale);
              const scaledH = Math.round(A4_HEIGHT_PX * effectiveScale);

              return (
                <div
                  key={meta.pageNo}
                  ref={(el) => {
                    pageRefs.current[idx] = el;
                  }}
                  className={`pp-preview-slot ${included ? '' : 'pp-skip-print'}`}
                  style={{ width: `${scaledW}px` }}
                >
                  {/* Per-page screen header (Hidden on Print) */}
                  <div className="pp-no-print flex items-center justify-between gap-2 mb-1.5 px-1 text-[11px] text-slate-600">
                    <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={selectedPages[idx]}
                        onChange={(e) => {
                          const next = [...selectedPages];
                          next[idx] = e.target.checked;
                          setSelectedPages(next);
                        }}
                      />
                      <span className="text-slate-900 font-semibold">
                        Page {meta.pageNo} of 16:
                      </span>
                      <span className="truncate">{meta.fullTitle}</span>
                    </label>
                    <button
                      type="button"
                      disabled={Boolean(pdfLoading)}
                      onClick={() => handleDownloadSinglePagePdf(idx)}
                      className="shrink-0 px-2 py-0.5 rounded border border-slate-300 bg-white hover:border-slate-900 disabled:opacity-50 text-[10px] font-semibold text-slate-800"
                    >
                      {pdfLoading === `page-${idx}`
                        ? 'Generating...'
                        : `Download Page ${meta.pageNo} PDF`}
                    </button>
                  </div>

                  {/* Scaled A4 Page Container */}
                  <div
                    style={{
                      width: `${scaledW}px`,
                      height: `${scaledH}px`,
                      overflow: 'hidden',
                    }}
                    className="pp-preview-scale-outer"
                  >
                    <div
                      className="pp-preview-scale"
                      style={{
                        width: '210mm',
                        height: '297mm',
                        transform: `scale(${effectiveScale})`,
                      }}
                    >
                      <section
                        className={`pp-sheet ${selectedPages[idx] ? '' : 'opacity-45'}`}
                        dangerouslySetInnerHTML={{ __html: html }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
