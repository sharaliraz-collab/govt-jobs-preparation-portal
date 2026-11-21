import { NextRequest, NextResponse } from 'next/server';
import { metric } from '@vercel/functions';
import {
  ALLOWED_PDF_FORMS,
  isAllowedPdfFormType,
  renderFo1PdfHtml,
  renderFo2PdfHtml,
  renderPensionPdfHtml,
} from '@/lib/pdf/formPdfRenderers';
import { renderHtmlToPdfBuffer } from '@/lib/pdf/chromiumPdf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MAX_BODY_BYTES = 512 * 1024; // 512 KB cap for form JSON payloads

export async function POST(req: NextRequest) {
  const startedAt = performance.now();
  let metricFormType = 'unknown';

  try {
    const contentLength = Number(req.headers.get('content-length') || '0');
    if (contentLength > MAX_BODY_BYTES) {
      metric('forms.pdf.generated', 1, { formType: 'unknown', outcome: 'rejected' });
      return NextResponse.json(
        { error: 'Form payload exceeds maximum allowed size.' },
        { status: 413 }
      );
    }

    const rawText = await req.text();
    if (rawText.length > MAX_BODY_BYTES) {
      metric('forms.pdf.generated', 1, { formType: 'unknown', outcome: 'rejected' });
      return NextResponse.json(
        { error: 'Form payload exceeds maximum allowed size.' },
        { status: 413 }
      );
    }

    let body: {
      formType?: unknown;
      data?: Record<string, unknown>;
      selectedPages?: number[];
    };
    try {
      body = JSON.parse(rawText);
    } catch {
      metric('forms.pdf.generated', 1, { formType: 'unknown', outcome: 'rejected' });
      return NextResponse.json({ error: 'Invalid JSON request payload.' }, { status: 400 });
    }

    // Strictly restrict server-side PDF downloads ONLY to official forms: pension-papers, fo2, fo1
    if (!isAllowedPdfFormType(body?.formType)) {
      metric('forms.pdf.generated', 1, { formType: 'disallowed', outcome: 'rejected' });
      return NextResponse.json(
        {
          error: `Server-side PDF download is strictly restricted to official forms (${ALLOWED_PDF_FORMS.join(', ')}).`,
        },
        { status: 403 }
      );
    }

    const formType = body.formType;
    metricFormType = formType;
    const formData = body.data && typeof body.data === 'object' ? body.data : {};

    const rendered =
      formType === 'pension-papers'
        ? renderPensionPdfHtml(formData, body.selectedPages)
        : formType === 'fo2'
        ? renderFo2PdfHtml(formData as Record<string, unknown>)
        : renderFo1PdfHtml(formData as Record<string, unknown>);

    const pdfBuffer = await renderHtmlToPdfBuffer(rendered.html, {
      landscape: rendered.landscape,
    });

    const durationMs = Math.round(performance.now() - startedAt);
    metric('forms.pdf.generated', 1, { formType, outcome: 'success' });
    metric('forms.pdf.duration_ms', durationMs, { formType });

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${rendered.filename}"`,
        'Content-Length': String(pdfBuffer.byteLength),
        'Cache-Control': 'no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
        'X-Form-Type': formType,
        'X-PDF-Pages': String(rendered.pageCount),
      },
    });
  } catch (err) {
    const durationMs = Math.round(performance.now() - startedAt);
    metric('forms.pdf.generated', 1, { formType: metricFormType, outcome: 'error' });
    metric('forms.pdf.duration_ms', durationMs, { formType: metricFormType });
    console.error('[api/forms/pdf] PDF generation error:', err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? `Could not generate official PDF on server: ${err.message}`
            : 'Could not generate official PDF on server. Please try again.',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      endpoint: '/api/forms/pdf',
      method: 'POST',
      allowedForms: ALLOWED_PDF_FORMS,
      note: 'Server-side official PDF generator restricted strictly to Pension Papers, FO-2, and FO-1.',
    },
    { status: 200 }
  );
}
