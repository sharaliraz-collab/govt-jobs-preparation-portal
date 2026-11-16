const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { Client } = require('pg');

const SUBJECT = 'Islamic Studies';

function canonicalNorm(text) {
  return String(text || '')
    .replace(/\uFFFC/g, '')
    .replace(/\u200E/g, '')
    .replace(/\uFB01/g, 'fi')
    .replace(/\uFB02/g, 'fl')
    .toLowerCase()
    .replace(/[\u2018\u2019'`]/g, '')
    .replace(/-e-/g, ' ')
    .replace(/\b(r\.?a\.?|a\.?s\.?|s\.?a\.?w\.?s?|pbuh|ﷺ|rah|ah|ra)\b/gi, ' ')
    .replace(/_+/g, '')
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, ' ')
    .trim();
}

async function getClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in environment or .env');
  }
  const client = new Client({ connectionString });
  await client.connect();
  return client;
}

async function main() {
  let client = await getClient();
  console.log('Connected to Neon DB...');

  const dataPath = path.join(__dirname, 'src', 'data', 'islamic-pdf-mcqs.json');
  const bank = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const existingRes = await client.query(
    `SELECT id, "textEn" FROM "Question" WHERE LOWER("subject") = 'islamic studies';`
  );
  const existingNorms = new Set(existingRes.rows.map((r) => canonicalNorm(r.textEn)));
  const toInsert = bank.filter((item) => !existingNorms.has(canonicalNorm(item.textEn)));

  console.log(
    `Existing Islamic Studies rows in DB: ${existingRes.rows.length}. Net-new non-duplicate to insert: ${toInsert.length}.`
  );

  const BATCH_SIZE = 50;
  const totalBatches = Math.ceil(toInsert.length / BATCH_SIZE);
  const baseTimeMs = Date.now();

  for (let b = 0; b < toInsert.length; b += BATCH_SIZE) {
    const batch = toInsert.slice(b, b + BATCH_SIZE);
    let success = false;
    let retries = 0;

    while (!success && retries < 5) {
      try {
        await client.query('BEGIN');
        for (let j = 0; j < batch.length; j++) {
          const item = batch[j];
          const globalIdx = b + j;
          const createdAt = new Date(baseTimeMs - globalIdx * 10);
          await client.query(
            `INSERT INTO "Question"
              ("id", "subject", "textEn", "textUr", "optionsEn", "optionsUr", "correctIndex", "explanationEn", "difficulty", "createdAt", "updatedAt")
             VALUES
              (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $9);`,
            [
              SUBJECT,
              item.textEn,
              item.textUr || item.textEn,
              item.optionsEn,
              item.optionsUr || item.optionsEn,
              item.correctIndex,
              item.explanationEn,
              'medium',
              createdAt,
            ]
          );
        }
        await client.query('COMMIT');
        success = true;
        console.log(`Seeded batch ${Math.floor(b / BATCH_SIZE) + 1} / ${totalBatches}`);
      } catch (err) {
        try {
          await client.query('ROLLBACK');
        } catch (e) {}
        retries++;
        console.log(`Retry ${retries}/5 for batch ${Math.floor(b / BATCH_SIZE) + 1}: ${err.message}`);
        try {
          await client.end();
        } catch (e) {}
        await new Promise((r) => setTimeout(r, 2000));
        client = await getClient();
      }
    }
    if (!success) {
      throw new Error(`Failed to insert batch starting at ${b}`);
    }
  }

  const finalCheck = await client.query(
    `SELECT COUNT(*)::int AS total, COUNT(DISTINCT LOWER("textEn"))::int AS unique_stems
     FROM "Question"
     WHERE LOWER("subject") = 'islamic studies';`
  );
  console.log('Final Neon DB Islamic Studies summary:', finalCheck.rows[0]);

  try {
    await client.end();
  } catch (e) {}
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
