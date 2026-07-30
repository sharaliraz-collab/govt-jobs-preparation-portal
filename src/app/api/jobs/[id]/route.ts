import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

const calculateStatus = (deadline: Date | string) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffDays = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return 'closed';
  if (diffDays <= 3) return 'closing_soon';
  return 'open';
};

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        postedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!job) {
      return NextResponse.json({ message: 'Job posting not found.' }, { status: 404 });
    }

    const computedStatus = calculateStatus(job.deadline) as any;
    if (job.status !== computedStatus) {
      await prisma.job.update({
        where: { id: job.id },
        data: { status: computedStatus }
      });
      job.status = computedStatus;
    }

    const response: any = {
      ...job,
      _id: job.id,
      deadline: job.deadline.toISOString(),
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString()
    };

    if (job.postedBy) {
      response.postedBy = {
        ...job.postedBy,
        _id: job.postedBy.id
      };
    }

    return NextResponse.json(response);
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

    const existingJob = await prisma.job.findUnique({ where: { id } });
    if (!existingJob) {
      return NextResponse.json({ message: 'Job posting not found.' }, { status: 404 });
    }

    const body = await req.json();
    const updateData: any = {};
    const fields = [
      'titleEn', 'titleUr', 'department', 'descriptionEn', 'descriptionUr',
      'location', 'category', 'qualification', 'vacancies', 'deadline',
      'adFile', 'source', 'featured'
    ];

    fields.forEach((field) => {
      if (body[field] !== undefined) {
        if (field === 'vacancies') {
          updateData.vacancies = parseInt(body.vacancies, 10);
        } else if (field === 'featured') {
          updateData.featured = body.featured === 'true' || body.featured === true;
        } else if (field === 'deadline') {
          updateData.deadline = new Date(body.deadline);
        } else {
          updateData[field] = body[field];
        }
      }
    });

    if (body.deadline) {
      updateData.status = calculateStatus(body.deadline) as any;
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      ...updatedJob,
      _id: updatedJob.id,
      deadline: updatedJob.deadline.toISOString(),
      createdAt: updatedJob.createdAt.toISOString(),
      updatedAt: updatedJob.updatedAt.toISOString()
    });
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

    const existingJob = await prisma.job.findUnique({ where: { id } });
    if (!existingJob) {
      return NextResponse.json({ message: 'Job posting not found.' }, { status: 404 });
    }

    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ message: 'Job posting deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
