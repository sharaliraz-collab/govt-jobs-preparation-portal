import { SITE_URL } from './seo';

export interface Fo2Row {
  infoType: string; // e.g., '0008', '0014', '0015', '0009', '0002'
  fieldId: string; // e.g., 'BANKN', 'IBAN', 'ICNUM' (General Data Change)
  newContents: string; // e.g., 'PK42NBPA...' or new value
  wageType: string; // 4-char SAP/PIFRA wage type e.g., '0001', '1000', '3001'
  amount: string; // up to 6 integer digits (right-aligned into 6 boxes)
  effectiveDate: string; // e.g., '01-07-2026'
  remarks: string; // e.g., 'ANNUAL INCREMENT'
}

export interface Fo2FormData {
  dateDay: string;
  dateMonth: string;
  dateYear2: string; // last 2 digits after '20'
  pageNo: string;
  officeOf: string;
  forMonth: string;
  forYearDigit: string; // e.g., '6' for 2026 (printed after '202') or full year
  ddoCode: string; // 6-char cost center code
  ddoDescription: string;
  personnelNumber: string; // 8-digit PIFRA personnel number
  employeeName: string;
  cnic: string; // 00000-0000000-0
  grade: string; // 2-digit BPS grade e.g., '16'
  gradeGroup: string; // optional Pay Scale Group / Stage text beside 2 boxes
  salaryStatus: '' | 'start' | 'stop';
  rows: Fo2Row[]; // Always 10 rows
  preparedBy: string;
  auditedBy: string;
  verifiedBy: string;
}

export const FO2_MONTHS = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
] as const;

export function emptyFo2Row(): Fo2Row {
  return {
    infoType: '',
    fieldId: '',
    newContents: '',
    wageType: '',
    amount: '',
    effectiveDate: '',
    remarks: '',
  };
}

export function createBlankFo2Data(): Fo2FormData {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  const monthName = FO2_MONTHS[now.getMonth()];

  return {
    dateDay: dd,
    dateMonth: mm,
    dateYear2: yy,
    pageNo: '1',
    officeOf: '',
    forMonth: monthName,
    forYearDigit: yy.slice(-1),
    ddoCode: '',
    ddoDescription: '',
    personnelNumber: '',
    employeeName: '',
    cnic: '',
    grade: '',
    gradeGroup: '',
    salaryStatus: '',
    rows: Array.from({ length: 10 }, emptyFo2Row),
    preparedBy: '',
    auditedBy: '',
    verifiedBy: '',
  };
}

export const SAMPLE_FO2_DATA: Fo2FormData = {
  dateDay: '01',
  dateMonth: '12',
  dateYear2: '26',
  pageNo: '1',
  officeOf: 'HEAD MASTER, GOVERNMENT BOYS HIGH SCHOOL, KHAIRPUR MIRS',
  forMonth: 'DECEMBER',
  forYearDigit: '6',
  ddoCode: 'KQ0142',
  ddoDescription: 'GOVT. BOYS HIGH SCHOOL KHAIRPUR MIRS (EDUCATION)',
  personnelNumber: '10482915',
  employeeName: 'MUHAMMAD SALMAN SHAIKH',
  cnic: '45203-7482915-1',
  grade: '16',
  gradeGroup: 'BPS-16 / STAGE 09',
  salaryStatus: 'start',
  rows: [
    {
      infoType: '0008',
      fieldId: '',
      newContents: '',
      wageType: '0001',
      amount: '74520',
      effectiveDate: '01-12-2026',
      remarks: 'ANNUAL INCREMENT DEC-2026',
    },
    {
      infoType: '0014',
      fieldId: '',
      newContents: '',
      wageType: '1000',
      amount: '11200',
      effectiveDate: '01-12-2026',
      remarks: 'HOUSE RENT ALLOWANCE',
    },
    {
      infoType: '0014',
      fieldId: '',
      newContents: '',
      wageType: '1100',
      amount: '5000',
      effectiveDate: '01-12-2026',
      remarks: 'CONVEYANCE ALLOWANCE',
    },
    {
      infoType: '0014',
      fieldId: '',
      newContents: '',
      wageType: '3001',
      amount: '6400',
      effectiveDate: '01-12-2026',
      remarks: 'G.P. FUND SUBSCRIPTION',
    },
    {
      infoType: '0009',
      fieldId: 'IBAN',
      newContents: 'PK42NBPA0142003048291501',
      wageType: '',
      amount: '',
      effectiveDate: '01-12-2026',
      remarks: 'BANK IBAN UPDATED',
    },
    emptyFo2Row(),
    emptyFo2Row(),
    emptyFo2Row(),
    emptyFo2Row(),
    emptyFo2Row(),
  ],
  preparedBy: '',
  auditedBy: '',
  verifiedBy: '',
};

