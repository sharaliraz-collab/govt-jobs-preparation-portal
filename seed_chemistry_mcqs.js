require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required (configure it in .env).');
}

const SUBJECT = 'Chemistry';

function loadChemistryMCQsFromPDFJson() {
  const jsonPath = path.join(__dirname, 'src', 'data', 'chemistry-pdf-mcqs.json');
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('src/data/chemistry-pdf-mcqs.json is empty or invalid.');
  }

  // Deduplicate by normalized (question text + options) while preserving order
  const seen = new Set();
  const unique = [];

  for (const q of parsed) {
    const textEn = (q.textEn || '').trim();
    if (!textEn) continue;

    const optionsEn = Array.isArray(q.optionsEn) ? q.optionsEn.slice(0, 4).map((o) => String(o).trim()) : [];
    if (optionsEn.length !== 4 || optionsEn.some((o) => !o)) continue;

    const key = `${textEn.toLowerCase()}###${optionsEn.map((o) => o.toLowerCase()).join('||')}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const correctIndex =
      typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex <= 3
        ? q.correctIndex
        : 0;

    const topic = q.topic || 'Chemistry';
    const baseExplanation = (q.explanationEn || '').trim();
    const explanationEn = baseExplanation
      ? (baseExplanation.startsWith('Topic:') ? baseExplanation : `Topic: ${topic} | ${baseExplanation}`)
      : `Topic: ${topic} | Correct answer: ${String.fromCharCode(65 + correctIndex)}. ${optionsEn[correctIndex]}`;

    unique.push({
      id: q.id,
      subject: SUBJECT,
      topic,
      textEn,
      textUr: (q.textUr || textEn).trim(),
      optionsEn,
      optionsUr: Array.isArray(q.optionsUr) && q.optionsUr.length === 4 ? q.optionsUr : optionsEn,
      correctIndex,
      explanationEn,
    });
  }

  return unique;
}

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log('✅ Connected to Neon DB...');

  const questions = loadChemistryMCQsFromPDFJson();
  console.log(`Loaded ${questions.length} unique Chemistry PDF MCQs.`);

  await client.query('BEGIN');
  try {
    // Clear previous Chemistry questions safely before seeding fresh set
    const del = await client.query(`DELETE FROM "Question" WHERE LOWER("subject") = 'chemistry';`);
    console.log(`Cleared ${del.rowCount} previous ${SUBJECT} questions.`);

    // Assign ascending timestamps so `createdAt ASC` sorting on /quizzes/subject/chemistry preserves PDF order
    const baseTime = Date.now();
    const batchSize = 50;

    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      const values = [];
      const placeholders = [];

      batch.forEach((q, batchIdx) => {
        const globalIdx = i + batchIdx;
        const createdAt = new Date(baseTime + globalIdx * 1000);
        const offset = batchIdx * 9;
        placeholders.push(
          `(gen_random_uuid(), $${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, 'medium', $${offset + 8}, $${offset + 9})`
        );
        values.push(
          q.subject,
          q.textEn,
          q.textUr,
          q.optionsEn,
          q.optionsUr,
          q.correctIndex,
          q.explanationEn,
          createdAt,
          createdAt
        );
      });

      await client.query(
        `
        INSERT INTO "Question"
          ("id", "subject", "textEn", "textUr", "optionsEn", "optionsUr", "correctIndex", "explanationEn", "difficulty", "createdAt", "updatedAt")
        VALUES ${placeholders.join(', ')};
        `,
        values
      );

      console.log(
        `  ✅ Seeded batch ${Math.floor(i / batchSize) + 1} / ${Math.ceil(questions.length / batchSize)}`
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }

  const verify = await client.query(
    `SELECT COUNT(*)::int AS total, COUNT(DISTINCT "textEn")::int AS unique_stems FROM "Question" WHERE "subject" = $1;`,
    [SUBJECT]
  );
  console.log('📊 Verified Neon DB Chemistry Question counts:', verify.rows[0]);

  await client.end();
  console.log(`🎉 SUCCESS! All ${questions.length} unique Chemistry PDF MCQs seeded into Neon DB!`);
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
