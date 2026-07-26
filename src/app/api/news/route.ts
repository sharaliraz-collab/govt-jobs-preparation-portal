import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import News from '@/models/News';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const pinned = searchParams.get('pinned');

    const query: any = {};
    if (category) query.category = category;
    if (pinned === 'true') query.pinned = true;

    if (search) {
      query.$or = [
        { titleEn: { $regex: search, $options: 'i' } },
        { titleUr: { $regex: search, $options: 'i' } },
        { bodyEn: { $regex: search, $options: 'i' } },
        { bodyUr: { $regex: search, $options: 'i' } }
      ];
    }

    const newsList = await News.find(query).sort({ pinned: -1, publishedAt: -1 });
    return NextResponse.json(newsList);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
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

    const news = await News.create({
      titleEn,
      titleUr: titleUr || titleEn,
      bodyEn,
      bodyUr: bodyUr || bodyEn,
      category: category || 'General',
      coverImage: coverImage || '',
      pinned: pinned === 'true' || pinned === true
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
