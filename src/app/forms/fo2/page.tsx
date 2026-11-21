'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import './fo2-print.css';
import {
  DecodedFo2Prefill,
  FO2_MONTHS,
  FO2_PRESETS,
  Fo2FormData,
  Fo2Preset,
  Fo2Row,
  Fo2ShareMode,
  SAMPLE_FO2_DATA,
  SavedFo2Case,
  buildFo2SharePayload,
  createBlankFo2Data,
  decodeFo2PrefillHash,
  emptyFo2Row,
  formatCnicInput,
  splitAmountBoxesRight,
  splitBoxesLeft,
  validateFo2Data,
} from '@/lib/fo2Engine';

const DRAFT_KEY = 'govtjobs_fo2_draft_v1';
const CASES_KEY = 'govtjobs_fo2_saved_cases_v1';

// Exact A4 Landscape dimensions @ 96dpi
const A4_LAND_W_PX = 1122.5197; // 297mm
const A4_LAND_H_PX = 793.7008; // 210mm

export default function Fo2PayrollFormStudioPage() {
  const [data, setData] = useState<Fo2FormData>(() => createBlankFo2Data());
  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<'header' | 'rows' | 'verify'>('header');
  const [mobilePane, setMobilePane] = useState<'edit' | 'preview'>('edit');

  const [savedCases, setSavedCases] = useState<SavedFo2Case[]>([]);
  const [showCasesPanel, setShowCasesPanel] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [sharePhone, setSharePhone] = useState('');
  const [shareNote, setShareNote] = useState('');
  const [copiedMode, setCopiedMode] = useState<Fo2ShareMode | null>(null);
  const [prefillBanner, setPrefillBanner] = useState<DecodedFo2Prefill | null>(null);
  const [notice, setNotice] = useState('');

  const [zoomMode, setZoomMode] = useState<'fit' | '75' | '100'>('fit');
  const [fitScale, setFitScale] = useState<number>(0.72);

  const previewRef = useRef<HTMLDivElement | null>(null);
  const importRef = useRef<HTMLInputElement | null>(null);

  // Hydrate saved draft, saved cases, and incoming WhatsApp #prefill=... hash
  useEffect(() => {
    try {
      let base = createBlankFo2Data();
      const rawDraft = window.localStorage.getItem(DRAFT_KEY);
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft);
        if (parsed && typeof parsed === 'object') {
          base = {
            ...base,
            ...parsed,
            rows: Array.from({ length: 10 }, (_, i) => ({
              ...emptyFo2Row(),
              ...(Array.isArray(parsed.rows) ? parsed.rows[i] : {}),
            })),
          };
        }
      }

      const incoming = decodeFo2PrefillHash(window.location.hash);
      if (incoming) {
        if (incoming.mode === 'office') {
          base = {
            ...createBlankFo2Data(),
            ...incoming.data,
          };
          setActiveTab('header');
        } else {
          base = {
            ...createBlankFo2Data(),
            ...incoming.data,
            rows: Array.from({ length: 10 }, (_, i) => ({
              ...emptyFo2Row(),
              ...(incoming.data.rows ? incoming.data.rows[i] : {}),
            })),
          };
          setActiveTab('verify');
        }
        setPrefillBanner(incoming);
        try {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        } catch {
          /* ignore */
        }
      }

      setData(base);

      const rawCases = window.localStorage.getItem(CASES_KEY);
      if (rawCases) {
        const list = JSON.parse(rawCases);
        if (Array.isArray(list)) setSavedCases(list);
      }
    } catch {
      /* ignore */
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [data, hydrated]);

  // Fit 297mm A4 Landscape cleanly into preview container width
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const measure = () => {
      const avail = el.clientWidth - 28;
      if (avail > 140) {
        setFitScale(Number(Math.min(1, avail / A4_LAND_W_PX).toFixed(3)));
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mobilePane]);

  const flash = useCallback((msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice((prev) => (prev === msg ? '' : prev)), 3500);
  }, []);

  const issues = useMemo(() => validateFo2Data(data), [data]);
  const errorCount = useMemo(() => issues.filter((i) => i.level === 'error').length, [issues]);
  const warnCount = useMemo(() => issues.filter((i) => i.level === 'warning').length, [issues]);

  const filledRowCount = useMemo(
    () =>
      data.rows.filter(
        (r) =>
          r.infoType || r.fieldId || r.newContents || r.wageType || r.amount || r.effectiveDate || r.remarks
      ).length,
    [data.rows]
  );

  const effectiveScale = zoomMode === 'fit' ? fitScale : zoomMode === '75' ? 0.75 : 1;
  const scaledW = Math.round(A4_LAND_W_PX * effectiveScale);
  const scaledH = Math.round(A4_LAND_H_PX * effectiveScale);

  const updateRow = (idx: number, field: keyof Fo2Row, raw: string) => {
    let val = raw;
    if (field === 'infoType') val = raw.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 4);
    else if (field === 'wageType') val = raw.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 4);
    else if (field === 'amount') val = raw.replace(/\D/g, '').slice(0, 6);
    else if (field === 'effectiveDate') val = raw.slice(0, 12);
    else val = raw.toUpperCase();

    setData((prev) => {
      const nextRows = [...prev.rows];
      nextRows[idx] = { ...nextRows[idx], [field]: val };
      return { ...prev, rows: nextRows };
    });
  };

  const clearRow = (idx: number) => {
    setData((prev) => {
      const nextRows = [...prev.rows];
      nextRows[idx] = emptyFo2Row();
      return { ...prev, rows: nextRows };
    });
  };

  const applyPresetRow = (preset: Fo2Preset) => {
    const emptyIdx = data.rows.findIndex(
      (r) => !r.infoType && !r.fieldId && !r.newContents && !r.wageType && !r.amount && !r.remarks
    );
    if (emptyIdx === -1) {
      flash('All 10 rows are already filled. Clear a row first to add another preset.');
      return;
    }
    const defaultEff =
      data.dateDay && data.dateMonth && data.dateYear2
        ? `${data.dateDay}-${data.dateMonth}-20${data.dateYear2}`
        : '';

    setData((prev) => {
      const nextRows = [...prev.rows];
      nextRows[emptyIdx] = {
        ...emptyFo2Row(),
        ...preset.row,
        effectiveDate: defaultEff,
      };
      return { ...prev, rows: nextRows };
    });
    setActiveTab('rows');
    flash(`Added "${preset.label}" into Row ${emptyIdx + 1}.`);
  };

  const handleSaveCase = () => {
    const label = data.employeeName.trim() || 'UNNAMED EMPLOYEE';
    const item: SavedFo2Case = {
      id: `${data.personnelNumber || 'fo2'}-${Date.now()}`,
      label,
      personnelNumber: data.personnelNumber || 'No P.No',
      updatedAt: new Date().toISOString(),
      data: { ...data, rows: data.rows.map((r) => ({ ...r })) },
    };
    const next = [
      item,
      ...savedCases.filter((c) => !(c.personnelNumber === item.personnelNumber && c.label === item.label)),
    ].slice(0, 40);
    setSavedCases(next);
    try {
      window.localStorage.setItem(CASES_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    flash(`Saved FO-2 case for ${label}.`);
  };

  const handleExportJson = () => {
    const slug = (data.employeeName || 'fo2-pay02').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug || 'fo2-pay02'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    flash('Exported FO-2 backup JSON.');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        if (parsed && typeof parsed === 'object') {
          setData({
            ...createBlankFo2Data(),
            ...parsed,
            rows: Array.from({ length: 10 }, (_, i) => ({
              ...emptyFo2Row(),
              ...(Array.isArray(parsed.rows) ? parsed.rows[i] : {}),
            })),
          });
          flash(`Imported FO-2 case from ${file.name}.`);
        }
      } catch {
        flash('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleWhatsApp = (mode: Fo2ShareMode) => {
    const p = buildFo2SharePayload(mode, data, { phone: sharePhone, note: shareNote });
    window.open(p.whatsappHref, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async (mode: Fo2ShareMode) => {
    const p = buildFo2SharePayload(mode, data, { phone: sharePhone, note: shareNote });
    try {
      await navigator.clipboard.writeText(p.shareUrl);
      setCopiedMode(mode);
      window.setTimeout(() => setCopiedMode((prev) => (prev === mode ? null : prev)), 2200);
      flash('Link copied cleanly.');
    } catch {
      flash('Could not copy automatically — use the WhatsApp button instead.');
    }
  };

  const ddoBoxes = splitBoxesLeft(data.ddoCode, 6);
  const personnelBoxes = splitBoxesLeft(data.personnelNumber, 8);
  const gradeBoxes = splitBoxesLeft(
    data.grade.length === 1 ? `0${data.grade}` : data.grade,
    2
  );

  return (
    <div className="bg-slate-100/80 min-h-screen text-slate-900 font-sans">
      {/* Top Sticky Studio Control Bar (Hidden on Print) */}
      <div className="fo2-no-print bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1640px] mx-auto px-3 sm:px-5 py-2.5">
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
                <span className="text-sky-900 font-semibold">FO-2 (FORM: PAY02)</span>
              </div>
              <h1 className="text-sm sm:text-base font-serif font-semibold text-slate-950 tracking-tight truncate">
                FO-2 (FORM: PAY02) — Payroll System Amendment Form · Pixel-Perfect A4 Landscape
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold transition-colors"
              >
                Print / Save A4 Landscape PDF
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSharePanel((v) => !v);
                  setShowCasesPanel(false);
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
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
                className="px-2.5 py-1.5 rounded-lg border border-sky-200 bg-sky-50/70 hover:bg-sky-100 text-sky-950 text-xs font-medium transition-colors"
              >
                Save Case
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCasesPanel((v) => !v);
                  setShowSharePanel(false);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:border-slate-500 text-slate-800 text-xs font-medium transition-colors"
              >
                Saved ({savedCases.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setData({ ...SAMPLE_FO2_DATA, rows: SAMPLE_FO2_DATA.rows.map((r) => ({ ...r })) });
                  flash('Loaded realistic Sindh Education FO-2 sample (increment + allowances + GP Fund + IBAN).');
                }}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:border-slate-500 text-slate-800 text-xs font-medium transition-colors"
              >
                Load Sample
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all fields to a blank FO-2 sheet?')) {
                    setData(createBlankFo2Data());
                    flash('Cleared to blank FO-2 sheet.');
                  }
                }}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-rose-400 hover:text-rose-700 text-slate-600 text-xs font-medium transition-colors"
              >
                Blank
              </button>
            </div>
          </div>

          {notice && (
            <div className="mt-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-between">
              <span>{notice}</span>
              <button
                type="button"
                onClick={() => setNotice('')}
                className="text-slate-300 hover:text-white text-[11px] ml-3"
              >
                Dismiss
              </button>
            </div>
          )}

          {prefillBanner && (
            <div className="mt-2 px-3.5 py-2 rounded-lg border border-emerald-300 bg-emerald-50 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-semibold">
                  {prefillBanner.mode === 'office'
                    ? 'Office & DDO Cost Center pre-filled from WhatsApp — enter your Personnel No., Name, CNIC & Amendment Rows.'
                    : `Loaded shared FO-2 draft${data.employeeName ? ` for ${data.employeeName}` : ''} — verify and click Print A4 Landscape.`}
                </span>
                {prefillBanner.note && (
                  <span className="block text-[11px] text-emerald-800 mt-0.5">
                    Note: {prefillBanner.note}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPrefillBanner(null)}
                className="text-[11px] underline font-medium"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* WhatsApp Share Drawer */}
          {showSharePanel && (
            <div className="mt-2.5 p-3.5 rounded-lg border border-sky-200 bg-sky-50/60 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-950">
                    Share FO-2 (PAY02) on WhatsApp — Private Hash Prefill
                  </h2>
                  <p className="text-[11px] text-slate-600">
                    Details travel strictly inside the URL #prefill fragment and never touch any server.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSharePanel(false)}
                  className="px-2.5 py-1 rounded border border-slate-200 bg-white text-[11px] text-slate-600"
                >
                  Close
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={sharePhone}
                  onChange={(e) => setSharePhone(e.target.value)}
                  placeholder="Optional WhatsApp No. (e.g., 0300-1234567)"
                  className="px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs"
                />
                <input
                  type="text"
                  maxLength={140}
                  value={shareNote}
                  onChange={(e) => setShareNote(e.target.value)}
                  placeholder="Optional note (e.g., Add Personnel No. & IBAN for Dec salary)"
                  className="px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-2">
                <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-slate-950">
                      Send Office &amp; DDO Link to Employee
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Pre-fills Office, Month &amp; 6-box DDO Code so the employee adds personal details on phone.
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleWhatsApp('office')}
                      className="flex-1 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold"
                    >
                      WhatsApp Employee
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyLink('office')}
                      className="px-2.5 py-1.5 rounded border border-slate-300 text-[11px] font-medium"
                    >
                      {copiedMode === 'office' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-slate-950">
                      Send Filled FO-2 Back to Clerk / Printer
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Includes all filled boxes &amp; amendment rows — opens ready to print A4 Landscape.
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleWhatsApp('full')}
                      className="flex-1 py-1.5 rounded bg-sky-700 hover:bg-sky-800 text-white text-[11px] font-semibold"
                    >
                      WhatsApp Full FO-2
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyLink('full')}
                      className="px-2.5 py-1.5 rounded border border-slate-300 text-[11px] font-medium"
                    >
                      {copiedMode === 'full' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-slate-950">
                      Share Blank Tool in Staff Group
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Clean URL with custom FO-2 WhatsApp preview card so any colleague can use it free.
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleWhatsApp('tool')}
                      className="flex-1 py-1.5 rounded border border-sky-700 bg-sky-50 hover:bg-sky-100 text-sky-950 text-[11px] font-semibold"
                    >
                      Share in Group
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyLink('tool')}
                      className="px-2.5 py-1.5 rounded border border-slate-300 text-[11px] font-medium"
                    >
                      {copiedMode === 'tool' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Saved Cases Drawer */}
          {showCasesPanel && (
            <div className="mt-2.5 p-3.5 rounded-lg border border-slate-300 bg-slate-50 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                  Saved FO-2 Employee Cases (Local Browser Storage)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="px-2.5 py-1 rounded border border-slate-300 bg-white text-[11px] font-medium"
                  >
                    Export JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => importRef.current?.click()}
                    className="px-2.5 py-1 rounded border border-slate-300 bg-white text-[11px] font-medium"
                  >
                    Import JSON
                  </button>
                  <input
                    ref={importRef}
                    type="file"
                    accept="application/json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCasesPanel(false)}
                    className="px-2.5 py-1 rounded border border-slate-200 bg-white text-[11px] text-slate-600"
                  >
                    Close
                  </button>
                </div>
              </div>
              {savedCases.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No saved FO-2 cases yet. Fill an employee entry and click <b>Save Case</b>.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {savedCases.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 rounded p-2 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">{item.label}</div>
                        <div className="text-[10px] text-slate-500 tabular-nums">
                          P.No: {item.personnelNumber}
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setData({
                              ...createBlankFo2Data(),
                              ...item.data,
                              rows: Array.from({ length: 10 }, (_, i) => ({
                                ...emptyFo2Row(),
                                ...(item.data.rows?.[i] || {}),
                              })),
                            });
                            setShowCasesPanel(false);
                            flash(`Loaded FO-2 for ${item.label}.`);
                          }}
                          className="px-2 py-1 rounded bg-sky-700 text-white text-[11px] font-medium"
                        >
                          Open
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const next = savedCases.filter((c) => c.id !== item.id);
                            setSavedCases(next);
                            window.localStorage.setItem(CASES_KEY, JSON.stringify(next));
                          }}
                          className="px-2 py-1 rounded border border-slate-200 text-[11px] text-rose-700"
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

          {/* Mobile Pane Switcher */}
          <div className="lg:hidden mt-2.5 grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setMobilePane('edit')}
              className={`py-1.5 rounded-lg text-xs font-semibold border ${
                mobilePane === 'edit'
                  ? 'bg-sky-700 text-white border-sky-700'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              Fill FO-2 Form
            </button>
            <button
              type="button"
              onClick={() => setMobilePane('preview')}
              className={`py-1.5 rounded-lg text-xs font-semibold border ${
                mobilePane === 'preview'
                  ? 'bg-sky-700 text-white border-sky-700'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              A4 Landscape Preview
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Workspace: Left Editor + Right Pixel-Perfect A4 Landscape Sheet */}
      <div className="max-w-[1640px] mx-auto lg:grid lg:grid-cols-[440px_1fr] items-start fo2-print-root">
        {/* LEFT PANE: EDITOR (Hidden on Print) */}
        <aside
          className={`fo2-no-print bg-white border-r border-slate-200 lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)] lg:overflow-y-auto ${
            mobilePane === 'edit' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* 3 Clean Editor Tabs */}
          <div className="sticky top-0 z-10 bg-sky-50/70 border-b border-sky-100 p-2.5 grid grid-cols-3 gap-1.5">
            {(
              [
                { id: 'header', label: '1. Employee & DDO' },
                { id: 'rows', label: `2. Rows (${filledRowCount}/10)` },
                {
                  id: 'verify',
                  label: errorCount > 0 ? `3. Check (${errorCount})` : '3. Verify & Print',
                },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-colors ${
                  activeTab === t.id
                    ? 'bg-sky-700 text-white border-sky-700'
                    : 'bg-white text-sky-950 border-sky-200 hover:bg-sky-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-4">
            {/* TAB 1: HEADER, DDO CODE & EMPLOYEE METADATA */}
            {activeTab === 'header' && (
              <div className="space-y-3">
                <div className="grid grid-cols-[1fr_1fr_1fr_72px] gap-1.5">
                  <div>
                    <label className="block text-[10.5px] font-medium text-slate-600 mb-1">
                      Day
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      inputMode="numeric"
                      value={data.dateDay}
                      onChange={(e) =>
                        setData((p) => ({ ...p, dateDay: e.target.value.replace(/\D/g, '').slice(0, 2) }))
                      }
                      placeholder="DD"
                      className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs font-semibold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-medium text-slate-600 mb-1">
                      Month
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      inputMode="numeric"
                      value={data.dateMonth}
                      onChange={(e) =>
                        setData((p) => ({ ...p, dateMonth: e.target.value.replace(/\D/g, '').slice(0, 2) }))
                      }
                      placeholder="MM"
                      className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs font-semibold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-medium text-slate-600 mb-1">
                      Year (20__)
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      inputMode="numeric"
                      value={data.dateYear2}
                      onChange={(e) =>
                        setData((p) => ({ ...p, dateYear2: e.target.value.replace(/\D/g, '').slice(0, 2) }))
                      }
                      placeholder="26"
                      className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs font-semibold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-medium text-slate-600 mb-1">
                      Page No.
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={data.pageNo}
                      onChange={(e) => setData((p) => ({ ...p, pageNo: e.target.value.slice(0, 4) }))}
                      className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs font-semibold text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    OFFICE OF THE*
                  </label>
                  <input
                    type="text"
                    value={data.officeOf}
                    onChange={(e) => setData((p) => ({ ...p, officeOf: e.target.value.toUpperCase() }))}
                    placeholder="e.g., HEAD MASTER, GOVT. BOYS HIGH SCHOOL KHAIRPUR"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-[1fr_92px] gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      FOR THE MONTH OF*
                    </label>
                    <select
                      value={data.forMonth}
                      onChange={(e) => setData((p) => ({ ...p, forMonth: e.target.value }))}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold bg-white"
                    >
                      <option value="">Select Month</option>
                      {FO2_MONTHS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Year (202_)
                    </label>
                    <input
                      type="text"
                      maxLength={1}
                      inputMode="numeric"
                      value={data.forYearDigit}
                      onChange={(e) =>
                        setData((p) => ({
                          ...p,
                          forYearDigit: e.target.value.replace(/\D/g, '').slice(0, 1),
                        }))
                      }
                      placeholder="6"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold text-center"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-[130px_1fr] gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      DDO Code (6 Boxes)*
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={data.ddoCode}
                      onChange={(e) =>
                        setData((p) => ({
                          ...p,
                          ddoCode: e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6),
                        }))
                      }
                      placeholder="KQ0142"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold tracking-widest uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Cost Center Description
                    </label>
                    <input
                      type="text"
                      value={data.ddoDescription}
                      onChange={(e) =>
                        setData((p) => ({ ...p, ddoDescription: e.target.value.toUpperCase() }))
                      }
                      placeholder="e.g., GBHS KHAIRPUR (EDUCATION)"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Personnel Number (8 Boxes)*
                    </label>
                    <input
                      type="text"
                      maxLength={8}
                      inputMode="numeric"
                      value={data.personnelNumber}
                      onChange={(e) =>
                        setData((p) => ({
                          ...p,
                          personnelNumber: e.target.value.replace(/\D/g, '').slice(0, 8),
                        }))
                      }
                      placeholder="10482915"
                      className={`w-full px-2.5 py-1.5 rounded border text-xs font-bold tracking-widest ${
                        data.personnelNumber && data.personnelNumber.length !== 8
                          ? 'border-rose-500 bg-rose-50/40'
                          : 'border-slate-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      National ID Card (CNIC)
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      inputMode="numeric"
                      value={data.cnic}
                      onChange={(e) =>
                        setData((p) => ({ ...p, cnic: formatCnicInput(e.target.value) }))
                      }
                      placeholder="45203-7482915-1"
                      className={`w-full px-2.5 py-1.5 rounded border text-xs font-semibold ${
                        data.cnic && data.cnic.length !== 15
                          ? 'border-rose-500 bg-rose-50/40'
                          : 'border-slate-300'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Employee Name*
                  </label>
                  <input
                    type="text"
                    value={data.employeeName}
                    onChange={(e) =>
                      setData((p) => ({ ...p, employeeName: e.target.value.toUpperCase() }))
                    }
                    placeholder="e.g., MUHAMMAD SALMAN SHAIKH"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-[88px_1fr] gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Grade (2 Box)
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      inputMode="numeric"
                      value={data.grade}
                      onChange={(e) =>
                        setData((p) => ({
                          ...p,
                          grade: e.target.value.replace(/\D/g, '').slice(0, 2),
                        }))
                      }
                      placeholder="16"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-bold text-center tracking-widest"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Pay Scale Group / Stage (optional)
                    </label>
                    <input
                      type="text"
                      value={data.gradeGroup}
                      onChange={(e) =>
                        setData((p) => ({ ...p, gradeGroup: e.target.value.toUpperCase() }))
                      }
                      placeholder="e.g., BPS-16 / STAGE 09"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Salary Status Checkbox
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { v: '', label: 'None (Normal)' },
                        { v: 'start', label: '✓ Start Salary' },
                        { v: 'stop', label: '✓ Stop Salary' },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.v || 'none'}
                        type="button"
                        onClick={() => setData((p) => ({ ...p, salaryStatus: opt.v }))}
                        className={`py-1.5 px-2 rounded-lg border text-xs font-semibold transition-colors ${
                          data.salaryStatus === opt.v
                            ? 'bg-sky-700 text-white border-sky-700'
                            : 'bg-sky-50/60 text-sky-950 border-sky-200 hover:bg-sky-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('rows')}
                  className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                >
                  Next: Fill Amendment Rows (1–10) →
                </button>
              </div>
            )}

            {/* TAB 2: 10 AMENDMENT ROWS + 1-CLICK PIFRA PRESETS */}
            {activeTab === 'rows' && (
              <div className="space-y-3">
                <div className="border border-sky-200 bg-sky-50/60 rounded-lg p-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-800 mb-1.5">
                    1-Click PIFRA / SAP Common Entry Presets
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {FO2_PRESETS.map((pr) => (
                      <button
                        key={pr.label}
                        type="button"
                        onClick={() => applyPresetRow(pr)}
                        className="px-2 py-1 rounded-md bg-white border border-sky-200 hover:border-sky-500 hover:bg-sky-100 text-[10.5px] font-medium text-sky-950 transition-colors"
                      >
                        + {pr.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  {data.rows.map((row, idx) => {
                    const hasData = Boolean(
                      row.infoType ||
                        row.fieldId ||
                        row.newContents ||
                        row.wageType ||
                        row.amount ||
                        row.effectiveDate ||
                        row.remarks
                    );
                    return (
                      <div
                        key={idx}
                        className={`rounded-lg border p-2.5 space-y-1.5 ${
                          hasData
                            ? 'border-sky-300 bg-sky-50/30'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10.5px]">
                          <span className="font-semibold text-slate-800">Row {idx + 1}</span>
                          {hasData && (
                            <button
                              type="button"
                              onClick={() => clearRow(idx)}
                              className="text-rose-700 hover:underline font-medium"
                            >
                              Clear Row
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-[64px_76px_1fr] gap-1.5">
                          <input
                            type="text"
                            maxLength={4}
                            value={row.infoType}
                            onChange={(e) => updateRow(idx, 'infoType', e.target.value)}
                            placeholder="InfoType"
                            title="SAP Info Type (e.g., 0008, 0014, 0009)"
                            className="px-1.5 py-1 rounded border border-slate-300 bg-white text-[11px] font-semibold text-center"
                          />
                          <input
                            type="text"
                            maxLength={8}
                            value={row.fieldId}
                            onChange={(e) => updateRow(idx, 'fieldId', e.target.value)}
                            placeholder="Field ID"
                            className="px-1.5 py-1 rounded border border-slate-300 bg-white text-[11px] font-semibold text-center"
                          />
                          <input
                            type="text"
                            value={row.newContents}
                            onChange={(e) => updateRow(idx, 'newContents', e.target.value)}
                            placeholder="New Contents (General Data Change)"
                            className="px-2 py-1 rounded border border-slate-300 bg-white text-[11px] font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-[72px_92px_94px_1fr] gap-1.5">
                          <input
                            type="text"
                            maxLength={4}
                            value={row.wageType}
                            onChange={(e) => updateRow(idx, 'wageType', e.target.value)}
                            placeholder="Wage (4)"
                            title="4-character Wage Type (e.g., 0001, 1000, 3001)"
                            className="px-1.5 py-1 rounded border border-slate-300 bg-white text-[11px] font-bold text-center tracking-wider"
                          />
                          <input
                            type="text"
                            maxLength={6}
                            inputMode="numeric"
                            value={row.amount}
                            onChange={(e) => updateRow(idx, 'amount', e.target.value)}
                            placeholder="Amount Rs."
                            title="Up to 6 digits (auto right-aligned into 6 boxes)"
                            className="px-1.5 py-1 rounded border border-slate-300 bg-white text-[11px] font-bold text-right tabular-nums"
                          />
                          <input
                            type="text"
                            maxLength={12}
                            value={row.effectiveDate}
                            onChange={(e) => updateRow(idx, 'effectiveDate', e.target.value)}
                            placeholder="Eff. Date"
                            className="px-1.5 py-1 rounded border border-slate-300 bg-white text-[11px] font-semibold text-center"
                          />
                          <input
                            type="text"
                            value={row.remarks}
                            onChange={(e) => updateRow(idx, 'remarks', e.target.value)}
                            placeholder="Remarks"
                            className="px-2 py-1 rounded border border-slate-300 bg-white text-[11px] font-semibold"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: SIGNATORIES, ZERO-MISTAKE CHECK & PRINT */}
            {activeTab === 'verify' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                    Optional Signatory Names (Leave Blank for Stamp / Ink Only)
                  </h2>
                  <input
                    type="text"
                    value={data.preparedBy}
                    onChange={(e) =>
                      setData((p) => ({ ...p, preparedBy: e.target.value.toUpperCase() }))
                    }
                    placeholder="Prepared By (optional)"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={data.auditedBy}
                    onChange={(e) =>
                      setData((p) => ({ ...p, auditedBy: e.target.value.toUpperCase() }))
                    }
                    placeholder="Audited / Checked By (optional)"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={data.verifiedBy}
                    onChange={(e) =>
                      setData((p) => ({ ...p, verifiedBy: e.target.value.toUpperCase() }))
                    }
                    placeholder="Entered / Verified By (optional)"
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                    Pre-Print Verification ({errorCount} Errors · {warnCount} Notices)
                  </h2>
                  {issues.length === 0 ? (
                    <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-xs text-emerald-950">
                      <b>FO-2 (PAY02) Verified Ready!</b> DDO Cost Center, 8-digit Personnel Number,
                      CNIC, Wage Types, and 6-box Rupee amounts are cleanly aligned for A4 Landscape
                      printing.
                    </div>
                  ) : (
                    issues.map((iss, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded border text-xs ${
                          iss.level === 'error'
                            ? 'bg-rose-50 border-rose-200 text-rose-900'
                            : 'bg-amber-50 border-amber-200 text-amber-950'
                        }`}
                      >
                        <b className="uppercase text-[10px] mr-1">
                          {iss.level === 'error' ? 'Required:' : 'Notice:'}
                        </b>
                        {iss.message}
                      </div>
                    ))
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full py-2.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold transition-colors"
                >
                  Print / Save Official A4 Landscape PDF
                </button>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Print tip: In Chrome / Edge print dialog, Paper Size is automatically set to{' '}
                  <b>A4 Landscape (297 × 210 mm)</b> with <b>Margins: None</b>. Everything stays
                  100% private inside your browser.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT PANE: PIXEL-PERFECT A4 LANDSCAPE (297mm × 210mm) LIVE SHEET */}
        <section
          ref={previewRef}
          className={`p-3 sm:p-5 overflow-x-auto fo2-print-root ${
            mobilePane === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Preview Zoom Toolbar (Hidden on Print) */}
          <div className="fo2-no-print bg-white border border-slate-200 rounded-lg p-3 mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-semibold text-slate-900">
              Live Official A4 Landscape Preview — FORM: PAY02 (297 × 210 mm)
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-500">Zoom:</span>
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
                      ? 'bg-sky-700 text-white border-sky-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scaled A4 Landscape Sheet */}
          <div
            className="fo2-preview-outer"
            style={{ width: `${scaledW}px`, height: `${scaledH}px` }}
          >
            <div
              className="fo2-preview-scale"
              style={{
                width: '297mm',
                height: '210mm',
                transform: `scale(${effectiveScale})`,
              }}
            >
              <section className="fo2-sheet" aria-label="Official FORM PAY02 A4 Landscape Sheet">
                {/* 1. Header: Official Green Emblem + Title + FORM: PAY02 / Date / Page No */}
                <div className="fo2-top">
                  <div className="fo2-brand">
                    <img
                      src="/pk-emblem-fo2.jpg"
                      alt="Government of Pakistan Emblem"
                      className="fo2-emblem"
                    />
                    <div className="fo2-title-block">
                      <div className="fo2-title-main">PAYROLL SYSTEM</div>
                      <div className="fo2-title-main">AMENDMENT FORM</div>
                      <div className="fo2-title-sub">SINGLE EMPLOYEE ENTRY</div>
                    </div>
                  </div>

                  <div className="fo2-form-meta">
                    <div className="fo2-form-code">FORM: PAY02</div>
                    <div>
                      Date:{' '}
                      <span className="fo2-inline-line" style={{ width: '9mm' }}>
                        {data.dateDay || '\u00A0'}
                      </span>
                      /
                      <span className="fo2-inline-line" style={{ width: '9mm' }}>
                        {data.dateMonth || '\u00A0'}
                      </span>
                      /20
                      <span className="fo2-inline-line" style={{ width: '10mm' }}>
                        {data.dateYear2 || '\u00A0'}
                      </span>
                    </div>
                    <div>
                      Page No.{' '}
                      <span className="fo2-inline-line" style={{ width: '21mm' }}>
                        {data.pageNo || '\u00A0'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. OFFICE OF THE & FOR THE MONTH OF */}
                <div className="fo2-office-lines">
                  <div className="fo2-line-row">
                    <span>OFFICE OF THE</span>
                    <span className="fo2-line-fill" style={{ width: '142mm' }}>
                      {data.officeOf || '\u00A0'}
                    </span>
                  </div>
                  <div className="fo2-line-row">
                    <span>FOR THE MONTH OF</span>
                    <span className="fo2-line-fill" style={{ width: '48mm', textAlign: 'center' }}>
                      {data.forMonth || '\u00A0'}
                    </span>
                    <span>
                      / 202
                      <span className="fo2-inline-line" style={{ width: '6mm' }}>
                        {data.forYearDigit || '\u00A0'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* 3. Exact 3-Row Metadata Grid with 6-Box DDO, 8-Box Personnel No., 2-Box Grade & Checkboxes */}
                <div className="fo2-meta-grid">
                  {/* Row 1: DDO Code (6 boxes) + Description */}
                  <div className="fo2-meta-row">
                    <div className="fo2-label-col">
                      DDO code
                      <br />
                      (Cost Center)
                    </div>
                    <div className="fo2-boxes">
                      {ddoBoxes.map((ch, i) => (
                        <div key={i} className="fo2-box">
                          {ch}
                        </div>
                      ))}
                    </div>
                    <div
                      className="fo2-field-inline"
                      style={{ marginLeft: '14mm', width: '126mm' }}
                    >
                      <span className="fo2-field-lbl">Description:</span>
                      <span className="fo2-underline">{data.ddoDescription || '\u00A0'}</span>
                    </div>
                  </div>

                  {/* Row 2: Personnel Number (8 boxes) + Employee Name + National ID Card Number */}
                  <div className="fo2-meta-row">
                    <div className="fo2-label-col">
                      Personnel
                      <br />
                      Number:
                    </div>
                    <div className="fo2-boxes">
                      {personnelBoxes.map((ch, i) => (
                        <div key={i} className="fo2-box">
                          {ch}
                        </div>
                      ))}
                    </div>
                    <div
                      className="fo2-field-inline"
                      style={{ marginLeft: '2mm', width: '92mm' }}
                    >
                      <span className="fo2-field-lbl">
                        Employee
                        <br />
                        Name:
                      </span>
                      <span className="fo2-underline">{data.employeeName || '\u00A0'}</span>
                    </div>
                    <div className="fo2-field-inline" style={{ marginLeft: '3mm', flex: 1 }}>
                      <span className="fo2-field-lbl">
                        National ID
                        <br />
                        Card Number:
                      </span>
                      <span className="fo2-underline">{data.cnic || '\u00A0'}</span>
                    </div>
                  </div>

                  {/* Row 3: Grade (2 boxes + Pay Scale Group line) + Salary Status Start/Stop checkboxes */}
                  <div className="fo2-meta-row">
                    <div className="fo2-label-col">
                      Grade (Pay
                      <br />
                      Scale Group)
                    </div>
                    <div className="fo2-boxes">
                      {gradeBoxes.map((ch, i) => (
                        <div key={i} className="fo2-box fo2-box-grade">
                          {ch}
                        </div>
                      ))}
                    </div>
                    <span
                      className="fo2-underline"
                      style={{ maxWidth: '46mm', marginLeft: '1mm', flex: '0 0 46mm' }}
                    >
                      {data.gradeGroup || '\u00A0'}
                    </span>

                    <div className="fo2-status-wrap">
                      <span style={{ fontSize: '9pt' }}>Salary Status:</span>
                      <span className="fo2-chk-pair">
                        <span className="fo2-chk-box">
                          {data.salaryStatus === 'start' ? '✓' : ''}
                        </span>
                        <span>Start</span>
                      </span>
                      <span className="fo2-chk-pair" style={{ marginLeft: '3mm' }}>
                        <span className="fo2-chk-box">
                          {data.salaryStatus === 'stop' ? '✓' : ''}
                        </span>
                        <span>Stop</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Exact 15-Column, 10-Row Official PAY02 Amendment Table */}
                <table className="fo2-table">
                  <colgroup>
                    <col style={{ width: '15mm' }} />
                    <col style={{ width: '17.5mm' }} />
                    <col style={{ width: '57mm' }} />
                    <col style={{ width: '9.3mm' }} />
                    <col style={{ width: '9.3mm' }} />
                    <col style={{ width: '9.3mm' }} />
                    <col style={{ width: '9.3mm' }} />
                    <col style={{ width: '9.9mm' }} />
                    <col style={{ width: '9.9mm' }} />
                    <col style={{ width: '9.9mm' }} />
                    <col style={{ width: '9.9mm' }} />
                    <col style={{ width: '9.9mm' }} />
                    <col style={{ width: '9.9mm' }} />
                    <col style={{ width: '29.5mm' }} />
                    <col style={{ width: '59.4mm' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th rowSpan={2}>
                        Info
                        <br />
                        Type
                      </th>
                      <th colSpan={2} className="fo2-th-bold">
                        General Data Change
                      </th>
                      <th colSpan={10} className="fo2-th-bold">
                        Change in Payments/Deductions
                      </th>
                      <th colSpan={2} className="fo2-th-empty" aria-hidden="true" />
                    </tr>
                    <tr>
                      <th>Field ID</th>
                      <th>New Contents</th>
                      <th colSpan={4}>Wage Type</th>
                      <th colSpan={6}>Amount in Rupees</th>
                      <th>Effective Date</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows.map((row, idx) => {
                      const wageBoxes = splitBoxesLeft(row.wageType, 4);
                      const amtBoxes = splitAmountBoxesRight(row.amount, 6);
                      return (
                        <tr key={idx}>
                          <td>{row.infoType}</td>
                          <td>{row.fieldId}</td>
                          <td className="fo2-td-left">{row.newContents}</td>
                          {wageBoxes.map((ch, wi) => (
                            <td key={`w-${wi}`} className="fo2-td-box">
                              {ch}
                            </td>
                          ))}
                          {amtBoxes.map((ch, ai) => (
                            <td key={`a-${ai}`} className="fo2-td-box">
                              {ch}
                            </td>
                          ))}
                          <td>{row.effectiveDate}</td>
                          <td className="fo2-td-left">{row.remarks}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* 5. Official 3-Column Bottom Signatory Block */}
                <div className="fo2-signatures">
                  <div className="fo2-sig-col">
                    <div className="fo2-sig-line" />
                    <div>Prepared By</div>
                    {data.preparedBy.trim() ? (
                      <div className="fo2-sig-sub">{data.preparedBy.trim()}</div>
                    ) : null}
                  </div>
                  <div className="fo2-sig-col">
                    <div className="fo2-sig-line" />
                    <div>Audited / Checked By</div>
                    {data.auditedBy.trim() ? (
                      <div className="fo2-sig-sub">{data.auditedBy.trim()}</div>
                    ) : null}
                  </div>
                  <div className="fo2-sig-col">
                    <div className="fo2-sig-line" />
                    <div>Entered / Verified By</div>
                    {data.verifiedBy.trim() ? (
                      <div className="fo2-sig-sub">{data.verifiedBy.trim()}</div>
                    ) : null}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
