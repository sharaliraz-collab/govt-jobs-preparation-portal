const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const connectionString = 'postgresql://neondb_owner:npg_wkeHO3sTxiE6@ep-rough-rice-ax0e6jfa.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function seed() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log('Connected to Neon for direct seeding...');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('AdminPass123!', salt);
  const userId = 'admin-user-id-001';

  // Seed Admin User
  await client.query(`
    INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, 'admin', NOW(), NOW())
    ON CONFLICT (email) DO NOTHING
  `, [userId, 'Portal Administrator', 'admin@govtjobs.pk', hashedPassword]);
  console.log('✅ Admin user created: admin@govtjobs.pk / AdminPass123!');

  // Seed Jobs
  const deadline = new Date(Date.now() + 14 * 86400000);
  await client.query(`
    INSERT INTO "Job" (id, "titleEn", "titleUr", department, "descriptionEn", "descriptionUr", location, category, qualification, vacancies, deadline, source, status, featured, "postedById", "createdAt", "updatedAt")
    VALUES 
    ('job-1', 'Senior Software Engineer (BPS-18)', 'سینئر سافٹ ویئر انجینئر', 'Ministry of IT', 'Lead government software portal development teams.', 'سافٹ ویئر پورٹل کی تیاری۔', 'Islamabad', 'Information Technology', 'BS Computer Science', 5, $1, 'FPSC Gazette 2026', 'open', true, $2, NOW(), NOW()),
    ('job-2', 'Assistant Director (BPS-17)', 'اسسٹنٹ ڈائریکٹر', 'Federal Investigation Agency (FIA)', 'Public investigation and intelligence collection.', 'تحقیقاتی امور انجام دیں۔', 'Countrywide', 'Administration', 'Master Degree (16 Years)', 24, $1, 'FIA Official', 'open', true, $2, NOW(), NOW()),
    ('job-3', 'Lecturer Computer Science (BPS-17)', 'لیکچرار کمپیوٹر سائنس', 'Higher Education Department', 'Teach undergraduate CS courses.', 'کمپیوٹر سائنس کی تدریس۔', 'Punjab', 'Education', 'BS / Master in Computer Science', 40, $1, 'PPSC Advertisement', 'open', true, $2, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING
  `, [deadline, userId]);
  console.log('✅ Sample jobs seeded!');

  // Seed Questions
  const q1Id = 'q-1';
  const q2Id = 'q-2';
  const q3Id = 'q-3';

  await client.query(`
    INSERT INTO "Question" (id, "textEn", "textUr", "optionsEn", "optionsUr", "correctIndex", subject, difficulty, "explanationEn", "explanationUr", "createdAt", "updatedAt")
    VALUES 
    ($1, 'Which data structure operates on a Last In First Out (LIFO) basis?', 'کون سا ڈیٹا سٹرکچر LIFO کی بنیاد پر کام کرتا ہے؟', ARRAY['Queue', 'Stack', 'Array', 'Linked List'], ARRAY['کیو', 'سٹیک', 'ارے', 'لنکڈ لسٹ'], 1, 'Computer Science', 'medium', 'A Stack follows LIFO order.', 'سٹیک LIFO آرڈر پر کام کرتا ہے۔', NOW(), NOW()),
    ($2, 'What is the default port for HTTP traffic?', 'ایچ ٹی ٹی پی کا ڈیفالٹ پورٹ کون سا ہے؟', ARRAY['21', '80', '443', '8080'], ARRAY['21', '80', '443', '8080'], 1, 'Computer Science', 'easy', 'Port 80 is the standard port for HTTP.', 'پورٹ 80 ایچ ٹی ٹی پی کے لیے ہوتا ہے۔', NOW(), NOW()),
    ($3, 'When did Pakistan adopt its first constitution?', 'پاکستان نے اپنا پہلا آئین کب نافذ کیا؟', ARRAY['1947', '1956', '1962', '1973'], ARRAY['1947', '1956', '1962', '1973'], 1, 'General Knowledge', 'medium', 'The first constitution was adopted in 1956.', 'پہلا آئین 1956 میں نافذ ہوا۔', NOW(), NOW())
    ON CONFLICT (id) DO NOTHING
  `, [q1Id, q2Id, q3Id]);
  console.log('✅ Sample MCQs seeded!');

  // Seed Quizzes
  const quiz1Id = 'quiz-1';
  await client.query(`
    INSERT INTO "Quiz" (id, "titleEn", "titleUr", subject, "timeLimitMinutes", "passPercentage", "createdAt", "updatedAt")
    VALUES 
    ($1, 'Computer Science Fundamental Screening Test', 'کمپیوٹر سائنس بنیادی ٹیسٹ', 'Computer Science', 15, 50, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING
  `, [quiz1Id]);

  // Connect Quiz Questions
  await client.query(`
    INSERT INTO "_QuizQuestions" ("A", "B")
    VALUES ($1, $2), ($3, $2)
    ON CONFLICT DO NOTHING
  `, [q1Id, quiz1Id, q2Id]);
  console.log('✅ Sample quizzes seeded!');

  await client.end();
  console.log('🎉 Database seeding complete!');
}

seed().catch(console.error);
