import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import QuizAttempt from '@/models/QuizAttempt';
import Quiz from '@/models/Quiz';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const attempts = await QuizAttempt.find({ user: authUser._id })
      .populate('quiz', 'titleEn titleUr subject passPercentage')
      .sort({ attemptedAt: -1 });

    return NextResponse.json(attempts);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
