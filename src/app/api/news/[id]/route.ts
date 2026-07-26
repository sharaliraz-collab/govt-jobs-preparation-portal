import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import News from '@/models/News';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const news = await News.findById(params.id);
    if (!news) {
      return NextResponse.json({ message: 'News article not found.' }, { status: 404 });
    }
    return NextResponse.json(news);
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

    const news = await News.findById(params.id);
    if (!news) {
      return NextResponse.json({ message: 'News article not found.' }, { status: 404 });
    }

    const body = await req.json();
    const fields = ['titleEn', 'titleUr', 'bodyEn', 'bodyUr', 'category', 'coverImage', 'pinned'];

    fields.forEach((field) => {
      if (body[field] !== undefined) {
        if (field === 'pinned') news.pinned = body.pinned === 'true' || body.pinned === true;
        else news[field] = body[field];
      }
    });

    const updatedNews = await news.save();
    return NextResponse.json(updatedNews);
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

    const news = await News.findById(params.id);
    if (!news) {
      return NextResponse.json({ message: 'News article not found.' }, { status: 404 });
    }

    await news.deleteOne();
    return NextResponse.json({ message: 'News article deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
