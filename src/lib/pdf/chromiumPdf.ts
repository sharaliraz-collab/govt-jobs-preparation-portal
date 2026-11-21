import fs from 'fs';
import puppeteer, { Browser } from 'puppeteer-core';

const LOCAL_CHROME_CANDIDATES: string[] =
  process.platform === 'win32'
    ? [
        process.env.CHROME_EXECUTABLE_PATH || '',
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      ]
    : process.platform === 'darwin'
    ? [
        process.env.CHROME_EXECUTABLE_PATH || '',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      ]
    : [
        process.env.CHROME_EXECUTABLE_PATH || '',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
      ];

async function launchBrowser(): Promise<Browser> {
  // On Vercel / Linux serverless, use @sparticuz/chromium (bundled brotli binary)
  const isServerlessLinux =
    process.platform === 'linux' &&
    (Boolean(process.env.VERCEL) ||
      Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
      !LOCAL_CHROME_CANDIDATES.some((p) => p && fs.existsSync(p)));

  if (isServerlessLinux) {
    const chromium = (await import('@sparticuz/chromium')).default;
    chromium.setGraphicsMode = false;
    const executablePath = await chromium.executablePath();
    return puppeteer.launch({
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--font-render-hinting=none',
      ],
      executablePath,
      headless: true,
    });
  }

  const localPath = LOCAL_CHROME_CANDIDATES.find((p) => p && fs.existsSync(p));
  if (!localPath) {
    throw new Error(
      'No Chrome/Chromium executable found for server-side PDF generation. Set CHROME_EXECUTABLE_PATH or deploy on Vercel Linux.'
    );
  }

  return puppeteer.launch({
    executablePath: localPath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none',
    ],
  });
}

export async function renderHtmlToPdfBuffer(
  html: string,
  opts: { landscape: boolean }
): Promise<Uint8Array> {
  let browser: Browser | null = null;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();

    // Block all outbound network / file requests inside headless Chromium (data: URIs only)
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const url = req.url();
      if (url.startsWith('data:') || url === 'about:blank') {
        req.continue();
      } else {
        req.abort('blockedbyclient');
      }
    });

    await page.setContent(html, {
      waitUntil: 'load',
      timeout: 25000,
    });

    await page.emulateMediaType('print');

    const pdfBytes = await page.pdf({
      format: 'A4',
      landscape: opts.landscape,
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
    });

    return new Uint8Array(pdfBytes);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {
        /* ignore cleanup errors */
      }
    }
  }
}
