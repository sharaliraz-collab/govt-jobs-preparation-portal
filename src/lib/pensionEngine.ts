/**
 * Core calculation, date, validation, and Rupees-in-words engine for
 * Pakistan / Sindh Government Civil Services Pension Papers (Form 3 Pen. & A.T.C.5).
 */

export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/**
 * Official Pakistan Finance Division / AG Sindh 2001 Revised Commutation Table
 * Age next birthday 28..60 (33 entries) -> Number of years purchased.
 */
export const COMMUTATION_RATES: readonly number[] = [
  34.375, 33.6143, 32.8071, 32.0974, 31.5412, 30.5869, 29.8343, 29.0841, 28.3362,
  27.5908, 26.8482, 26.1009, 25.3728, 24.6406, 23.9126, 23.184, 22.4713, 21.7592,
  21.0538, 20.3555, 19.6653, 18.9841, 18.3129, 17.6526, 17.005, 16.371, 15.7517,
  15.1478, 14.5602, 13.9888, 13.434, 12.8953, 12.3719,
];

export type PensionFormData = Record<string, string>;

export const DEFAULT_PENSION_DATA: PensionFormData = {
  font: 'BOOK',
  roundRule: 'official', // 'official' (>= 6 months rounds up to next year, max 30) | 'exact'
  nat: 'PAKISTANI',
  pct: '35',
  ra: '25',
  rb: '45',
  rc: '25',
  xa: '124',
  xb: '224',
  xc: '',
  xt: '',
  pre: 'Mr.',
  rel: 'S/O',
  kind: 'Retired',
  qtr: 'No',
  cls: 'SUPERANNUATION PENSION',
  chargeHalf: 'Afternoon',
};

export const SAMPLE_PENSION_DATA: PensionFormData = {
  ...DEFAULT_PENSION_DATA,
  pid: '10482915',
  pre: 'Mr.',
  name: 'ABDUL GHAFFAR SOOMRO',
  rel: 'S/O',
  father: 'MUHAMMAD IBRAHIM SOOMRO',
  caste: 'SOOMRO',
  nat: 'PAKISTANI',
  cnic: '45203-4829104-1',
  dob: '15-Mar-1966',
  height: '5 FT 8 INCHES',
  marks: 'A SMALL MOLE ON RIGHT CHEEK',
  desig: 'HIGH SCHOOL TEACHER (BPS-16)',
  addr: 'HOUSE NO. B-42, SHAH LATIF COLONY, KHAIRPUR MIRS, SINDH',
  dept: 'SCHOOL EDUCATION & LITERACY',
  office: 'GOVERNMENT BOYS HIGH SCHOOL, KHAIRPUR MIRS',
  ddo: 'GHULAM SARWAR SHAIKH',
  ddod: 'HEAD MASTER / D.D.O (BPS-17)',
  ddoPlace: 'KHAIRPUR MIRS',
  pplace: 'KHAIRPUR MIRS',
  ppo: '',
  orderNo: 'NO. DEO(ES&HS)/KHP/2026/1482',
  orderDate: '02-Mar-2026',
  sanctionAuth: 'DIRECTOR SCHOOLS EDUCATION (ES&HS) SUKKUR',
  bank: 'NATIONAL BANK OF PAKISTAN (MAIN BRANCH KHAIRPUR)',
  acct: 'PK42NBPA0142003048291501',
  cls: 'SUPERANNUATION PENSION',
  doj: '12-Aug-1994',
  dor: '14-Mar-2026',
  dapp: '16-Mar-2026',
  kind: 'Retired',
  chargeHalf: 'Afternoon',
  lastpay: '96850',
  emol: '96850',
  g0n: 'SINDH',
  g0f: '12-Aug-1994',
  g0t: '14-Mar-2026',
};

export interface PageMeta {
  index: number; // 0-based
  pageNo: number; // 1-based
  shortTitle: string;
  fullTitle: string;
  group: 'Core Form' | 'Calculations' | 'Certificates' | 'Descriptive & LPC';
}

