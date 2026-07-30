import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const { answers } = await req.json();
    const quizId = params.id;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ message: 'Please provide an array of answers.' }, { status: 400 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true }
    });
    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found.' }, { status: 404 });
    }

    let score = 0;
    const validQuestions = quiz.questions.filter(Boolean);
    const totalQuestions = validQuestions.length;
    const detailedResults: any[] = [];
    const attemptAnswers: any[] = [];

    validQuestions.forEach((question: any) => {
      const userSubmission = answers.find(
        (a: any) => a.questionId === question.id || a.question === question.id
      );

      const selectedIndex =
        userSubmission && typeof userSubmission.selectedIndex === 'number'
          ? userSubmission.selectedIndex
          : -1;

      const isCorrect = selectedIndex === question.correctIndex;
      if (isCorrect) score += 1;

      attemptAnswers.push({
        question: question.id,
        selectedIndex,
        correct: isCorrect
      });

      detailedResults.push({
        questionId: question.id,
        textEn: question.textEn,
        textUr: question.textUr,
        optionsEn: question.optionsEn,
        optionsUr: question.optionsUr,
        selectedIndex,
        correctIndex: question.correctIndex,
        isCorrect,
        explanationEn: question.explanationEn,
        explanationUr: question.explanationUr
      });
    });

    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const passed = percentage >= quiz.passPercentage;

    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        userId: authUser.id,
        quizId: quiz.id,
        score,
        totalQuestions,
        percentage,
        passed,
        answers: attemptAnswers
      }
    });

    return NextResponse.json({
      attemptId: quizAttempt.id,
      quizTitleEn: quiz.titleEn,
      quizTitleUr: quiz.titleUr,
      score,
      totalQuestions,
      percentage,
      passed,
      passPercentage: quiz.passPercentage,
      detailedResults,
      attemptedAt: quizAttempt.attemptedAt
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
