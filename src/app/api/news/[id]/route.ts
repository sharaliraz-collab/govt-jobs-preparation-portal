import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const news = await prisma.news.findUnique({ where: { id } });
    if (!news) {
      return NextResponse.json({ message: 'News article not found.' }, { status: 404 });
    }
    const result = { ...news, _id: news.id };
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: 'News article not found.' }, { status: 404 });
    }

    const body = await req.json();
    const fields = ['titleEn', 'titleUr', 'bodyEn', 'bodyUr', 'category', 'coverImage', 'pinned'];
    const updateData: any = {};

    fields.forEach((field) => {
      if (body[field] !== undefined) {
        if (field === 'pinned') updateData.pinned = body.pinned === 'true' || body.pinned === true;
        else updateData[field] = body[field];
      }
    });

    const updatedNews = await prisma.news.update({
      where: { id },
      data: updateData
    });

    const result = { ...updatedNews, _id: updatedNews.id };
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: 'News article not found.' }, { status: 404 });
    }

    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ message: 'News article deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
