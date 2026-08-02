const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_wkeHO3sTxiE6@ep-rough-rice-ax0e6jfa.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log('✅ Connected to Neon DB...');

  await client.query(`
    ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "viewsCount" INT DEFAULT 0;
    ALTER TABLE "News" ADD COLUMN IF NOT EXISTS "viewsCount" INT DEFAULT 0;
    ALTER TABLE "Material" ADD COLUMN IF NOT EXISTS "viewsCount" INT DEFAULT 0;
    ALTER TABLE "FormDoc" ADD COLUMN IF NOT EXISTS "viewsCount" INT DEFAULT 0;
    ALTER TABLE "EmployeePost" ADD COLUMN IF NOT EXISTS "viewsCount" INT DEFAULT 0;

    CREATE TABLE IF NOT EXISTS "PageViewLog" (
      "id" TEXT PRIMARY KEY,
      "path" TEXT NOT NULL,
      "title" TEXT,
      "userAgent" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS "PageViewLog_path_idx" ON "PageViewLog"("path");
    CREATE INDEX IF NOT EXISTS "PageViewLog_createdAt_idx" ON "PageViewLog"("createdAt");
  `);

  console.log('🎉 SUCCESS! Analytics columns and PageViewLog table created in Neon DB!');
  await client.end();
}

main().catch(console.error);
