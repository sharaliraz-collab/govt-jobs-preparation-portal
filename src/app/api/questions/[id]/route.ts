import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const question = await prisma.question.findUnique({
      where: { id: params.id }
    });
    if (!question) {
      return NextResponse.json({ message: 'Question not found.' }, { status: 404 });
    }
    const questionWithId = { ...question, _id: question.id };
    return NextResponse.json(questionWithId);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const questionExists = await prisma.question.findUnique({
      where: { id: params.id }
    });
    if (!questionExists) {
      return NextResponse.json({ message: 'Question not found.' }, { status: 404 });
    }

    const body = await req.json();
    const fields = [
      'textEn', 'textUr', 'optionsEn', 'optionsUr', 'correctIndex',
      'subject', 'difficulty', 'explanationEn', 'explanationUr'
    ];

    const updateData: any = {};
    fields.forEach((field) => {
      if (body[field] !== undefined) {
        if (field === 'correctIndex') updateData.correctIndex = parseInt(body.correctIndex, 10);
        else updateData[field] = body[field];
      }
    });

    const updatedQuestion = await prisma.question.update({
      where: { id: params.id },
      data: updateData
    });

    const questionWithId = { ...updatedQuestion, _id: updatedQuestion.id };
    return NextResponse.json(questionWithId);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const questionExists = await prisma.question.findUnique({
      where: { id: params.id }
    });
    if (!questionExists) {
      return NextResponse.json({ message: 'Question not found.' }, { status: 404 });
    }

    await prisma.question.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ message: 'Question deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