export interface Fo2Preset {
  label: string;
  category: 'Pay & Allowances' | 'Deductions' | 'General Data';
  row: Partial<Fo2Row>;
}

export const FO2_PRESETS: Fo2Preset[] = [
  {
    label: '0001 · Basic Pay / Increment',
    category: 'Pay & Allowances',
    row: { infoType: '0008', wageType: '0001', remarks: 'BASIC PAY / ANNUAL INCREMENT' },
  },
  {
    label: '1000 · House Rent Allowance',
    category: 'Pay & Allowances',
    row: { infoType: '0014', wageType: '1000', remarks: 'HOUSE RENT ALLOWANCE' },
  },
  {
    label: '1100 · Conveyance Allowance',
    category: 'Pay & Allowances',
    row: { infoType: '0014', wageType: '1100', remarks: 'CONVEYANCE ALLOWANCE' },
  },
  {
    label: '1200 · Medical Allowance',
    category: 'Pay & Allowances',
    row: { infoType: '0014', wageType: '1200', remarks: 'MEDICAL ALLOWANCE' },
  },
  {
    label: '1500 · Ad-hoc Relief Allowance',
    category: 'Pay & Allowances',
    row: { infoType: '0014', wageType: '1500', remarks: 'AD-HOC RELIEF ALLOWANCE' },
  },
  {
    label: '3001 · G.P. Fund Subscription',
    category: 'Deductions',
    row: { infoType: '0014', wageType: '3001', remarks: 'G.P. FUND DEDUCTION' },
  },
  {
    label: '3003 · Benevolent Fund',
    category: 'Deductions',
    row: { infoType: '0014', wageType: '3003', remarks: 'BENEVOLENT FUND' },
  },
  {
    label: '3005 · Group Insurance',
    category: 'Deductions',
    row: { infoType: '0014', wageType: '3005', remarks: 'GROUP INSURANCE' },
  },
  {
    label: '4001 · Income Tax Deduction',
    category: 'Deductions',
    row: { infoType: '0014', wageType: '4001', remarks: 'INCOME TAX' },
  },
  {
    label: '0009 · Bank Account / IBAN',
    category: 'General Data',
    row: { infoType: '0009', fieldId: 'IBAN', remarks: 'BANK ACCOUNT CHANGE' },
  },
  {
    label: '0002 · CNIC / Name Correction',
    category: 'General Data',
    row: { infoType: '0002', fieldId: 'ICNUM', remarks: 'PERSONAL DATA CORRECTION' },
  },
];

export function formatCnicInput(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 13);
  return (
    d.slice(0, 5) +
    (d.length > 5 ? '-' + d.slice(5, 12) : '') +
    (d.length > 12 ? '-' + d.slice(12) : '')
  );
}

/** Splits text left-aligned into N fixed boxes (for DDO code, Personnel No., Grade, Wage Type). */
export function splitBoxesLeft(value: string, count: number): string[] {
  const clean = (value || '').trim().toUpperCase().slice(0, count);
  return Array.from({ length: count }, (_, i) => clean[i] || '');
}

/** Splits numeric rupees right-aligned into 6 boxes so units always land in Box 6. */
export function splitAmountBoxesRight(value: string, count = 6): string[] {
  const digits = (value || '').replace(/\D/g, '').slice(0, count);
  const pad = count - digits.length;
  return Array.from({ length: count }, (_, i) => (i < pad ? '' : digits[i - pad]));
}

export interface Fo2ValidationIssue {
  level: 'error' | 'warning';
  message: string;
}