export const PENSION_PAGES_META: PageMeta[] = [
  { index: 0, pageNo: 1, shortTitle: 'Cover', fullTitle: 'Cover Page — Pension Papers Title Sheet', group: 'Core Form' },
  { index: 1, pageNo: 2, shortTitle: 'Forwarding', fullTitle: 'Forwarding Letter to District Accounts Officer', group: 'Core Form' },
  { index: 2, pageNo: 3, shortTitle: 'Notification', fullTitle: 'Finance Department Notification (29 July 1967)', group: 'Core Form' },
  { index: 3, pageNo: 4, shortTitle: 'Form 3 Part I', fullTitle: 'Form 3 (Pen.) Part I — Applicant Application', group: 'Core Form' },
  { index: 4, pageNo: 5, shortTitle: 'Part II Sec 1', fullTitle: 'Form 3 (Pen.) Part II — Section (I) Particulars', group: 'Core Form' },
  { index: 5, pageNo: 6, shortTitle: 'Sec 2 & 3 Calc', fullTitle: 'Page 5 — Qualifying Service & Ordinary Pension', group: 'Calculations' },
  { index: 6, pageNo: 7, shortTitle: 'Sec 4 & 5 Comm', fullTitle: 'Page 6 — Special Pension & Commutation', group: 'Calculations' },
  { index: 7, pageNo: 8, shortTitle: 'Sec 6 & 7 HOD', fullTitle: 'Page 7 — HOD Remarks & Sanctioning Orders', group: 'Calculations' },
  { index: 8, pageNo: 9, shortTitle: 'AG Audit P.8', fullTitle: 'Page 8 — Accountant General / Audit Verification', group: 'Calculations' },
  { index: 9, pageNo: 10, shortTitle: '4 DDO Certs I', fullTitle: 'Bonafide, No Enquiry, No Dues & No Demand Certs', group: 'Certificates' },
  { index: 10, pageNo: 11, shortTitle: '4 DDO Certs II', fullTitle: 'No Court Case, No Recovery, Audit & Embezzlement', group: 'Certificates' },
  { index: 11, pageNo: 12, shortTitle: 'Sindh Cert', fullTitle: 'Govt. of Sindh Consolidated Certificate, Option & Undertaking', group: 'Certificates' },
  { index: 12, pageNo: 13, shortTitle: 'Commut. Cert', fullTitle: 'DDO Commutation Payment Cert & Rate Table', group: 'Certificates' },
  { index: 13, pageNo: 14, shortTitle: 'Descr. Roll', fullTitle: 'Descriptive Roll, Specimen Signatures & Finger Prints', group: 'Descriptive & LPC' },
  { index: 14, pageNo: 15, shortTitle: 'LPC Front', fullTitle: 'A.T.C.5 Last-Pay Certificate (Front)', group: 'Descriptive & LPC' },
  { index: 15, pageNo: 16, shortTitle: 'LPC Reverse', fullTitle: 'A.T.C.5 Last-Pay Certificate (Reverse — 12 Months)', group: 'Descriptive & LPC' },
];

export type YMD = [number, number, number];

export function formatDateUTC(d: Date): string {
  return (
    String(d.getUTCDate()).padStart(2, '0') +
    '-' +
    MONTHS[d.getUTCMonth()] +
    '-' +
    d.getUTCFullYear()
  );
}

export function normalizeDateInput(s: string): string {
  const trimmed = (s || '').trim();
  if (!trimmed) return '';
  // Accept YYYY-MM-DD (native picker or ISO) as well as DD-MM-YYYY / DD-Mon-YYYY
  const iso = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) {
    const dt = new Date(Date.UTC(+iso[1], +iso[2] - 1, +iso[3]));
    if (dt.getUTCDate() === +iso[3] && dt.getUTCMonth() === +iso[2] - 1) {
      return formatDateUTC(dt);
    }
  }
  const m = trimmed.match(/^(\d{1,2})[\s\-/.]*(\d{1,2}|[A-Za-z]{3,9})[\s\-/.]*(\d{4})$/);
  if (!m) return trimmed;
  const mo = /^\d+$/.test(m[2])
    ? +m[2] - 1
    : MONTHS.findIndex((x) => x.toLowerCase() === m[2].slice(0, 3).toLowerCase());
  if (mo < 0 || mo > 11) return trimmed;
  const d = new Date(Date.UTC(+m[3], mo, +m[1]));
  if (d.getUTCDate() !== +m[1] || d.getUTCMonth() !== mo) return trimmed;
  return formatDateUTC(d);
}

export function parseDateStr(s?: string): Date | null {
  const m = /^(\d{2})-([A-Za-z]{3})-(\d{4})$/.exec((s || '').trim());
  if (!m) return null;
  const mo = MONTHS.findIndex((x) => x.toLowerCase() === m[2].toLowerCase());
  if (mo < 0) return null;
  const d = new Date(Date.UTC(+m[3], mo, +m[1]));
  return d.getUTCDate() === +m[1] && d.getUTCMonth() === mo ? d : null;
}

/**
 * Auto-calculates official Pakistan superannuation retirement date:
 * 1 day before 60th birthday (e.g., DOB 15-Mar-1966 -> DOR 14-Mar-2026).
 */
