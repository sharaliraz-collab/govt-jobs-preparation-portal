import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Material from '@/models/Material';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const search = searchParams.get('search');
    const relatedCategory = searchParams.get('relatedCategory');

    const query: any = {};

    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (relatedCategory) query.relatedCategory = { $regex: relatedCategory, $options: 'i' };

    if (search) {
      query.$or = [
        { titleEn: { $regex: search, $options: 'i' } },
        { titleUr: { $regex: search, $options: 'i' } },
        { descriptionEn: { $regex: search, $options: 'i' } },
        { descriptionUr: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const materials = await Material.find(query).sort({ createdAt: -1 });
    return NextResponse.json(materials);
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
    const { titleEn, titleUr, subject, descriptionEn, descriptionUr, file, relatedCategory } = body;

    if (!titleEn || !subject) {
      return NextResponse.json({ message: 'Please provide a title and subject.' }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ message: 'Please upload a PDF/Document file.' }, { status: 400 });
    }

    const material = await Material.create({
      titleEn,
      titleUr: titleUr || titleEn,
      subject,
      descriptionEn: descriptionEn || '',
      descriptionUr: descriptionUr || descriptionEn || '',
      file,
      relatedCategory
    });

    return NextResponse.json(material, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