export function validateFo2Data(data: Fo2FormData): Fo2ValidationIssue[] {
  const issues: Fo2ValidationIssue[] = [];
  if (!data.officeOf.trim()) {
    issues.push({ level: 'error', message: 'OFFICE OF THE is required.' });
  }
  if (!data.forMonth.trim()) {
    issues.push({ level: 'error', message: 'Payroll Month (FOR THE MONTH OF) is missing.' });
  }
  if (!data.ddoCode.trim()) {
    issues.push({ level: 'error', message: '6-character DDO Code (Cost Center) is required.' });
  } else if (data.ddoCode.trim().length !== 6) {
    issues.push({
      level: 'warning',
      message: `DDO Code "${data.ddoCode}" has ${data.ddoCode.trim().length} characters (PIFRA standard is 6).`,
    });
  }
  if (!data.personnelNumber.trim()) {
    issues.push({ level: 'error', message: '8-digit Personnel Number is required.' });
  } else if (data.personnelNumber.trim().length !== 8) {
    issues.push({
      level: 'error',
      message: 'Personnel Number must be exactly 8 digits.',
    });
  }
  if (!data.employeeName.trim()) {
    issues.push({ level: 'error', message: 'Employee Name is required.' });
  }
  if (!data.cnic.trim()) {
    issues.push({ level: 'warning', message: 'National ID Card Number (CNIC) is blank.' });
  } else if (data.cnic.trim().length !== 15) {
    issues.push({
      level: 'error',
      message: 'CNIC must be 13 digits formatted as 00000-0000000-0.',
    });
  }
  if (!data.grade.trim()) {
    issues.push({ level: 'warning', message: 'Grade (Pay Scale Group) 2-digit BPS box is blank.' });
  }

  const filledRows = data.rows.filter(
    (r) =>
      r.infoType.trim() ||
      r.fieldId.trim() ||
      r.newContents.trim() ||
      r.wageType.trim() ||
      r.amount.trim() ||
      r.remarks.trim()
  );
  if (filledRows.length === 0 && !data.salaryStatus) {
    issues.push({
      level: 'warning',
      message: 'No amendment row or Salary Status (Start / Stop) is filled yet.',
    });
  }

  data.rows.forEach((r, idx) => {
    if (r.wageType.trim() && r.wageType.trim().length !== 4) {
      issues.push({
        level: 'warning',
        message: `Row ${idx + 1}: Wage Type "${r.wageType}" is usually 4 characters.`,
      });
    }
    if (r.amount.trim() && !r.wageType.trim()) {
      issues.push({
        level: 'warning',
        message: `Row ${idx + 1}: Amount Rs. ${r.amount} has no 4-digit Wage Type entered.`,
      });
    }
  });

  return issues;
}

export interface SavedFo2Case {
  id: string;
  label: string;
  personnelNumber: string;
  updatedAt: string;
  data: Fo2FormData;
}

/* ─── Private Client-Side WhatsApp Hash Prefill Sharing ─── */

export type Fo2ShareMode = 'tool' | 'office' | 'full';

export interface DecodedFo2Prefill {
  mode: 'office' | 'full';
  data: Partial<Fo2FormData>;
  note?: string;
}

