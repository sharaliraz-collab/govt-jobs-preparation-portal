import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { APTITUDE_TOPICS } from '@/data/aptitudeTopics';
import { loadAptitudeQuestions } from '@/lib/aptitude';
import interestingQuestions from '@/data/interesting-questions.json';

export const dynamic = 'force-dynamic';

export interface RandomQuizQuestion {
  id: string;
  subject: string;
  textEn: string;
  textUr?: string;
  optionsEn: string[];
  optionsUr?: string[];
  correctIndex: number;
  explanationEn?: string;
  funCategory?: string;
  didYouKnow?: string;
}

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededShuffle<T>(arr: T[], seedStr: string): T[] {
  const copy = [...arr];
  let state = hashSeed(seedStr) || 1;
  for (let i = copy.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function fisherYates<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function sampleAptitude(count: number, seedStr?: string): Promise<RandomQuizQuestion[]> {
  if (count <= 0) return [];
  const topics = seedStr
    ? seededShuffle(APTITUDE_TOPICS, seedStr).slice(0, Math.min(4, count + 1))
    : fisherYates(APTITUDE_TOPICS).slice(0, Math.min(4, count + 1));

  const pool: RandomQuizQuestion[] = [];
  for (const t of topics) {
    const qs = await loadAptitudeQuestions(t.slug);
    for (let idx = 0; idx < qs.length; idx++) {
      const q = qs[idx];
      if (!q.q || q.q.includes('\\') || q.o.some((opt) => opt.includes('\\'))) continue;
      pool.push({
        id: `apt-${t.slug}-${idx}`,
        subject: `Aptitude · ${t.title}`,
        textEn: q.q,
        optionsEn: q.o,
        correctIndex: q.a,
        explanationEn: q.s || `Topic: ${t.title} | Correct answer: ${String.fromCharCode(65 + q.a)}. ${q.o[q.a]}`,
      });
    }
  }

  const ordered = seedStr ? seededShuffle(pool, `${seedStr}-apt`) : fisherYates(pool);
  return ordered.slice(0, count);
}

function normalizeInterestingPool(category: string, subject: string): RandomQuizQuestion[] {
  const base = interestingQuestions as RandomQuizQuestion[];
  return base.filter((q) => {
    const catOk = !category || category === 'all' || q.funCategory === category;
    if (!catOk) return false;
    if (!subject || subject === 'all') return true;
    const sLower = subject.toLowerCase();
    if (sLower === 'world gk') return q.subject.startsWith('World ') || q.subject === 'General Knowledge' || q.funCategory === 'Pakistan & World Records';
    if (sLower === 'english grammar') return q.subject.startsWith('English') || q.funCategory === 'Brain Teasers';
    if (sLower === 'aptitude') return q.subject.startsWith('Aptitude');
    return q.subject.toLowerCase() === sLower;
  });
}

async function queryDbQuestions(subject: string, limit: number, dateSeed?: string): Promise<RandomQuizQuestion[]> {
  const orderSql = dateSeed ? 'md5("id" || $1)' : 'RANDOM()';

  if (subject === 'all') {
    const sql = `
      WITH bucketed AS (
        SELECT id, subject, "textEn", "textUr", "optionsEn", "optionsUr", "correctIndex", "explanationEn",
          CASE
            WHEN subject LIKE 'English%' THEN 'English'
            WHEN subject LIKE 'World %' OR subject = 'General Knowledge' THEN 'World GK'
            ELSE subject
          END AS grp
        FROM "Question"
      ),
      ranked AS (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY grp ORDER BY ${dateSeed ? 'md5("id" || $2)' : 'RANDOM()'}) AS rn
        FROM bucketed
      )
      SELECT id, subject, "textEn", "textUr", "optionsEn", "optionsUr", "correctIndex", "explanationEn"
      FROM ranked
      ORDER BY rn, ${dateSeed ? 'md5("id" || $2)' : 'RANDOM()'}
      LIMIT $1;
    `;
    const rows = dateSeed
      ? await prisma.$queryRawUnsafe<RandomQuizQuestion[]>(sql, limit, dateSeed)
      : await prisma.$queryRawUnsafe<RandomQuizQuestion[]>(sql, limit);
    return rows;
  }

  if (subject === 'English Grammar') {
    const sql = `
      SELECT id, subject, "textEn", "textUr", "optionsEn", "optionsUr", "correctIndex", "explanationEn"
      FROM "Question"
      WHERE subject LIKE 'English%'
      ORDER BY ${orderSql}
      LIMIT ${dateSeed ? '$2' : '$1'};
    `;
    return dateSeed
      ? prisma.$queryRawUnsafe<RandomQuizQuestion[]>(sql, dateSeed, limit)
      : prisma.$queryRawUnsafe<RandomQuizQuestion[]>(sql, limit);
  }

  if (subject === 'World GK') {
    const sql = `
      SELECT id, subject, "textEn", "textUr", "optionsEn", "optionsUr", "correctIndex", "explanationEn"
      FROM "Question"
      WHERE subject LIKE 'World %' OR subject = 'General Knowledge'
      ORDER BY ${orderSql}
      LIMIT ${dateSeed ? '$2' : '$1'};
    `;
    return dateSeed
      ? prisma.$queryRawUnsafe<RandomQuizQuestion[]>(sql, dateSeed, limit)
      : prisma.$queryRawUnsafe<RandomQuizQuestion[]>(sql, limit);
  }

  const sql = `
    SELECT id, subject, "textEn", "textUr", "optionsEn", "optionsUr", "correctIndex", "explanationEn"
    FROM "Question"
    WHERE subject = $1
    ORDER BY ${dateSeed ? 'md5("id" || $2)' : 'RANDOM()'}
    LIMIT ${dateSeed ? '$3' : '$2'};
  `;
  return dateSeed
    ? prisma.$queryRawUnsafe<RandomQuizQuestion[]>(sql, subject, dateSeed, limit)
    : prisma.$queryRawUnsafe<RandomQuizQuestion[]>(sql, subject, limit);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const modeParam = (searchParams.get('mode') || 'random').toLowerCase();
    const mode = modeParam === 'daily' || modeParam === 'interesting' ? modeParam : 'random';
    const subject = searchParams.get('subject') || 'all';
    const category = searchParams.get('category') || 'all';
    const rawCount = parseInt(searchParams.get('count') || '10', 10);
    const count = Number.isFinite(rawCount) ? Math.min(50, Math.max(1, rawCount)) : 10;
    const dateParam = searchParams.get('date') || new Date().toISOString().slice(0, 10);

    // Build lookup of curiosity notes so random/daily hits also surface Did You Know when a curated item appears!
    const dykById = new Map<string, { didYouKnow?: string; funCategory?: string }>();
    for (const iq of interestingQuestions as RandomQuizQuestion[]) {
      dykById.set(iq.id, { didYouKnow: iq.didYouKnow, funCategory: iq.funCategory });
    }

    const enrich = (items: RandomQuizQuestion[]) =>
      items.map((q) => {
        const extra = dykById.get(q.id);
        return extra ? { ...q, didYouKnow: q.didYouKnow ?? extra.didYouKnow, funCategory: q.funCategory ?? extra.funCategory } : q;
      });

    if (mode === 'interesting') {
      const pool = normalizeInterestingPool(category, subject);
      const selected = searchParams.get('daily') === '1'
        ? seededShuffle(pool, `interesting-${dateParam}-${category}-${subject}`).slice(0, count)
        : fisherYates(pool).slice(0, count);

      return NextResponse.json({
        mode,
        subject,
        category,
        date: dateParam,
        totalPool: pool.length,
        questions: selected,
      });
    }

    if (subject === 'Aptitude') {
      const aptItems = await sampleAptitude(count, mode === 'daily' ? `apt-${dateParam}` : undefined);
      return NextResponse.json({
        mode,
        subject,
        date: dateParam,
        totalPool: 3702,
        questions: aptItems,
      });
    }

    const dateSeed = mode === 'daily' ? dateParam : undefined;
    let questions: RandomQuizQuestion[] = [];

    try {
      const aptShare = subject === 'all' && count >= 5 ? Math.max(1, Math.round(count * 0.18)) : 0;
      const dbNeed = Math.max(1, count - aptShare);
      const [dbRows, aptRows] = await Promise.all([
        queryDbQuestions(subject, dbNeed, dateSeed),
        aptShare > 0 ? sampleAptitude(aptShare, dateSeed ? `daily-${dateSeed}` : undefined) : Promise.resolve([]),
      ]);

      const merged = [...dbRows, ...aptRows];
      questions = enrich(dateSeed ? seededShuffle(merged, `mix-${dateSeed}-${count}`) : fisherYates(merged)).slice(0, count);
    } catch (dbErr) {
      console.warn('Random Quiz DB query failed, using curated JSON fallback:', dbErr);
      let fallbackPool: RandomQuizQuestion[] = normalizeInterestingPool('all', subject);
      if (subject === 'Biology') {
        const mod = await import('@/data/biology-pdf-mcqs.json');
        fallbackPool = ((mod as any).default ?? mod) as RandomQuizQuestion[];
      } else if (subject === 'Chemistry') {
        const mod = await import('@/data/chemistry-pdf-mcqs.json');
        fallbackPool = ((mod as any).default ?? mod) as RandomQuizQuestion[];
      } else if (subject === 'Islamic Studies') {
        const mod = await import('@/data/islamic-pdf-mcqs.json');
        fallbackPool = ((mod as any).default ?? mod) as RandomQuizQuestion[];
      }
      if (fallbackPool.length === 0) {
        fallbackPool = interestingQuestions as RandomQuizQuestion[];
      }
      questions = (dateSeed ? seededShuffle(fallbackPool, `fb-${dateSeed}-${subject}`) : fisherYates(fallbackPool)).slice(0, count);
    }

    return NextResponse.json({
      mode,
      subject,
      date: dateParam,
      questions,
    });
  } catch (err: any) {
    console.error('Error in GET /api/questions/random:', err);
    return NextResponse.json(
      { error: 'Failed to generate random questions', message: err?.message },
      { status: 500 }
    );
  }
}
