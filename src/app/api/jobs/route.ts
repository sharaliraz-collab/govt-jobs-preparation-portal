import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const calculateStatus = (deadline: Date | string) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffDays = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return 'closed';
  if (diffDays <= 3) return 'closing_soon';
  return 'open';
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');

    const where: any = {};

    if (category) where.category = { contains: category, mode: 'insensitive' };
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;

    if (search) {
      where.OR = [
        { titleEn: { contains: search, mode: 'insensitive' } },
        { titleUr: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } },
        { descriptionEn: { contains: search, mode: 'insensitive' } },
        { descriptionUr: { contains: search, mode: 'insensitive' } }
      ];
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const updatedJobs = await Promise.all(
      jobs.map(async (job) => {
        const computedStatus = calculateStatus(job.deadline) as any;
        if (job.status !== computedStatus) {
          await prisma.job.update({
            where: { id: job.id },
            data: { status: computedStatus }
          });
        }
        return {
          ...job,
          _id: job.id,
          deadline: job.deadline.toISOString(),
          createdAt: job.createdAt.toISOString(),
          updatedAt: job.updatedAt.toISOString()
        };
      })
    );

    return NextResponse.json(updatedJobs);
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
    const {
      titleEn,
      titleUr,
      department,
      descriptionEn,
      descriptionUr,
      location,
      category,
      qualification,
      vacancies,
      deadline,
      adFile,
      source,
      featured
    } = body;

    if (!titleEn || !department || !deadline) {
      return NextResponse.json(
        { message: 'Please provide at least a title, department, and deadline.' },
        { status: 400 }
      );
    }

    const initialStatus = calculateStatus(deadline) as any;

    const job = await prisma.job.create({
      data: {
        titleEn,
        titleUr: titleUr || titleEn,
        department,
        descriptionEn: descriptionEn || '',
        descriptionUr: descriptionUr || descriptionEn || '',
        location: location || 'Islamabad',
        category: category || 'General',
        qualification: qualification || 'Bachelor',
        vacancies: vacancies ? parseInt(vacancies, 10) : 1,
        deadline: new Date(deadline),
        adFile: adFile || '',
        source: source || null,
        status: initialStatus,
        featured: featured === true || featured === 'true',
        postedById: authUser.id
      }
    });

    return NextResponse.json(
      {
        ...job,
        _id: job.id,
        deadline: job.deadline.toISOString(),
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt.toISOString()
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
