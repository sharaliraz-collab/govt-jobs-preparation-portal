export type OfficialPdfFormType = 'pension-papers' | 'fo2' | 'fo1';

export interface DownloadFormPdfOptions {
  formType: OfficialPdfFormType;
  data: unknown;
  selectedPages?: number[];
  fallbackFilename?: string;
}

/**
 * Requests a pixel-perfect, server-rendered PDF directly from POST /api/forms/pdf
 * and triggers an immediate file download (no browser print dialog).
 * Strictly limited to official forms: pension-papers, fo2, and fo1.
 */
export async function downloadOfficialFormPdf({
  formType,
  data,
  selectedPages,
  fallbackFilename,
}: DownloadFormPdfOptions): Promise<string> {
  const res = await fetch('/api/forms/pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      formType,
      data,
      ...(Array.isArray(selectedPages) ? { selectedPages } : {}),
    }),
  });

  if (!res.ok) {
    let msg = `Server PDF generation failed (HTTP ${res.status}).`;
    try {
      const errJson = await res.json();
      if (errJson?.error) msg = String(errJson.error);
    } catch {
      /* ignore non-JSON error body */
    }
    throw new Error(msg);
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/pdf')) {
    throw new Error('Server did not return a valid PDF document.');
  }

  const disposition = res.headers.get('content-disposition') || '';
  const match = disposition.match(/filename="?([^"]+)"?/i);
  const filename =
    (match && match[1]) ||
    fallbackFilename ||
    `${formType}-official-govtjobs-pk.pdf`;

  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  try {
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);
  }

  return filename;
}
