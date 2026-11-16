require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required (configure it in .env).');
}

const SUBJECT = 'Physics';

function loadPhysicsMCQsFromPDFJson() {
  const jsonPath = path.join(__dirname, 'src', 'data', 'physics-pdf-mcqs.json');
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('src/data/physics-pdf-mcqs.json is empty or invalid.');
  }

  // Deduplicate by normalized question text while preserving order
  const seen = new Set();
  const unique = [];

  for (const q of parsed) {
    const textEn = (q.textEn || '').trim();
    if (!textEn) continue;
    const key = textEn.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const optionsEn = Array.isArray(q.optionsEn) ? q.optionsEn.slice(0, 4) : [];
    if (optionsEn.length !== 4) continue;

    const correctIndex =
      typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex <= 3
        ? q.correctIndex
        : 0;

    const topic = q.topic || 'Physics';
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

  const questions = loadPhysicsMCQsFromPDFJson();
  console.log(`Loaded ${questions.length} unique Physics PDF MCQs.`);

  // Clear previous duplicate/placeholder Physics questions safely
  await client.query(`DELETE FROM "Question" WHERE LOWER("subject") = 'physics';`);
  console.log(`Cleared previous ${SUBJECT} questions.`);

  // Assign descending timestamps so `ORDER BY "createdAt" DESC` returns Q1..Q941 in PDF order
  const baseTime = Date.now();
  const batchSize = 50;

  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    const values = [];
    const placeholders = [];

    batch.forEach((q, batchIdx) => {
      const globalIdx = i + batchIdx;
      const createdAt = new Date(baseTime - globalIdx * 1000);
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

  const verify = await client.query(
    `SELECT COUNT(*)::int AS total, COUNT(DISTINCT "textEn")::int AS unique_count FROM "Question" WHERE "subject" = $1;`,
    [SUBJECT]
  );
  console.log('📊 Verified Neon DB Physics Question counts:', verify.rows[0]);

  await client.end();
  console.log(`🎉 SUCCESS! All ${questions.length} unique Physics PDF MCQs seeded into Neon DB!`);
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
