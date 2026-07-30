import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const search = searchParams.get('search');
    const relatedCategory = searchParams.get('relatedCategory');

    const where: any = {};

    if (subject) where.subject = { contains: subject, mode: 'insensitive' };
    if (relatedCategory) where.relatedCategory = { contains: relatedCategory, mode: 'insensitive' };

    if (search) {
      where.OR = [
        { titleEn: { contains: search, mode: 'insensitive' } },
        { titleUr: { contains: search, mode: 'insensitive' } },
        { descriptionEn: { contains: search, mode: 'insensitive' } },
        { descriptionUr: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } }
      ];
    }

    const materials = await prisma.material.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const result = materials.map(m => ({ ...m, _id: m.id }));
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
    const { titleEn, titleUr, subject, descriptionEn, descriptionUr, file, relatedCategory } = body;

    if (!titleEn || !subject) {
      return NextResponse.json({ message: 'Please provide a title and subject.' }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ message: 'Please upload a PDF/Document file.' }, { status: 400 });
    }

    const material = await prisma.material.create({
      data: {
        titleEn,
        titleUr: titleUr || titleEn,
        subject,
        descriptionEn: descriptionEn || '',
        descriptionUr: descriptionUr || descriptionEn || '',
        file,
        relatedCategory
      }
    });

    const result = { ...material, _id: material.id };
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