export function computeSuperannuationDate(dobStr: string): string {
  const dob = parseDateStr(dobStr);
  if (!dob) return '';
  const sixty = new Date(
    Date.UTC(dob.getUTCFullYear() + 60, dob.getUTCMonth(), dob.getUTCDate() - 1)
  );
  return formatDateUTC(sixty);
}

export function diffYMD(aStr?: string, bStr?: string): YMD | null {
  const a = parseDateStr(aStr);
  const bRaw = parseDateStr(bStr);
  if (!a || !bRaw || bRaw < a) return null;
  // Inclusive of both start and end dates
  const b = new Date(bRaw.getTime() + 86400000);
  let y = b.getUTCFullYear() - a.getUTCFullYear();
  let m = b.getUTCMonth() - a.getUTCMonth();
  let d = b.getUTCDate() - a.getUTCDate();
  if (d < 0) {
    d += new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), 0)).getUTCDate();
    m--;
  }
  if (m < 0) {
    m += 12;
    y--;
  }
  return [y, m, Math.min(d, 29)];
}

export function toDays360(a: YMD): number {
  return a[0] * 360 + a[1] * 30 + a[2];
}

export function fromDays360(x: number): YMD {
  const safe = Math.max(0, Math.round(x));
  return [Math.floor(safe / 360), Math.floor((safe % 360) / 30), safe % 30];
}

export function formatYMD(a: YMD | null): string {
  return a ? `${a[0]} Y ${a[1]} M ${a[2]} D` : '';
}

export function formatMoney(x: number): string {
  if (!x || !Number.isFinite(x)) return '';
  return Math.round(x).toLocaleString('en-US');
}

/**
 * Converts a rounded rupee amount into official uppercase English words
 * for DDO Commutation Payment Certificate.
 */
export function amountToWords(num: number): string {
  const value = Math.round(num);
  if (!value || !Number.isFinite(value) || value <= 0) return '';

  const ones = [
    '',
    'ONE',
    'TWO',
    'THREE',
    'FOUR',
    'FIVE',
    'SIX',
    'SEVEN',
    'EIGHT',
    'NINE',
    'TEN',
    'ELEVEN',
    'TWELVE',
    'THIRTEEN',
    'FOURTEEN',
    'FIFTEEN',
    'SIXTEEN',
    'SEVENTEEN',
    'EIGHTEEN',
    'NINETEEN',
  ];
  const tens = [
    '',
    '',
    'TWENTY',
    'THIRTY',
    'FORTY',
    'FIFTY',
    'SIXTY',
    'SEVENTY',
    'EIGHTY',
    'NINETY',
  ];

  const belowThousand = (n: number): string => {
    const parts: string[] = [];
    if (n >= 100) {
      parts.push(`${ones[Math.floor(n / 100)]} HUNDRED`);
      n %= 100;
    }
    if (n >= 20) {
      const rem = n % 10;
      parts.push(rem ? `${tens[Math.floor(n / 10)]}-${ones[rem]}` : tens[Math.floor(n / 10)]);
    } else if (n > 0) {
      parts.push(ones[n]);
    }
    return parts.join(' ');
  };

  // Standard Pakistani / South Asian grouping: Crore (10,000,000), Lac (100,000), Thousand (1,000)
  const parts: string[] = [];
  let rem = value;
  const crore = Math.floor(rem / 10000000);
  if (crore > 0) {
    parts.push(`${belowThousand(crore)} CRORE`);
    rem %= 10000000;
  }
  const lac = Math.floor(rem / 100000);
  if (lac > 0) {
    parts.push(`${belowThousand(lac)} LAC`);
    rem %= 100000;
  }
  const thousand = Math.floor(rem / 1000);
  if (thousand > 0) {
    parts.push(`${belowThousand(thousand)} THOUSAND`);
    rem %= 1000;
  }
  if (rem > 0) {
    parts.push(belowThousand(rem));
  }

  return `${parts.join(' ')} ONLY`;
}

export interface PensionRowCalc {
  x: YMD | null;
  rt: number;
  am: number;
}

export interface PensionCalculations {
  T: YMD | null;
  nq: number;
  ml: number;
  gv: number;
  ad: number;
  net: number;
  tq: number;
  tqYMD: YMD | null;
  completedYearsForPension: number;
  pr: PensionRowCalc[];
  pm: number;
  ps: number;
  avg: number;
  gross: number;
  surO: number;
  netO: number;
  sa: number;
  sb: number;
  sc: number;
  sp: number;
  q: number;
  nsp: number;
  tn: number;
  sur: number;
  age: number | null;
  rate: number;
  lump: number;
  lumpWords: string;
  from: string;
}