function bytesToB64u(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64uToBytes(b64u: string): Uint8Array {
  const padded = b64u.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((b64u.length + 3) % 4);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export function normalizePkPhone(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0092')) return digits.slice(2);
  if (digits.startsWith('03') && digits.length === 11) return `92${digits.slice(1)}`;
  if (digits.startsWith('3') && digits.length === 10) return `92${digits}`;
  return digits;
}

export function encodeFo2PrefillHash(
  mode: 'office' | 'full',
  data: Fo2FormData,
  note?: string
): string {
  const compact: Record<string, unknown> =
    mode === 'office'
      ? {
          officeOf: data.officeOf,
          forMonth: data.forMonth,
          forYearDigit: data.forYearDigit,
          ddoCode: data.ddoCode,
          ddoDescription: data.ddoDescription,
          dateDay: data.dateDay,
          dateMonth: data.dateMonth,
          dateYear2: data.dateYear2,
        }
      : {
          ...data,
          rows: data.rows.filter(
            (r) =>
              r.infoType || r.fieldId || r.newContents || r.wageType || r.amount || r.effectiveDate || r.remarks
          ),
        };

  const payload: { m: 'office' | 'full'; d: Record<string, unknown>; n?: string } = {
    m: mode,
    d: compact,
  };
  if (note && note.trim()) payload.n = note.trim().slice(0, 140);

  return `#prefill=${bytesToB64u(new TextEncoder().encode(JSON.stringify(payload)))}`;
}

export function decodeFo2PrefillHash(hash: string): DecodedFo2Prefill | null {
  if (!hash || !hash.includes('prefill=')) return null;
  try {
    const m = hash.replace(/^#/, '').match(/(?:^|&)prefill=([A-Za-z0-9\-_]+)/);
    if (!m) return null;
    const parsed = JSON.parse(new TextDecoder().decode(b64uToBytes(m[1])));
    if (!parsed || typeof parsed !== 'object' || typeof parsed.d !== 'object') return null;

    const rawRows = Array.isArray(parsed.d.rows) ? parsed.d.rows : null;
    const paddedRows = rawRows
      ? Array.from({ length: 10 }, (_, i) => ({
          ...emptyFo2Row(),
          ...(rawRows[i] || {}),
        }))
      : undefined;

    return {
      mode: parsed.m === 'office' ? 'office' : 'full',
      data: {
        ...parsed.d,
        ...(paddedRows ? { rows: paddedRows } : {}),
      },
      note: typeof parsed.n === 'string' ? parsed.n.slice(0, 140) : undefined,
    };
  } catch {
    return null;
  }
}

export function buildFo2SharePayload(
  mode: Fo2ShareMode,
  data: Fo2FormData,
  opts?: { phone?: string; note?: string }
): { shareUrl: string; whatsappHref: string } {
  const origin = typeof window !== 'undefined' ? window.location.origin : SITE_URL;
  const base = `${origin}/forms/fo2`;
  const phone = normalizePkPhone(opts?.phone || '');
  const waBase = phone ? `https://wa.me/${phone}` : 'https://wa.me/';

  if (mode === 'tool') {
    const text = [
      'FO-2 (FORM: PAY02) Payroll System Amendment Form — Online Fill & Print A4 Landscape (Free)',
      '',
      'Fill single-employee PIFRA / SAP payroll changes digitally with exact character boxes:',
      '• 6-Box DDO Cost Center, 8-Box Personnel No., 2-Box Grade & Salary Start/Stop',
      '• 1-Click PIFRA Wage Types (Basic Pay, HRA, Medical, G.P. Fund, IBAN)',
      '• Pixel-Perfect Official A4 Landscape Print with Pakistan State Emblem',
      '',
      base,
    ].join('\n');
    return { shareUrl: base, whatsappHref: `${waBase}?text=${encodeURIComponent(text)}` };
  }

  const hash = encodeFo2PrefillHash(mode, data, opts?.note);
  const shareUrl = `${base}${hash}`;

  if (mode === 'office') {
    const label = data.ddoCode ? `${data.ddoCode}${data.ddoDescription ? ` — ${data.ddoDescription}` : ''}` : data.officeOf;
    const text = [
      `FO-2 (PAY02) Payroll Amendment — Please Add Your Employee Details${label ? ` (${label})` : ''}`,
      '',
      'Office & DDO Cost Center code are pre-filled. Tap the link below on your phone, add your Personnel Number, Name, CNIC & requested amendment, then send back on WhatsApp for A4 Landscape printing:',
      opts?.note ? `\nNote: ${opts.note.trim()}` : '',
      '',
      shareUrl,
    ].join('\n');
    return { shareUrl, whatsappHref: `${waBase}?text=${encodeURIComponent(text)}` };
  }

  const emp = data.employeeName || 'Employee';
  const pid = data.personnelNumber ? ` (P.No: ${data.personnelNumber})` : '';
  const text = [
    `FO-2 (FORM: PAY02) Ready to Print — ${emp}${pid}`,
    '',
    'Filled payroll amendment details are attached in this private link. Open on the office computer to verify and print exact A4 Landscape:',
    opts?.note ? `\nNote: ${opts.note.trim()}` : '',
    '',
    shareUrl,
  ].join('\n');
  return { shareUrl, whatsappHref: `${waBase}?text=${encodeURIComponent(text)}` };
}
