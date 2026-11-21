import fs from 'fs';
import path from 'path';
import {
  DEFAULT_PENSION_DATA,
  PensionFormData,
  calculatePension,
} from '@/lib/pensionEngine';
import { buildPensionPagesHtml } from '@/lib/pensionPagesHtml';
import {
  Fo2FormData,
  createBlankFo2Data,
  emptyFo2Row,
  splitAmountBoxesRight,
  splitBoxesLeft,
} from '@/lib/fo2Engine';
import { SITE_URL } from '@/lib/seo';

export const ALLOWED_PDF_FORMS = ['pension-papers', 'fo2', 'fo1'] as const;
export type AllowedPdfFormType = (typeof ALLOWED_PDF_FORMS)[number];

export interface Fo1FormData {
  title?: string;
  refNo?: string;
  date?: string;
  officeOf?: string;
  ddoCode?: string;
  ddoDescription?: string;
  employeeName?: string;
  fatherName?: string;
  cnic?: string;
  personnelNumber?: string;
  designation?: string;
  bpsGrade?: string;
  dateOfBirth?: string;
  dateOfAppointment?: string;
  bankName?: string;
  iban?: string;
  remarks?: string;
}

export interface RenderedFormDocument {
  html: string;
  landscape: boolean;
  filename: string;
  pageCount: number;
}

let cachedPensionCss: string | null = null;
let cachedFo2Css: string | null = null;
let cachedEmblemDataUri: string | null = null;

function readAsset(relPath: string): Buffer {
  return fs.readFileSync(path.join(process.cwd(), relPath));
}

function getPensionCss(): string {
  if (cachedPensionCss === null) {
    cachedPensionCss = readAsset('src/app/forms/pension-papers/pension-print.css').toString('utf8');
  }
  return cachedPensionCss;
}

function getFo2Css(): string {
  if (cachedFo2Css === null) {
    cachedFo2Css = readAsset('src/app/forms/fo2/fo2-print.css').toString('utf8');
  }
  return cachedFo2Css;
}

function getEmblemDataUri(): string {
  if (cachedEmblemDataUri === null) {
    const b64 = readAsset('public/pk-emblem-fo2.jpg').toString('base64');
    cachedEmblemDataUri = `data:image/jpeg;base64,${b64}`;
  }
  return cachedEmblemDataUri;
}

