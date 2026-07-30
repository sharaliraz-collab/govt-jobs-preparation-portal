import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

let seeded = false;

export async function seedAllData() {
  if (seeded) return;
  seeded = true;

  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@govtjobs.pk').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';
    const adminName = process.env.ADMIN_NAME || 'Portal Administrator';

    let admin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!admin) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);
        admin = await prisma.user.create({
          data: {
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
          },
        });
        console.log('✅ Admin Account Auto-Seeded Successfully');
      } catch (adminErr: any) {
        admin = await prisma.user.findUnique({
          where: { email: adminEmail },
        });
      }
    }

    if (!admin) {
      console.error('Failed to resolve or create admin user for seeding.');
      seeded = false;
      return;
    }

    const adminId = admin.id;

    const jobCount = await prisma.job.count();
    if (jobCount === 0) {
      await prisma.job.createMany({
        data: [
          {
            titleEn: 'Senior Software Engineer (BPS-18)',
            titleUr: 'سینئر سافٹ ویئر انجینئر (بی پی ایس 18)',
            department: 'Ministry of Information Technology & Telecommunication',
            descriptionEn: 'Lead government software portal development teams, oversee cloud infrastructure, and build secure APIs for national public services.',
            descriptionUr: 'سرکاری سافٹ ویئر پورٹل تیار کرنے والی ٹیموں کی قیادت کریں اور قومی عوامی خدمات کے لیے محفوظ APIs بنائیں۔',
            location: 'Islamabad',
            category: 'Information Technology',
            qualification: 'BS / MS in Computer Science, Software Engineering or IT',
            vacancies: 5,
            deadline: new Date(Date.now() + 14 * 86400000),
            source: 'FPSC Gazette 2026',
            status: 'open',
            featured: true,
            postedById: adminId,
          },
          {
            titleEn: 'Assistant Director (BPS-17)',
            titleUr: 'اسسٹنٹ ڈائریکٹر (بی پی ایس 17)',
            department: 'Federal Investigation Agency (FIA)',
            descriptionEn: 'Responsible for public investigation, intelligence collection, counter-cybercrime operations, and federal law enforcement.',
            descriptionUr: 'سائبر کرائم اور وفاقی قانون کی نافذ کرنے کے لیے تحقیقاتی کام۔',
            location: 'Federal / Countrywide',
            category: 'Administration',
            qualification: 'Master degree or 16 Years Education from HEC Recognized University',
            vacancies: 24,
            deadline: new Date(Date.now() + 2 * 86400000),
            source: 'FPSC Advertisement No. 04/2026',
            status: 'closing_soon',
            featured: true,
            postedById: adminId,
          },
          {
            titleEn: 'Lecturer Computer Science (BPS-17)',
            titleUr: 'لیکچرار کمپیوٹر سائنس (بی پی ایس 17)',
            department: 'Higher Education Department (PPSC)',
            descriptionEn: 'Teach undergraduate computer science courses in government degree colleges across Punjab.',
            descriptionUr: 'پنجاب بھر کے سرکاری ڈگری کالجوں میں کمپیوٹر سائنس پڑھائیں۔',
            location: 'Punjab',
            category: 'Education',
            qualification: 'Master degree (1st Division) or BS 4-Years in Computer Science',
            vacancies: 40,
            deadline: new Date(Date.now() + 20 * 86400000),
            source: 'PPSC Advertisement No. 08/2026',
            status: 'open',
            featured: true,
            postedById: adminId,
          },
          {
            titleEn: 'Customs Inspector (BPS-16)',
            titleUr: 'کسٹمز انسپکٹر (بی پی ایس 16)',
            department: 'Federal Board of Revenue (FBR)',
            descriptionEn: 'Inspect import/export consignments, execute anti-smuggling drives, and verify customs duty compliance at international ports.',
            descriptionUr: 'ایف بی آر کے تحت کسٹمز کی جانچ پڑتال اور انسداد سمگلنگ کارروائیاں۔',
            location: 'Karachi / Lahore / Islamabad',
            category: 'Revenue & Taxes',
            qualification: 'Bachelor Degree in Science, Commerce, Economics or Statistics',
            vacancies: 85,
            deadline: new Date(Date.now() + 18 * 86400000),
            source: 'FBR Official Recruitment Portal',
            status: 'open',
            featured: false,
            postedById: adminId,
          },
        ],
      });
      console.log('✅ Seeded Sample Jobs');
    }

    const matCount = await prisma.material.count();
    if (matCount === 0) {
      await prisma.material.createMany({
        data: [
          {
            titleEn: 'FPSC Computer Science Solved Past Papers (2020-2025)',
            titleUr: 'ایف پی ایس سی کمپیوٹر سائنس حل شدہ پاسٹ پیپرز',
            subject: 'Computer Science',
            descriptionEn: 'Comprehensive PDF containing solved MCQs with step-by-step explanations for Lecturer and IT Officer exams.',
            descriptionUr: 'کمپیوٹر سائنس امتحانات کے لیے حل شدہ سوالات کی پی ڈی ایف فائل۔',
            file: '',
            relatedCategory: 'Information Technology',
            downloadCount: 142,
          },
          {
            titleEn: 'Pakistan Affairs & General Knowledge Master Notes 2026',
            titleUr: 'پاکستان افیئرز اور جنرل نالج نوٹس',
            subject: 'General Knowledge',
            descriptionEn: 'Updated history, constitutional amendments, and geography notes for CSS, PMS, and NTS entry screening tests.',
            descriptionUr: 'سی ایس ایس اور این ٹی ایس ٹیسٹ کی تیاری کے لیے عمومی معلومات کے نوٹس۔',
            file: '',
            relatedCategory: 'General Ability',
            downloadCount: 310,
          },
          {
            titleEn: 'English Grammar & Vocabulary Practice Book',
            titleUr: 'انگلش گرامر اور وکیبلری پریکٹس بک',
            subject: 'English',
            descriptionEn: 'Essential guide covering sentence correction, synonyms, antonyms, idioms, and comprehension passages.',
            descriptionUr: 'انگلش گرامر اور وکیبلری بہتر بنانے کی جامع گائیڈ۔',
            file: '',
            relatedCategory: 'General Ability',
            downloadCount: 89,
          },
        ],
      });
      console.log('✅ Seeded Sample Study Materials');
    }

    const qCount = await prisma.question.count();
    if (qCount === 0) {
      const q1 = await prisma.question.create({
        data: {
          textEn: 'Which data structure operates on a Last In First Out (LIFO) basis?',
          textUr: 'کون سا ڈیٹا سٹرکچر LIFO (آخری داخل پہلی بار باہر) کی بنیاد پر کام کرتا ہے؟',
          optionsEn: ['Queue', 'Stack', 'Array', 'Linked List'],
          optionsUr: ['کیو (Queue)', 'سٹیک (Stack)', 'ارے (Array)', 'لنکڈ لسٹ'],
          correctIndex: 1,
          subject: 'Computer Science',
          difficulty: 'medium',
          explanationEn: 'A Stack follows the Last In First Out (LIFO) property where elements are pushed and popped from the top.',
          explanationUr: 'سٹیک میں آخری داخل کردہ ایلیمنٹ سب سے پہلے باہر آتا ہے۔',
        },
      });

      const q2 = await prisma.question.create({
        data: {
          textEn: 'What is the default port for HTTP traffic?',
          textUr: 'ایچ ٹی ٹی پی ٹریفک کے لیے ڈیفالٹ پورٹ کون سا ہے؟',
          optionsEn: ['21', '80', '443', '8080'],
          optionsUr: ['21', '80', '443', '8080'],
          correctIndex: 1,
          subject: 'Computer Science',
          difficulty: 'easy',
          explanationEn: 'Port 80 is standard for HTTP, while port 443 is used for HTTPS.',
          explanationUr: 'پورٹ 80 ایچ ٹی ٹی پی کے لیے استعمال ہوتی ہے اور 443 ایچ ٹی ٹی پی ایس کے لیے۔',
        },
      });

      const q3 = await prisma.question.create({
        data: {
          textEn: 'When did Pakistan adopt its first constitution?',
          textUr: 'پاکستان نے اپنا پہلا آئین کب نافذ کیا؟',
          optionsEn: ['1947', '1956', '1962', '1973'],
          optionsUr: ['1947', '1956', '1962', '1973'],
          correctIndex: 1,
          subject: 'General Knowledge',
          difficulty: 'medium',
          explanationEn: 'The first Constitution of Pakistan was passed on 23rd March 1956.',
          explanationUr: 'پاکستان کا پہلا آئین 23 مارچ 1956 کو منظور ہوا۔',
        },
      });

      const q4 = await prisma.question.create({
        data: {
          textEn: 'Which keyword in JavaScript declares a block-scoped reassignable variable?',
          textUr: 'جاوا سکرپٹ میں کون سا کی ورڈ بلاک اسکوپڈ متغیر ظاہر کرتا ہے؟',
          optionsEn: ['var', 'let', 'const', 'global'],
          optionsUr: ['var', 'let', 'const', 'global'],
          correctIndex: 1,
          subject: 'Computer Science',
          difficulty: 'easy',
          explanationEn: 'The `let` keyword declares block-scoped variables that can be reassigned.',
          explanationUr: '`let` بلاک اسکوپڈ ویری ایبل کو ظاہر کرتا ہے۔',
        },
      });

      console.log('✅ Seeded Sample Questions');

      const quizCount = await prisma.quiz.count();
      if (quizCount === 0) {
        await prisma.quiz.create({
          data: {
            titleEn: 'Computer Science Fundamental Screening Quiz',
            titleUr: 'کمپیوٹر سائنس بنیاد ٹیسٹ',
            subject: 'Computer Science',
            timeLimitMinutes: 10,
            passPercentage: 50,
            questions: {
              connect: [{ id: q1.id }, { id: q2.id }, { id: q4.id }],
            },
          },
        });

        await prisma.quiz.create({
          data: {
            titleEn: 'Pakistan Affairs & General Knowledge Quiz',
            titleUr: 'پاکستان افیئرز اور جنرل نالج کوئز',
            subject: 'General Knowledge',
            timeLimitMinutes: 5,
            passPercentage: 50,
            questions: {
              connect: [{ id: q3.id }],
            },
          },
        });

        console.log('✅ Seeded Sample Quizzes');
      }
    }

    const newsCount = await prisma.news.count();
    if (newsCount === 0) {
      await prisma.news.createMany({
        data: [
          {
            titleEn: 'FPSC Special CSS Examination 2026 Schedule & Guidelines',
            titleUr: 'ایف پی ایس سی خصوصی سی ایس ایس امتحان 2026 کا شیڈول جاری',
            bodyEn: 'The Federal Public Service Commission (FPSC) has announced the detailed examination schedule for CSS Competitive Examination 2026. Online registration starts next Monday.',
            bodyUr: 'ایف پی ایس سی نے سی ایس ایس امتحان 2026 کے لیے شیڈول کا اعلان کر دیا ہے۔ اگلے پیر سے آن لائن رجسٹریشن کا آغاز ہوگا۔',
            category: 'Notification',
            coverImage: '',
            pinned: true,
            publishedAt: new Date(),
          },
          {
            titleEn: 'PPSC Lecturer Recruitment Screening Test Results Announced',
            titleUr: 'پی پی ایس سی لیکچرار ٹیسٹ کے نتائج کا اعلان',
            bodyEn: 'Punjab Public Service Commission has officially published the written examination gazette for lecturer posts. Candidates can check their roll number status.',
            bodyUr: 'پی پی ایس سی نے لیکچرار کی نشستوں کے لیے نتائج کی لسٹ جاری کر دی ہے۔',
            category: 'Result',
            coverImage: '',
            pinned: false,
            publishedAt: new Date(Date.now() - 86400000),
          },
        ],
      });
      console.log('✅ Seeded Sample News');
    }

    const formCount = await prisma.formDoc.count();
    if (formCount === 0) {
      await prisma.formDoc.createMany({
        data: [
          {
            titleEn: 'National Bank Treasury Challan Form (300 PKR Fee)',
            titleUr: 'قومی بینک چالان فارم (300 روپے فیس)',
            descriptionEn: 'Official 4-copy treasury deposit challan form required for FPSC & PPSC fee submissions.',
            descriptionUr: 'سرکاری چالان فارم برائے فیس جمع کروانا (ایف پی ایس سی اور پی پی ایس سی)۔',
            category: 'Application',
            file: '',
            relatedTo: 'General Recruitment Fee',
            downloadCount: 520,
          },
          {
            titleEn: 'Degree & Transcript Attestation Application Form',
            titleUr: 'ڈگری تصدیقی درخواست فارم',
            descriptionEn: 'HEC degree verification and attestation document checklist form for government job applicants.',
            descriptionUr: 'ایچ ای سی ڈگری تصدیقی درخواست فارم۔',
            category: 'Verification',
            file: '',
            relatedTo: 'Academic Qualifications',
            downloadCount: 230,
          },
        ],
      });
      console.log('✅ Seeded Sample Forms');
    }
  } catch (err) {
    console.error('Error during auto-seeding:', err);
    seeded = false;
  }
}

seedAllData()
  .then(() => console.log('🎉 Seed script executed!'))
  .catch(console.error);

