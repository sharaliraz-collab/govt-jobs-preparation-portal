import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import FormDoc from '@/models/FormDoc';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const query: any = {};
    if (category) query.category = category;

    if (search) {
      query.$or = [
        { titleEn: { $regex: search, $options: 'i' } },
        { titleUr: { $regex: search, $options: 'i' } },
        { descriptionEn: { $regex: search, $options: 'i' } },
        { descriptionUr: { $regex: search, $options: 'i' } },
        { relatedTo: { $regex: search, $options: 'i' } }
      ];
    }

    const forms = await FormDoc.find(query).sort({ createdAt: -1 });
    return NextResponse.json(forms);
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
    const { titleEn, titleUr, descriptionEn, descriptionUr, category, file, relatedTo } = body;

    if (!titleEn) {
      return NextResponse.json({ message: 'Please provide a title.' }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ message: 'Please upload a PDF/Document form file.' }, { status: 400 });
    }

    const form = await FormDoc.create({
      titleEn,
      titleUr: titleUr || titleEn,
      descriptionEn: descriptionEn || '',
      descriptionUr: descriptionUr || descriptionEn || '',
      category: category || 'Application',
      file,
      relatedTo
    });

    return NextResponse.json(form, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
