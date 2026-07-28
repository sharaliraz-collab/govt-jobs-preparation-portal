import connectDB from '@/lib/db';
import Job from '@/models/Job';
import NewsDoc from '@/models/News';
import QuizDoc from '@/models/Quiz';

const calculateJobStatus = (deadline: Date | string) => {
  const diffDays = (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return 'closed';
  if (diffDays <= 3) return 'closing_soon';
  return 'open';
};

export async function getJobById(id: string) {
  await connectDB();
  const job = await Job.findById(id).lean();
  if (!job) return null;
  return JSON.parse(JSON.stringify(job));
}

export async function getNewsById(id: string) {
  await connectDB();
  const article = await NewsDoc.findById(id).lean();
  if (!article) return null;
  return JSON.parse(JSON.stringify(article));
}

export async function getQuizById(id: string) {
  await connectDB();
  const quiz = await QuizDoc.findById(id)
    .populate('questions', 'textEn textUr optionsEn optionsUr')
    .lean();
  if (!quiz) return null;

  const sanitized = JSON.parse(JSON.stringify(quiz));
  if (sanitized.questions) {
    sanitized.questions = sanitized.questions.map((q: Record<string, unknown>) => {
      const { correctIndex, explanationEn, explanationUr, ...rest } = q;
      return rest;
    });
  }
  return sanitized;
}

export { calculateJobStatus };
