import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = {};
    if (category) where.category = category;

    if (search) {
      where.OR = [
        { titleEn: { contains: search, mode: 'insensitive' } },
        { titleUr: { contains: search, mode: 'insensitive' } },
        { descriptionEn: { contains: search, mode: 'insensitive' } },
        { descriptionUr: { contains: search, mode: 'insensitive' } },
        { relatedTo: { contains: search, mode: 'insensitive' } }
      ];
    }

    const forms = await prisma.formDoc.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(forms.map(f => ({ ...f, _id: f.id })));
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
    const { titleEn, titleUr, descriptionEn, descriptionUr, category, file, relatedTo } = body;

    if (!titleEn) {
      return NextResponse.json({ message: 'Please provide a title.' }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ message: 'Please upload a PDF/Document form file.' }, { status: 400 });
    }

    const form = await prisma.formDoc.create({
      data: {
        titleEn,
        titleUr: titleUr || titleEn,
        descriptionEn: descriptionEn || '',
        descriptionUr: descriptionUr || descriptionEn || '',
        category: category || 'Application',
        file,
        relatedTo
      }
    });

    return NextResponse.json({ ...form, _id: form.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
