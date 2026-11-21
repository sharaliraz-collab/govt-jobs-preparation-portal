import { DEFAULT_PENSION_DATA, PensionFormData } from './pensionEngine';
import { SITE_URL } from './seo';

export type SharePrefillMode = 'tool' | 'office' | 'full';

export interface DecodedPrefill {
  mode: 'office' | 'full';
  data: PensionFormData;
  senderNote?: string;
}

/**
 * Office, Department, D.D.O, and pension rule fields safe for a Clerk / Headmaster
 * to pre-fill and send to a retiring employee on WhatsApp so the employee only has
 * to enter their own Personal, Service, and Bank details.
 */
export const OFFICE_PREFILL_KEYS: readonly string[] = [
  'dept',
  'office',
  'ddo',
  'ddod',
  'ddoPlace',
  'pplace',
  'cls',
  'g0n',
  'orderNo',
  'orderDate',
  'sanctionAuth',
  'authNo',
  'pct',
  'roundRule',
  'font',
  'chargeHalf',
];

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(b64u: string): Uint8Array {
  const padded = b64u.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((b64u.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encodes pension form subset into a compact URL hash payload (#prefill=...).
 * Hash fragments are strictly client-side and NEVER sent to any web server or log.
 */
export function encodePrefillHash(
  mode: 'office' | 'full',
  data: PensionFormData,
  senderNote?: string
): string {
  const subset: PensionFormData = {};
  const keys = mode === 'office' ? OFFICE_PREFILL_KEYS : Object.keys(data);

  for (const k of keys) {
    const val = (data[k] || '').trim();
    if (!val) continue;
    // Skip default unchanged boilerplate to keep WhatsApp links compact
    if (DEFAULT_PENSION_DATA[k] === val && !['dept', 'office', 'pplace', 'cls', 'pct'].includes(k)) {
      continue;
    }
    subset[k] = val;
  }

  const payload: { m: 'office' | 'full'; d: PensionFormData; n?: string } = {
    m: mode,
    d: subset,
  };
  if (senderNote && senderNote.trim()) {
    payload.n = senderNote.trim().slice(0, 140);
  }

  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  return `#prefill=${bytesToBase64Url(bytes)}`;
}

export function decodePrefillHash(hash: string): DecodedPrefill | null {
  if (!hash || !hash.includes('prefill=')) return null;
  try {
    const raw = hash.replace(/^#/, '');
    const match = raw.match(/(?:^|&)prefill=([A-Za-z0-9\-_]+)/);
    if (!match) return null;
    const bytes = base64UrlToBytes(match[1]);
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object' || typeof parsed.d !== 'object') return null;

    const cleanData: PensionFormData = {};
    for (const [k, v] of Object.entries(parsed.d)) {
      if (typeof k === 'string' && typeof v === 'string' && k.length <= 24) {
        cleanData[k] = v.slice(0, 300);
      }
    }
    return {
      mode: parsed.m === 'office' ? 'office' : 'full',
      data: cleanData,
      senderNote: typeof parsed.n === 'string' ? parsed.n.slice(0, 140) : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Normalizes Pakistani & international phone inputs for wa.me links.
 * Examples: "0300-1234567" -> "923001234567", "+92 300 1234567" -> "923001234567".
 */
export function normalizeWhatsAppPhone(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0092')) return digits.slice(2);
  if (digits.startsWith('03') && digits.length === 11) return `92${digits.slice(1)}`;
  if (digits.startsWith('3') && digits.length === 10) return `92${digits}`;
  return digits;
}

export function getPensionBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin}/forms/pension-papers`;
  }
  return `${SITE_URL}/forms/pension-papers`;
}

export function buildPensionSharePayload(
  mode: SharePrefillMode,
  data: PensionFormData,
  opts?: { phone?: string; senderNote?: string }
): { shareUrl: string; message: string; whatsappHref: string } {
  const baseUrl = getPensionBaseUrl();
  const phone = normalizeWhatsAppPhone(opts?.phone || '');
  const waBase = phone ? `https://wa.me/${phone}` : 'https://wa.me/';

  if (mode === 'tool') {
    const shareUrl = baseUrl;
    const message = [
      'Government Pension Papers — Fill Once & Print All 16 Official A4 Pages (Free)',
      '',
      'No more filling pension forms by hand or risking calculation mistakes:',
      '• Form 3 (Pen.) Part I & II + DAO Forwarding Letter',
      '• Auto Qualifying Service, Gross/Net Pension & Commutation (Figures + Words)',
      '• All 8 D.D.O / H.O.D Certificates & Govt. of Sindh Certificate',
      '• Descriptive Roll, Specimen Signatures & A.T.C.5 Last-Pay Certificate',
      '',
      '100% free & private (data stays in your browser):',
      shareUrl,
    ].join('\n');

    return {
      shareUrl,
      message,
      whatsappHref: `${waBase}?text=${encodeURIComponent(message)}`,
    };
  }

  if (mode === 'office') {
    const hash = encodePrefillHash('office', data, opts?.senderNote);
    const shareUrl = `${baseUrl}${hash}`;
    const officeLabel = [data.office, data.dept].filter(Boolean).join(' — ');
    const message = [
      `Pension Papers — Please Add Your Personal Details${officeLabel ? ` (${officeLabel})` : ''}`,
      '',
      'Office, Department & D.D.O details are already pre-filled in this link.',
      'Open on your mobile phone, enter your Name, Father Name, CNIC, DOB, Joining Date & Bank Account, then tap "Share on WhatsApp" to send back for printing all 16 official A4 sheets.',
      opts?.senderNote ? `\nNote: ${opts.senderNote.trim()}` : '',
      '',
      shareUrl,
    ]
      .filter((line) => line !== undefined)
      .join('\n')
      .replace(/\n{3,}/g, '\n\n');

    return {
      shareUrl,
      message,
      whatsappHref: `${waBase}?text=${encodeURIComponent(message)}`,
    };
  }

  // mode === 'full'
  const hash = encodePrefillHash('full', data, opts?.senderNote);
  const shareUrl = `${baseUrl}${hash}`;
  const empName = [data.pre, data.name].filter(Boolean).join(' ').trim() || 'Retiring Employee';
  const pidText = data.pid ? ` (Pay Roll ID: ${data.pid})` : '';
  const message = [
    `Pension Papers Details Ready — ${empName}${pidText}`,
    '',
    'Filled details are attached in this private link (stored only in the URL hash, never on a server). Open on the office computer to verify calculations and print all 16 official double-bordered A4 sheets:',
    opts?.senderNote ? `\nNote: ${opts.senderNote.trim()}` : '',
    '',
    shareUrl,
  ]
    .filter((line) => line !== undefined)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');

  return {
    shareUrl,
    message,
    whatsappHref: `${waBase}?text=${encodeURIComponent(message)}`,
  };
}
