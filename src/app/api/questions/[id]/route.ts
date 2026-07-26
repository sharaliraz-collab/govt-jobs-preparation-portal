import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Question from '@/models/Question';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const question = await Question.findById(params.id);
    if (!question) {
      return NextResponse.json({ message: 'Question not found.' }, { status: 404 });
    }
    return NextResponse.json(question);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const question = await Question.findById(params.id);
    if (!question) {
      return NextResponse.json({ message: 'Question not found.' }, { status: 404 });
    }

    const body = await req.json();
    const fields = [
      'textEn', 'textUr', 'optionsEn', 'optionsUr', 'correctIndex',
      'subject', 'difficulty', 'explanationEn', 'explanationUr'
    ];

    fields.forEach((field) => {
      if (body[field] !== undefined) {
        if (field === 'correctIndex') question.correctIndex = parseInt(body.correctIndex, 10);
        else question[field] = body[field];
      }
    });

    const updatedQuestion = await question.save();
    return NextResponse.json(updatedQuestion);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const question = await Question.findById(params.id);
    if (!question) {
      return NextResponse.json({ message: 'Question not found.' }, { status: 404 });
    }

    await question.deleteOne();
    return NextResponse.json({ message: 'Question deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
