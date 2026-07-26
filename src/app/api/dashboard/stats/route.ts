import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Job from '@/models/Job';
import News from '@/models/News';
import Material from '@/models/Material';
import FormDoc from '@/models/FormDoc';
import Question from '@/models/Question';
import Quiz from '@/models/Quiz';
import QuizAttempt from '@/models/QuizAttempt';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const totalJobs = await Job.countDocuments();
    const openJobs = await Job.countDocuments({ status: 'open' });
    const closingSoonJobs = await Job.countDocuments({ status: 'closing_soon' });
    const closedJobs = await Job.countDocuments({ status: 'closed' });

    const totalNews = await News.countDocuments();
    const totalMaterials = await Material.countDocuments();
    const totalForms = await FormDoc.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const quizAttemptsThisWeek = await QuizAttempt.countDocuments({
      attemptedAt: { $gte: sevenDaysAgo }
    });

    const totalQuizAttempts = await QuizAttempt.countDocuments();

    return NextResponse.json({
      jobs: {
        total: totalJobs,
        open: openJobs,
        closingSoon: closingSoonJobs,
        closed: closedJobs
      },
      news: totalNews,
      materials: totalMaterials,
      forms: totalForms,
      questions: totalQuestions,
      quizzes: totalQuizzes,
      quizAttempts: {
        total: totalQuizAttempts,
        thisWeek: quizAttemptsThisWeek
      }
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
