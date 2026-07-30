import { prisma } from '@/lib/prisma';

const calculateJobStatus = (deadline: Date | string) => {
  const diffDays = (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return 'closed';
  if (diffDays <= 3) return 'closing_soon';
  return 'open';
};

const toISO = (v: Date | string | null | undefined): string =>
  v ? (v instanceof Date ? v.toISOString() : v) : '';

export async function getJobById(id: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id },
      include: { postedBy: { select: { id: true, name: true, email: true } } },
    });
    if (!job) return null;
    return {
      ...job,
      _id: job.id,
      deadline: toISO(job.deadline),
      createdAt: toISO(job.createdAt),
      updatedAt: toISO(job.updatedAt),
      postedBy: job.postedBy ? { ...job.postedBy, _id: job.postedBy.id } : null,
    };
  } catch (e) {
    return null;
  }
}

export async function getNewsById(id: string) {
  try {
    const article = await prisma.news.findUnique({ where: { id } });
    if (!article) return null;
    return {
      ...article,
      _id: article.id,
      publishedAt: toISO(article.publishedAt),
      createdAt: toISO(article.createdAt),
      updatedAt: toISO(article.updatedAt),
    };
  } catch (e) {
    return null;
  }
}

export async function getQuizById(id: string) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          select: {
            id: true,
            textEn: true,
            textUr: true,
            optionsEn: true,
            optionsUr: true,
          },
        },
      },
    });
    if (!quiz) return null;

    const sanitizedQuestions = quiz.questions.map((q) => ({
      ...q,
      _id: q.id,
    }));

    return {
      ...quiz,
      _id: quiz.id,
      createdAt: toISO(quiz.createdAt),
      updatedAt: toISO(quiz.updatedAt),
      questions: sanitizedQuestions,
    };
  } catch (e) {
    return null;
  }
}

export { calculateJobStatus };
