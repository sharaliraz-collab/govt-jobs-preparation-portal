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
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 0, 1), 100) : undefined;

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
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      ...(limit ? { take: limit } : {}),
    });

    const staleByStatus: Record<'open' | 'closing_soon' | 'closed', string[]> = {
      open: [],
      closing_soon: [],
      closed: [],
    };

    const updatedJobs = jobs.map((job) => {
      const computedStatus = calculateStatus(job.deadline);
      if (job.status !== computedStatus) {
        staleByStatus[computedStatus].push(job.id);
      }
      return {
        ...job,
        status: computedStatus,
        _id: job.id,
        deadline: job.deadline.toISOString(),
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt.toISOString(),
      };
    });

    // Batch-sync any expired job statuses in the background without N+1 queries
    const batchUpdates = (['open', 'closing_soon', 'closed'] as const)
      .filter((s) => staleByStatus[s].length > 0)
      .map((s) =>
        prisma.job.updateMany({
          where: { id: { in: staleByStatus[s] } },
          data: { status: s },
        })
      );
    if (batchUpdates.length > 0) {
      Promise.all(batchUpdates).catch((err) =>
        console.error('Background job status sync error:', err)
      );
    }

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
