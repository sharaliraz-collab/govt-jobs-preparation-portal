/**
 * Shared display, sanitization, and pagination helpers for MCQ quiz pages.
 */

export function cleanQuestionStem(text: string): string {
  return String(text || '')
    .replace(/\uFB01/g, 'fi')
    .replace(/\uFB02/g, 'fl')
    .replace(/_+/g, '______')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getTopicFromExplanation(explanationEn?: string, fallback = 'General'): string {
  if (!explanationEn) return fallback;
  const match = explanationEn.match(/^Topic:\s*([^|]+)\|/i);
  return match ? match[1].trim() : fallback;
}

export function getCleanExplanation(explanationEn?: string): string | null {
  if (!explanationEn) return null;
  const cleaned = explanationEn.replace(/^Topic:\s*[^|]+\|\s*/i, '').trim();
  if (!cleaned || /^Correct answer:\s*[A-D]\./i.test(cleaned)) {
    return null;
  }
  return cleaned;
}

export function getWindowedPages(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: Array<number | 'ellipsis'> = [1];
  if (currentPage > 3) pages.push('ellipsis');
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let p = start; p <= end; p++) pages.push(p);
  if (currentPage < totalPages - 2) pages.push('ellipsis');
  pages.push(totalPages);
  return pages;
}
