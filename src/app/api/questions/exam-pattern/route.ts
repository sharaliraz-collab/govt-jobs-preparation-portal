import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { APTITUDE_TOPICS } from '@/data/aptitudeTopics';
import { loadAptitudeQuestions } from '@/lib/aptitude';
import interestingQuestions from '@/data/interesting-questions.json';

export const dynamic = 'force-dynamic';

export interface ExamPatternQuestion {
  id: string;
  section: string;
  subject: string;
  textEn: string;
  optionsEn: string[];
  correctIndex: number;
  explanationEn?: string;
}

export interface BlueprintSection {
  section: string;
  weightPercent: number;
  starterCount: number;
  fullCount: number;
}

const EXAM_BLUEPRINT: BlueprintSection[] = [
  { section: 'English Grammar', weightPercent: 20, starterCount: 4, fullCount: 20 },
  { section: 'Pakistan Studies', weightPercent: 20, starterCount: 4, fullCount: 20 },
  { section: 'General Science', weightPercent: 20, starterCount: 4, fullCount: 20 },
  { section: 'Islamic Studies', weightPercent: 15, starterCount: 3, fullCount: 15 },
  { section: 'Aptitude', weightPercent: 15, starterCount: 3, fullCount: 15 },
  { section: 'World GK', weightPercent: 10, starterCount: 2, fullCount: 10 },
];

function fisherYates<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function sampleAptitudeSection(count: number): Promise<ExamPatternQuestion[]> {
  if (count <= 0) return [];
  const chosenTopics = fisherYates(APTITUDE_TOPICS).slice(0, Math.min(8, APTITUDE_TOPICS.length));
  const pool: ExamPatternQuestion[] = [];

  for (const t of chosenTopics) {
    const qs = await loadAptitudeQuestions(t.slug);
    const clean = qs
      .map((q, idx) => ({ q, idx }))
      .filter(
        ({ q }) =>
          Boolean(q.q) &&
          Array.isArray(q.o) &&
          q.o.length >= 4 &&
          !q.q.includes('\\') &&
          q.o.every((opt) => !opt.includes('\\'))
      );

    for (const { q, idx } of fisherYates(clean).slice(0, 5)) {
      pool.push({
        id: `apt-${t.slug}-${idx}`,
        section: 'Aptitude',
        subject: `Aptitude · ${t.title}`,
        textEn: q.q,
        optionsEn: q.o,
        correctIndex: q.a,
        explanationEn:
          q.s || `Topic: ${t.title} | Correct answer: ${String.fromCharCode(65 + q.a)}. ${q.o[q.a]}`,
      });
    }
  }

  return fisherYates(pool).slice(0, count);
}

async function querySectionFromDb(
  section: string,
  limit: number
): Promise<ExamPatternQuestion[]> {
  let sql = '';
  let rows: Array<{
    id: string;
    subject: string;
    textEn: string;
    optionsEn: string[];
    correctIndex: number;
    explanationEn: string | null;
  }> = [];

  if (section === 'English Grammar') {
    sql = `
      SELECT id, subject, "textEn", "optionsEn", "correctIndex", "explanationEn"
      FROM "Question"
      WHERE subject LIKE 'English%'
      ORDER BY RANDOM()
      LIMIT $1;
    `;
    rows = await prisma.$queryRawUnsafe(sql, limit);
  } else if (section === 'World GK') {
    sql = `
      SELECT id, subject, "textEn", "optionsEn", "correctIndex", "explanationEn"
      FROM "Question"
      WHERE subject LIKE 'World %' OR subject = 'General Knowledge'
      ORDER BY RANDOM()
      LIMIT $1;
    `;
    rows = await prisma.$queryRawUnsafe(sql, limit);
  } else {
    sql = `
      SELECT id, subject, "textEn", "optionsEn", "correctIndex", "explanationEn"
      FROM "Question"
      WHERE subject = $1
      ORDER BY RANDOM()
      LIMIT $2;
    `;
    rows = await prisma.$queryRawUnsafe(sql, section, limit);
  }

  return rows.map((r) => ({
    id: r.id,
    section,
    subject: r.subject,
    textEn: r.textEn,
    optionsEn: r.optionsEn,
    correctIndex: r.correctIndex,
    explanationEn: r.explanationEn || undefined,
  }));
}