export function calculatePension(D: PensionFormData): PensionCalculations {
  const g = (k: string) => D[k] || '';
  const sumRanges = (prefix: string, count: number) => {
    let total = 0;
    for (let i = 0; i < count; i++) {
      const x = diffYMD(g(`${prefix}${i}f`), g(`${prefix}${i}t`));
      if (x) total += toDays360(x);
    }
    return total;
  };

  const T = diffYMD(g('doj'), g('dor'));
  const t0 = T ? toDays360(T) : 0;
  const nq = sumRanges('n', 7);
  const ml = sumRanges('m', 2);
  const gv = sumRanges('g', 3);
  const ad = sumRanges('a', 2);

  const net = Math.max(0, t0 - nq);
  const tq = net + ml + ad;
  const tqYMD = T ? fromDays360(tq) : null;

  // Completed qualifying years for pension formula:
  // Official Civil Services Pension Rule: 6 months or more counts as 1 full year (capped at 30).
  const exactYears = Math.min(tq / 360, 30);
  let completedYearsForPension = exactYears;
  if (tqYMD && (g('roundRule') || 'official') === 'official') {
    const rounded = tqYMD[0] + (tqYMD[1] >= 6 ? 1 : 0);
    completedYearsForPension = Math.min(rounded, 30);
  }

  const pr: PensionRowCalc[] = [];
  let ps = 0;
  let pm = 0;
  for (let i = 0; i < 4; i++) {
    const x = diffYMD(g(`p${i}f`), g(`p${i}t`));
    const days = x ? toDays360(x) : 0;
    const rt = +g(`p${i}r`) || 0;
    const am = (rt * days) / 30;
    ps += am;
    pm += days / 30;
    pr.push({ x, rt, am });
  }

  const avg = pm > 0 ? ps / pm : +g('emol') || +g('lastpay') || 0;
  const gross = (avg * 7) / 300 * completedYearsForPension;
  const pct = Math.min(100, Math.max(0, +g('pct') || 0));
  const surO = (gross * pct) / 100;
  const netO = gross - surO;

  const capGrade = (yKey: string, rKey: string, maxKey: string) => {
    const y = +g(yKey) || 0;
    const amt = y * (+g(rKey) || 0);
    const max = +g(maxKey);
    return max ? Math.min(amt, max) : amt;
  };
  const sa = capGrade('ya', 'ra', 'xa');
  const sb = capGrade('yb', 'rb', 'xb');
  const sc = capGrade('yc', 'rc', 'xc');
  let sp = sa + sb + sc;
  if (+g('xt')) sp = Math.min(sp, +g('xt'));

  const q = g('qtr') === 'Yes' ? sp / 4 : 0;
  const nsp = sp - q;
  const tn = netO + nsp;
  const sur = surO + q;

  const dob = parseDateStr(g('dob'));
  const dor = parseDateStr(g('dor'));
  let age: number | null = null;
  if (dob && dor && dor >= dob) {
    let years = dor.getUTCFullYear() - dob.getUTCFullYear();
    if (
      dor.getUTCMonth() < dob.getUTCMonth() ||
      (dor.getUTCMonth() === dob.getUTCMonth() && dor.getUTCDate() < dob.getUTCDate())
    ) {
      years--;
    }
    age = years + 1; // Age next birthday
  }

  const rate =
    age !== null && age >= 28 && age <= 60 ? COMMUTATION_RATES[age - 28] : 0;
  const lump = sur * 12 * rate;
  const lumpWords = amountToWords(lump);
  const from = dor ? formatDateUTC(new Date(dor.getTime() + 86400000)) : '';

  return {
    T,
    nq,
    ml,
    gv,
    ad,
    net,
    tq,
    tqYMD,
    completedYearsForPension,
    pr,
    pm,
    ps,
    avg,
    gross,
    surO,
    netO,
    sa,
    sb,
    sc,
    sp,
    q,
    nsp,
    tn,
    sur,
    age,
    rate,
    lump,
    lumpWords,
    from,
  };
}

export interface ValidationIssue {
  level: 'error' | 'warning';
  step: 1 | 2 | 3 | 4;
  field: string;
  message: string;
}

/**
 * Pre-Print Zero-Mistake Verification Auditor:
 * Catches common District Accounts Office (DAO) / AG Sindh objection causes
 * before a single sheet of paper is printed.
 */
