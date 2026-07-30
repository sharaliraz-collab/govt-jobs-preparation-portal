import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const pinned = searchParams.get('pinned');

    const where: any = {};
    if (category) where.category = category;
    if (pinned === 'true') where.pinned = true;

    if (search) {
      where.OR = [
        { titleEn: { contains: search, mode: 'insensitive' } },
        { titleUr: { contains: search, mode: 'insensitive' } },
        { bodyEn: { contains: search, mode: 'insensitive' } },
        { bodyUr: { contains: search, mode: 'insensitive' } }
      ];
    }

    const newsList = await prisma.news.findMany({
      where,
      orderBy: [
        { pinned: 'desc' },
        { publishedAt: 'desc' }
      ]
    });

    const result = newsList.map(news => ({ ...news, _id: news.id }));
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const body = await req.json();
    const { titleEn, titleUr, bodyEn, bodyUr, category, coverImage, pinned } = body;

    if (!titleEn || !bodyEn) {
      return NextResponse.json(
        { message: 'Please provide at least a title and content body.' },
        { status: 400 }
      );
    }

    const news = await prisma.news.create({
      data: {
        titleEn,
        titleUr: titleUr || titleEn,
        bodyEn,
        bodyUr: bodyUr || bodyEn,
        category: category || 'General',
        coverImage: coverImage || '',
        pinned: pinned === 'true' || pinned === true
      }
    });

    const result = { ...news, _id: news.id };
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