async function fallbackSectionFromJson(
  section: string,
  limit: number
): Promise<ExamPatternQuestion[]> {
  let raw: any[] = [];
  if (section === 'Pakistan Studies') {
    const mod = await import('@/data/pak-studies-pdf-mcqs.json');
    raw = (mod as any).default ?? mod;
  } else if (section === 'General Science') {
    const mod = await import('@/data/general-science-pdf-mcqs.json');
    raw = (mod as any).default ?? mod;
  } else if (section === 'Islamic Studies') {
    const mod = await import('@/data/islamic-pdf-mcqs.json');
    raw = (mod as any).default ?? mod;
  } else {
    raw = (interestingQuestions as any[]).filter((q) => {
      if (section === 'English Grammar') return String(q.subject || '').startsWith('English') || q.funCategory === 'Brain Teasers';
      if (section === 'World GK') return String(q.subject || '').startsWith('World') || q.funCategory === 'Pakistan & World Records';
      return true;
    });
    if (raw.length < limit) {
      raw = interestingQuestions as any[];
    }
  }

  return fisherYates(raw)
    .slice(0, limit)
    .map((q) => ({
      id: String(q.id),
      section,
      subject: q.subject || section,
      textEn: q.textEn,
      optionsEn: q.optionsEn,
      correctIndex: q.correctIndex,
      explanationEn: q.explanationEn || undefined,
    }));
}

async function fetchSectionSafe(section: string, count: number): Promise<ExamPatternQuestion[]> {
  if (section === 'Aptitude') {
    return sampleAptitudeSection(count);
  }
  try {
    const rows = await querySectionFromDb(section, count);
    if (rows.length >= count) return rows;
    const fallback = await fallbackSectionFromJson(section, count - rows.length);
    const seen = new Set(rows.map((r) => r.id));
    return [...rows, ...fallback.filter((f) => !seen.has(f.id))].slice(0, count);
  } catch (err) {
    console.warn(`Exam pattern DB query failed for ${section}, using fallback:`, err);
    return fallbackSectionFromJson(section, count);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawSize = parseInt(searchParams.get('size') || '100', 10);
    const size = rawSize === 20 ? 20 : 100;

    // Fetch every section's randomized quota in parallel
    const sectionLists = await Promise.all(
      EXAM_BLUEPRINT.map((bp) =>
        fetchSectionSafe(bp.section, size === 20 ? bp.starterCount : bp.fullCount)
      )
    );

    // Deduplicate across sections & assemble:
    // Block 1 (Q1..Q20): exact balanced starter slice (4+4+4+3+3+2 = 20 MCQs)
    // Block 2 (Q21..Q100): remaining 80 MCQs cleanly grouped by section (16+16+16+12+12+8)
    const seenIds = new Set<string>();
    const starterBlock: ExamPatternQuestion[] = [];
    const remainingBlock: ExamPatternQuestion[] = [];

    EXAM_BLUEPRINT.forEach((bp, idx) => {
      const uniqueItems = sectionLists[idx].filter((item) => {
        if (seenIds.has(item.id)) return false;
        seenIds.add(item.id);
        return true;
      });
      starterBlock.push(...uniqueItems.slice(0, bp.starterCount));
      if (size === 100) {
        remainingBlock.push(...uniqueItems.slice(bp.starterCount, bp.fullCount));
      }
    });

    const questions = size === 20 ? starterBlock : [...starterBlock, ...remainingBlock];

    return NextResponse.json(
      {
        patternName: 'Pakistan One-Paper Screening Pattern (FPSC · PPSC · SPSC · NTS)',
        totalQuestions: questions.length,
        freeStarterCount: Math.min(20, starterBlock.length),
        durationMinutes: size === 20 ? 15 : 90,
        starterDurationMinutes: 15,
        blueprint: EXAM_BLUEPRINT,
        questions,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err: any) {
    console.error('Error in GET /api/questions/exam-pattern:', err);
    return NextResponse.json(
      { error: 'Failed to generate screening exam pattern', message: err?.message },
      { status: 500 }
    );
  }
}