export function validatePensionData(
  D: PensionFormData,
  calc: PensionCalculations
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const g = (k: string) => (D[k] || '').trim();

  if (!g('name')) {
    issues.push({ level: 'error', step: 1, field: 'name', message: 'Employee full name is required.' });
  }
  if (!g('father')) {
    issues.push({ level: 'error', step: 1, field: 'father', message: 'Father / Husband name is required.' });
  }
  if (!g('cnic')) {
    issues.push({ level: 'error', step: 1, field: 'cnic', message: 'CNIC number is missing (required on Cover, Form 3, and Descriptive Roll).' });
  } else if (g('cnic').length !== 15) {
    issues.push({ level: 'error', step: 1, field: 'cnic', message: 'CNIC must be 13 digits formatted as 00000-0000000-0.' });
  }
  if (!g('pid')) {
    issues.push({ level: 'warning', step: 1, field: 'pid', message: '8-digit Personal / Pay Roll ID is blank.' });
  } else if (g('pid').length !== 8) {
    issues.push({ level: 'error', step: 1, field: 'pid', message: 'Personal / Pay Roll ID should be exactly 8 digits.' });
  }
  if (!g('dob') || !parseDateStr(g('dob'))) {
    issues.push({ level: 'error', step: 1, field: 'dob', message: 'Valid Date of Birth (DD-Mon-YYYY) is required for commutation age calculation.' });
  }
  if (!g('desig')) {
    issues.push({ level: 'error', step: 1, field: 'desig', message: 'Designation / Post (BPS) is required.' });
  }
  if (!g('height') || !g('marks')) {
    issues.push({ level: 'warning', step: 1, field: 'height', message: 'Height or Identification Marks blank (needed on Part II & Descriptive Roll).' });
  }

  if (!g('dept') || !g('office')) {
    issues.push({ level: 'error', step: 2, field: 'dept', message: 'Department and Office Name are required on forwarding letter & certificates.' });
  }
  if (!g('pplace')) {
    issues.push({ level: 'error', step: 2, field: 'pplace', message: 'District Accounts Office / Place of payment is missing.' });
  }
  if (!g('ddo')) {
    issues.push({ level: 'warning', step: 2, field: 'ddo', message: 'D.D.O Name is blank (will print generic signature space only).' });
  }
  if (!g('bank') || !g('acct')) {
    issues.push({ level: 'warning', step: 2, field: 'bank', message: 'Bank Name or Account/IBAN No. is blank (needed for Direct Credit & Commutation Certificate).' });
  }

  const dob = parseDateStr(g('dob'));
  const doj = parseDateStr(g('doj'));
  const dor = parseDateStr(g('dor'));

  if (!doj) {
    issues.push({ level: 'error', step: 3, field: 'doj', message: 'Valid Date of Joining (DD-Mon-YYYY) is required.' });
  }
  if (!dor) {
    issues.push({ level: 'error', step: 3, field: 'dor', message: 'Valid Date of Retirement / Death (DD-Mon-YYYY) is required.' });
  }
  if (doj && dor && dor < doj) {
    issues.push({ level: 'error', step: 3, field: 'dor', message: 'Retirement date cannot be earlier than Date of Joining.' });
  }
  if (dob && doj) {
    const ageAtJoin = diffYMD(g('dob'), g('doj'));
    if (ageAtJoin && ageAtJoin[0] < 18) {
      issues.push({
        level: 'warning',
        step: 3,
        field: 'doj',
        message: `Employee joined below age 18 (${ageAtJoin[0]}Y ${ageAtJoin[1]}M). Record below-18 spell under Non-Qualifying Service (I).`,
      });
    }
  }
  if (calc.T && calc.tq < 3600) {
    issues.push({
      level: 'warning',
      step: 3,
      field: 'doj',
      message: 'Qualifying service is under 10 years (minimum 10 years normally required for ordinary pension).',
    });
  }
  if (!calc.avg) {
    issues.push({ level: 'error', step: 3, field: 'lastpay', message: 'Last Basic Pay / Average Emoluments is required to compute Gross Pension & Commutation.' });
  }
  if (doj && dor && !g('g0n')) {
    issues.push({
      level: 'warning',
      step: 3,
      field: 'g0n',
      message: 'Q.13 Government service chronological row is empty (use 1-click Auto-Fill from Joining/Retirement dates).',
    });
  }

  if (calc.age !== null && (calc.age < 28 || calc.age > 60)) {
    issues.push({
      level: 'warning',
      step: 4,
      field: 'pct',
      message: `Calculated age next birthday (${calc.age}) is outside the standard 28–60 commutation table; verify DOB and DOR.`,
    });
  }

  return issues;
}

export interface SavedPensionCase {
  id: string;
  label: string;
  pid: string;
  updatedAt: string;
  data: PensionFormData;
}