function esc(value: unknown): string {
  return String(value ?? '').replace(/[&<>"]/g, (ch) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch] || ch)
  );
}

function sanitizeFilenamePart(raw: string, fallback: string): string {
  const cleaned = String(raw || '')
    .trim()
    .replace(/[^A-Za-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
  return cleaned || fallback;
}

function getWebsiteDisplayDomain(): string {
  return SITE_URL.replace(/^https?:\/\//i, '').replace(/\/$/, '');
}

function buildWebsiteFooterHtml(pageLabel?: string): string {
  const domain = getWebsiteDisplayDomain();
  return `<div class="gj-pdf-footer">
    <span><strong>GovtJobs.pk</strong> (${esc(domain)}) — Visit us for any official digital government document form (Pension Papers, FO-2, FO-1 &amp; more)</span>
    ${pageLabel ? `<span class="gj-pdf-footer-pg">${esc(pageLabel)}</span>` : ''}
  </div>`;
}

export function isAllowedPdfFormType(value: unknown): value is AllowedPdfFormType {
  return typeof value === 'string' && (ALLOWED_PDF_FORMS as readonly string[]).includes(value);
}

/* ────────────────────────────────────────────────────────────────────────────
   1. PENSION PAPERS (16 OFFICIAL A4 PORTRAIT SHEETS — OR SELECTED SUBSET)
   ──────────────────────────────────────────────────────────────────────────── */

export function renderPensionPdfHtml(
  rawData: Record<string, unknown>,
  selectedPageIndices?: number[]
): RenderedFormDocument {
  const sanitized: Record<string, string> = {};
  if (rawData && typeof rawData === 'object') {
    for (const [k, val] of Object.entries(rawData)) {
      if (typeof val === 'string' || typeof val === 'number') {
        sanitized[k] = String(val);
      }
    }
  }
  const merged: PensionFormData = {
    ...DEFAULT_PENSION_DATA,
    ...sanitized,
  };
  const calc = calculatePension(merged);
  const allPages = buildPensionPagesHtml(merged, calc);

  let indices = allPages.map((_, i) => i);
  if (Array.isArray(selectedPageIndices) && selectedPageIndices.length > 0) {
    const valid = Array.from(
      new Set(
        selectedPageIndices
          .map((n) => Number(n))
          .filter((n) => Number.isInteger(n) && n >= 0 && n < allPages.length)
      )
    ).sort((a, b) => a - b);
    if (valid.length > 0) indices = valid;
  }

  const totalSelected = indices.length;
  const css = getPensionCss();

  const sheetsHtml = indices
    .map((pageIdx, pos) => {
      const footer = buildWebsiteFooterHtml(`Sheet ${pageIdx + 1} of 16`);
      const isLast = pos === totalSelected - 1;
      return `<div class="pp-pdf-page${isLast ? ' pp-pdf-page-last' : ''}">
        <article class="pp-sheet">
          ${allPages[pageIdx]}
          ${footer}
        </article>
      </div>`;
    })
    .join('\n');

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Official Pension Papers — GovtJobs.pk</title>
<style>
  @page {
    size: A4 portrait;
    margin: 0;
  }
  html, body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  ${css}
  .pp-pdf-page {
    width: 210mm;
    height: 297mm;
    overflow: hidden;
    page-break-after: always;
    break-after: page;
  }
  .pp-pdf-page-last {
    page-break-after: auto;
    break-after: auto;
  }
  .pp-sheet {
    margin: 0 !important;
    box-shadow: none !important;
    width: 210mm !important;
    height: 297mm !important;
  }
  /* Subtle official website footer tucked cleanly outside the 6mm double border frame */
  .pp-sheet .gj-pdf-footer {
    position: absolute;
    left: 6mm;
    right: 6mm;
    bottom: 1.4mm;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4mm;
    font-family: Arial, Helvetica, "Liberation Sans", sans-serif;
    font-size: 6.7pt;
    line-height: 1.1;
    color: #334155 !important;
    letter-spacing: 0.01em;
    pointer-events: none;
  }
  .pp-sheet .gj-pdf-footer strong,
  .pp-sheet .gj-pdf-footer span {
    color: #334155 !important;
    font-style: normal !important;
  }
  .pp-sheet .gj-pdf-footer strong {
    color: #0f172a !important;
    font-weight: 700;
  }
  .pp-sheet .gj-pdf-footer-pg {
    white-space: nowrap;
    font-weight: 600;
  }
</style>
</head>
<body>
${sheetsHtml}
</body>
</html>`;

  const empSlug = sanitizeFilenamePart(merged.name || '', 'Employee');
  const suffix = totalSelected === 1 ? `-Page-${indices[0] + 1}` : '';

  return {
    html,
    landscape: false,
    filename: `Pension-Papers${suffix}-${empSlug}.pdf`,
    pageCount: totalSelected,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
   2. FO-2 (FORM: PAY02) — PIXEL-PERFECT A4 LANDSCAPE (297mm × 210mm)
   ──────────────────────────────────────────────────────────────────────────── */

export function renderFo2PdfHtml(rawData: Partial<Fo2FormData>): RenderedFormDocument {
  const blank = createBlankFo2Data();
  const safeRaw = rawData && typeof rawData === 'object' ? rawData : {};
  const data: Fo2FormData = {
    ...blank,
    ...safeRaw,
    rows: Array.from({ length: 10 }, (_, i) => ({
      ...emptyFo2Row(),
      ...(Array.isArray(safeRaw.rows) ? safeRaw.rows[i] : {}),
    })),
  };

  const ddoBoxes = splitBoxesLeft(data.ddoCode, 6);
  const personnelBoxes = splitBoxesLeft(data.personnelNumber, 8);
  const gradeBoxes = splitBoxesLeft(data.grade, 2);

  const rowsHtml = data.rows
    .map((row) => {
      const wageBoxes = splitBoxesLeft(row.wageType, 4);
      const amtBoxes = splitAmountBoxesRight(row.amount, 6);
      return `<tr>
        <td>${esc(row.infoType)}</td>
        <td>${esc(row.fieldId)}</td>
        <td class="fo2-td-left">${esc(row.newContents)}</td>
        ${wageBoxes.map((ch) => `<td class="fo2-td-box">${esc(ch)}</td>`).join('')}
        ${amtBoxes.map((ch) => `<td class="fo2-td-box">${esc(ch)}</td>`).join('')}
        <td>${esc(row.effectiveDate)}</td>
        <td class="fo2-td-left">${esc(row.remarks)}</td>
      </tr>`;
    })
    .join('\n');

  const css = getFo2Css();
  const emblemUri = getEmblemDataUri();
  const footer = buildWebsiteFooterHtml('FORM: PAY02 · A4 Landscape');

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>FO-2 (FORM: PAY02) Payroll System Amendment Form — GovtJobs.pk</title>
<style>
  @page {
    size: A4 landscape;
    margin: 0;
  }
  html, body {
    margin: 0;
    padding: 0;
    width: 297mm;
    height: 210mm;
    background: #ffffff;
    overflow: hidden;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  ${css}
  .fo2-sheet {
    margin: 0 !important;
    box-shadow: none !important;
    width: 297mm !important;
    height: 210mm !important;
  }
  /* Subtle official website footer tucked cleanly below the 12mm signature band */
  .fo2-sheet .gj-pdf-footer {
    position: absolute;
    left: 11.5mm;
    right: 10.5mm;
    bottom: 3mm;
    border-top: 0.5px solid #cbd5e1;
    padding-top: 1.1mm;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6mm;
    font-family: Arial, Helvetica, "Liberation Sans", sans-serif;
    font-size: 7pt;
    line-height: 1.15;
    color: #475569;
  }
  .fo2-sheet .gj-pdf-footer strong {
    color: #0f172a;
    font-weight: 700;
  }
  .fo2-sheet .gj-pdf-footer-pg {
    white-space: nowrap;
    font-weight: 600;
    color: #334155;
  }
</style>
</head>
<body>
  <section class="fo2-sheet">
    <div class="fo2-top">
      <div class="fo2-brand">
        <img src="${emblemUri}" alt="Government of Pakistan Emblem" class="fo2-emblem" />
        <div class="fo2-title-block">
          <div class="fo2-title-main">PAYROLL SYSTEM</div>
          <div class="fo2-title-main">AMENDMENT FORM</div>
          <div class="fo2-title-sub">SINGLE EMPLOYEE ENTRY</div>
        </div>
      </div>

      <div class="fo2-form-meta">
        <div class="fo2-form-code">FORM: PAY02</div>
        <div>
          Date:
          <span class="fo2-inline-line" style="width:9mm">${data.dateDay ? esc(data.dateDay) : '&nbsp;'}</span>/<span class="fo2-inline-line" style="width:9mm">${data.dateMonth ? esc(data.dateMonth) : '&nbsp;'}</span>/20<span class="fo2-inline-line" style="width:10mm">${data.dateYear2 ? esc(data.dateYear2) : '&nbsp;'}</span>
        </div>
        <div>
          Page No.
          <span class="fo2-inline-line" style="width:21mm">${data.pageNo ? esc(data.pageNo) : '&nbsp;'}</span>
        </div>
      </div>
    </div>

    <div class="fo2-office-lines">
      <div class="fo2-line-row">
        <span>OFFICE OF THE</span>
        <span class="fo2-line-fill" style="width:142mm">${data.officeOf ? esc(data.officeOf) : '&nbsp;'}</span>
      </div>
      <div class="fo2-line-row">
        <span>FOR THE MONTH OF</span>
        <span class="fo2-line-fill" style="width:48mm;text-align:center">${data.forMonth ? esc(data.forMonth) : '&nbsp;'}</span>
        <span>/ 202<span class="fo2-inline-line" style="width:6mm">${data.forYearDigit ? esc(data.forYearDigit) : '&nbsp;'}</span></span>
      </div>
    </div>

    <div class="fo2-meta-grid">
      <div class="fo2-meta-row">
        <div class="fo2-label-col">DDO code<br />(Cost Center)</div>
        <div class="fo2-boxes">
          ${ddoBoxes.map((ch) => `<div class="fo2-box">${esc(ch)}</div>`).join('')}
        </div>
        <div class="fo2-field-inline" style="margin-left:14mm;width:126mm">
          <span class="fo2-field-lbl">Description:</span>
          <span class="fo2-underline">${data.ddoDescription ? esc(data.ddoDescription) : '&nbsp;'}</span>
        </div>
      </div>

      <div class="fo2-meta-row">
        <div class="fo2-label-col">Personnel<br />Number:</div>
        <div class="fo2-boxes">
          ${personnelBoxes.map((ch) => `<div class="fo2-box">${esc(ch)}</div>`).join('')}
        </div>
        <div class="fo2-field-inline" style="margin-left:2mm;width:92mm">
          <span class="fo2-field-lbl">Employee<br />Name:</span>
          <span class="fo2-underline">${data.employeeName ? esc(data.employeeName) : '&nbsp;'}</span>
        </div>
        <div class="fo2-field-inline" style="margin-left:3mm;flex:1">
          <span class="fo2-field-lbl">National ID<br />Card Number:</span>
          <span class="fo2-underline">${data.cnic ? esc(data.cnic) : '&nbsp;'}</span>
        </div>
      </div>

      <div class="fo2-meta-row">
        <div class="fo2-label-col">Grade (Pay<br />Scale Group)</div>
        <div class="fo2-boxes">
          ${gradeBoxes.map((ch) => `<div class="fo2-box fo2-box-grade">${esc(ch)}</div>`).join('')}
        </div>
        <span class="fo2-underline" style="max-width:46mm;margin-left:1mm;flex:0 0 46mm">${data.gradeGroup ? esc(data.gradeGroup) : '&nbsp;'}</span>

        <div class="fo2-status-wrap">
          <span style="font-size:9pt">Salary Status:</span>
          <span class="fo2-chk-pair">
            <span class="fo2-chk-box">${data.salaryStatus === 'start' ? '&#10003;' : ''}</span>
            <span>Start</span>
          </span>
          <span class="fo2-chk-pair" style="margin-left:3mm">
            <span class="fo2-chk-box">${data.salaryStatus === 'stop' ? '&#10003;' : ''}</span>
            <span>Stop</span>
          </span>
        </div>
      </div>
    </div>

    <table class="fo2-table">
      <colgroup>
        <col style="width:15mm" />
        <col style="width:17.5mm" />
        <col style="width:57mm" />
        <col style="width:9.3mm" />
        <col style="width:9.3mm" />
        <col style="width:9.3mm" />
        <col style="width:9.3mm" />
        <col style="width:9.9mm" />
        <col style="width:9.9mm" />
        <col style="width:9.9mm" />
        <col style="width:9.9mm" />
        <col style="width:9.9mm" />
        <col style="width:9.9mm" />
        <col style="width:29.5mm" />
        <col style="width:59.4mm" />
      </colgroup>
      <thead>
        <tr>
          <th rowspan="2">Info<br />Type</th>
          <th colspan="2" class="fo2-th-bold">General Data Change</th>
          <th colspan="10" class="fo2-th-bold">Change in Payments/Deductions</th>
          <th colspan="2" class="fo2-th-empty"></th>
        </tr>
        <tr>
          <th>Field ID</th>
          <th>New Contents</th>
          <th colspan="4">Wage Type</th>
          <th colspan="6">Amount in Rupees</th>
          <th>Effective Date</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <div class="fo2-signatures">
      <div class="fo2-sig-col">
        <div class="fo2-sig-line"></div>
        <div>Prepared By</div>
        ${data.preparedBy?.trim() ? `<div class="fo2-sig-sub">${esc(data.preparedBy.trim())}</div>` : ''}
      </div>
      <div class="fo2-sig-col">
        <div class="fo2-sig-line"></div>
        <div>Audited / Checked By</div>
        ${data.auditedBy?.trim() ? `<div class="fo2-sig-sub">${esc(data.auditedBy.trim())}</div>` : ''}
      </div>
      <div class="fo2-sig-col">
        <div class="fo2-sig-line"></div>
        <div>Entered / Verified By</div>
        ${data.verifiedBy?.trim() ? `<div class="fo2-sig-sub">${esc(data.verifiedBy.trim())}</div>` : ''}
      </div>
    </div>

    ${footer}
  </section>
</body>
</html>`;

  const idPart = sanitizeFilenamePart(data.personnelNumber || data.ddoCode || '', 'PAY02');
  const namePart = sanitizeFilenamePart(data.employeeName || '', 'Employee');

  return {
    html,
    landscape: true,
    filename: `FO2-PAY02-${idPart}-${namePart}.pdf`,
    pageCount: 1,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
   3. FO-1 (FORM: PAY01 / FIELD OFFICE EMPLOYEE MASTER RECORD — A4 PORTRAIT)
   ──────────────────────────────────────────────────────────────────────────── */

export function renderFo1PdfHtml(rawData: Partial<Fo1FormData>): RenderedFormDocument {
  const d = rawData && typeof rawData === 'object' ? rawData : {};
  const emblemUri = getEmblemDataUri();
  const ddoBoxes = splitBoxesLeft(d.ddoCode || '', 6);
  const personnelBoxes = splitBoxesLeft(d.personnelNumber || '', 8);
  const footer = buildWebsiteFooterHtml('FORM: FO-1 / PAY01 · A4 Portrait');

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const fieldRow = (label: string, val?: string) => `
    <tr>
      <td class="lbl">${esc(label)}</td>
      <td class="val">${val ? esc(val) : '&nbsp;'}</td>
    </tr>`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>FO-1 (PAY01) Government Employee Entry Form — GovtJobs.pk</title>
<style>
  @page { size: A4 portrait; margin: 0; }
  html, body {
    margin: 0;
    padding: 0;
    width: 210mm;
    height: 297mm;
    background: #ffffff;
    font-family: Arial, Helvetica, "Liberation Sans", sans-serif;
    color: #111111;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .fo1-sheet {
    position: relative;
    width: 210mm;
    height: 297mm;
    padding: 12mm 14mm 16mm;
    box-sizing: border-box;
    overflow: hidden;
  }
  .fo1-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1.5px solid #111111;
    padding-bottom: 4mm;
    margin-bottom: 5mm;
  }
  .fo1-brand { display: flex; align-items: center; gap: 3.5mm; }
  .fo1-emblem { width: 17mm; height: 17mm; object-fit: contain; }
  .fo1-h1 { font-size: 13pt; font-weight: 700; line-height: 1.2; }
  .fo1-h2 { font-size: 10pt; font-weight: 700; margin-top: 1mm; }
  .fo1-meta { text-align: right; font-size: 9pt; line-height: 1.45; }
  .fo1-code { font-size: 11pt; font-weight: 700; }
  .fo1-box-row { display: flex; align-items: center; gap: 4mm; margin-bottom: 4mm; font-size: 9pt; }
  .fo1-boxes { display: inline-flex; border-top: 1px solid #111; border-left: 1px solid #111; }
  .fo1-box {
    width: 7mm; height: 7mm;
    border-right: 1px solid #111; border-bottom: 1px solid #111;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 10pt;
  }
  .fo1-table { width: 100%; border-collapse: collapse; margin-top: 3mm; font-size: 9.5pt; }
  .fo1-table td { border: 0.9px solid #111; padding: 2.6mm 3mm; vertical-align: middle; }
  .fo1-table td.lbl { width: 38%; font-weight: 700; background: #f8fafc; }
  .fo1-table td.val { font-weight: 600; }
  .fo1-sigs {
    position: absolute;
    left: 14mm; right: 14mm; bottom: 16mm;
    display: flex; justify-content: space-between; gap: 12mm;
  }
  .fo1-sig { flex: 1; text-align: center; font-size: 9pt; font-weight: 600; }
  .fo1-sig-line { border-bottom: 0.9px solid #111; height: 11mm; margin-bottom: 1.5mm; }
  .gj-pdf-footer {
    position: absolute;
    left: 10mm; right: 10mm; bottom: 4mm;
    border-top: 0.5px solid #cbd5e1;
    padding-top: 1.2mm;
    display: flex; justify-content: space-between; align-items: center; gap: 3mm;
    font-size: 6.3pt; color: #475569;
    white-space: nowrap;
  }
  .gj-pdf-footer strong { color: #0f172a; font-weight: 700; }
  .gj-pdf-footer-pg { white-space: nowrap; font-weight: 600; }
</style>
</head>
<body>
  <section class="fo1-sheet">
    <div class="fo1-top">
      <div class="fo1-brand">
        <img src="${emblemUri}" alt="Government of Pakistan Emblem" class="fo1-emblem" />
        <div>
          <div class="fo1-h1">PAYROLL SYSTEM — FO-1 (FORM: PAY01)</div>
          <div class="fo1-h2">${esc(d.title || 'NEW EMPLOYEE / FIELD OFFICE MASTER ENTRY FORM')}</div>
        </div>
      </div>
      <div class="fo1-meta">
        <div class="fo1-code">FORM: FO-1</div>
        <div>Ref: ${esc(d.refNo || '________________')}</div>
        <div>Date: ${esc(d.date || today)}</div>
      </div>
    </div>

    <div class="fo1-box-row">
      <span style="font-weight:700;min-width:34mm">DDO Code (6 Box):</span>
      <div class="fo1-boxes">${ddoBoxes.map((c) => `<div class="fo1-box">${esc(c)}</div>`).join('')}</div>
      <span style="font-weight:700;margin-left:4mm">Personnel No.:</span>
      <div class="fo1-boxes">${personnelBoxes.map((c) => `<div class="fo1-box">${esc(c)}</div>`).join('')}</div>
    </div>

    <table class="fo1-table">
      ${fieldRow('Office / Department', d.officeOf)}
      ${fieldRow('Cost Center Description', d.ddoDescription)}
      ${fieldRow('Employee Full Name', d.employeeName)}
      ${fieldRow("Father's / Husband's Name", d.fatherName)}
      ${fieldRow('National ID Card Number (CNIC)', d.cnic)}
      ${fieldRow('Designation / Post', d.designation)}
      ${fieldRow('Basic Pay Scale (BPS Grade)', d.bpsGrade)}
      ${fieldRow('Date of Birth', d.dateOfBirth)}
      ${fieldRow('Date of First Appointment', d.dateOfAppointment)}
      ${fieldRow('Bank Name & Branch', d.bankName)}
      ${fieldRow('Bank Account / IBAN', d.iban)}
      ${fieldRow('Remarks / Verification Notes', d.remarks)}
    </table>

    <div class="fo1-sigs">
      <div class="fo1-sig"><div class="fo1-sig-line"></div>Prepared By</div>
      <div class="fo1-sig"><div class="fo1-sig-line"></div>D.D.O. Signature &amp; Stamp</div>
      <div class="fo1-sig"><div class="fo1-sig-line"></div>Audited / Verified (DAO / AG)</div>
    </div>

    ${footer}
  </section>
</body>
</html>`;

  const slug = sanitizeFilenamePart(d.refNo || d.employeeName || '', 'Form');
  return {
    html,
    landscape: false,
    filename: `FO1-PAY01-${slug}.pdf`,
    pageCount: 1,
  };
}
