const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { Client } = require('pg');

const SUBJECT = 'Biology';

function normalizeStem(text) {
  return String(text || '')
    .replace(/\uFB01/g, 'fi')
    .replace(/\uFB02/g, 'fl')
    .toLowerCase()
    .replace(/\s*\(q\d+\)\s*$/i, '')
    .replace(/_+/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
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

  const dataPath = path.join(__dirname, 'src', 'data', 'biology-pdf-mcqs.json');
  const bank = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const byNormMeta = new Map(bank.map((q) => [normalizeStem(q.textEn), q]));

  // 1. Inspect existing Biology rows and deduplicate any cloned template rows
  const existingRes = await client.query(
    `SELECT id, "textEn", "textUr", "explanationEn"
     FROM "Question"
     WHERE LOWER("subject") = 'biology'
     ORDER BY "createdAt" ASC, id ASC;`
  );
  console.log(`Found ${existingRes.rows.length} existing Biology rows in DB.`);

  const linkedRes = await client.query(
    `SELECT DISTINCT qq."B" AS question_id
     FROM "_QuizQuestions" qq
     JOIN "Question" q ON q.id = qq."B"
     WHERE LOWER(q."subject") = 'biology';`
  );
  const linkedIds = new Set(linkedRes.rows.map((r) => r.question_id));

  const keptByNorm = new Map();
  const duplicateIdsToDelete = [];
  const rowsToClean = [];

  for (const row of existingRes.rows) {
    const norm = normalizeStem(row.textEn);
    if (!keptByNorm.has(norm)) {
      keptByNorm.set(norm, row);
      if (/\(Q\d+\)\s*$/i.test(row.textEn)) {
        const cleanEn = row.textEn.replace(/\s*\(Q\d+\)\s*$/i, '').trim();
        const cleanUr = row.textUr
          ? row.textUr.replace(/\s*\(\u0633\u0648\u0627\u0644\s+\d+\)\s*$/i, '').trim()
          : cleanEn;
        const meta = byNormMeta.get(norm);
        rowsToClean.push({
          id: row.id,
          textEn: cleanEn,
          textUr: cleanUr,
          explanationEn: meta ? meta.explanationEn : row.explanationEn,
        });
      }
    } else if (!linkedIds.has(row.id)) {
      duplicateIdsToDelete.push(row.id);
    }
  }

  if (rowsToClean.length > 0) {
    for (const u of rowsToClean) {
      await client.query(
        `UPDATE "Question"
         SET "textEn" = $2, "textUr" = $3, "explanationEn" = $4, "updatedAt" = NOW()
         WHERE id = $1;`,
        [u.id, u.textEn, u.textUr, u.explanationEn]
      );
    }
    console.log(`Cleaned template suffixes on ${rowsToClean.length} unique existing Biology rows.`);
  }

  if (duplicateIdsToDelete.length > 0) {
    await client.query(
      `DELETE FROM "Question" WHERE id = ANY($1::text[]);`,
      [duplicateIdsToDelete]
    );
    console.log(`Removed ${duplicateIdsToDelete.length} duplicate Biology rows.`);
  }

  // 2. Refresh remaining unique Biology stems in DB and insert only net-new non-duplicates
  const afterCleanRes = await client.query(
    `SELECT "textEn" FROM "Question" WHERE LOWER("subject") = 'biology';`
  );
  const existingNorms = new Set(afterCleanRes.rows.map((r) => normalizeStem(r.textEn)));
  const toInsert = bank.filter((item) => !existingNorms.has(normalizeStem(item.textEn)));

  console.log(
    `Already seeded unique Biology questions: ${existingNorms.size}. Net-new to insert: ${toInsert.length}.`
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
          // Stagger monotonically from a fixed baseTimeMs so ORDER BY createdAt DESC returns Q1..Q1524 in order
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
     WHERE LOWER("subject") = 'biology';`
  );
  console.log('Final Neon DB Biology summary:', finalCheck.rows[0]);

  try {
    await client.end();
  } catch (e) {}
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
