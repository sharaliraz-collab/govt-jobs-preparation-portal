const { Client } = require('pg');
const connectionString = 'postgresql://neondb_owner:npg_wkeHO3sTxiE6@ep-rough-rice-ax0e6jfa-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function check() {
  const client = new Client({ connectionString });
  await client.connect();
  const users = await client.query('SELECT count(*) FROM "User"');
  const jobs = await client.query('SELECT count(*) FROM "Job"');
  const questions = await client.query('SELECT count(*) FROM "Question"');
  const quizzes = await client.query('SELECT count(*) FROM "Quiz"');
  console.log('SUCCESS! Neon Database Record Counts:', {
    users: users.rows[0].count,
    jobs: jobs.rows[0].count,
    questions: questions.rows[0].count,
    quizzes: quizzes.rows[0].count
  });
  await client.end();
}

check().catch(console.error);
