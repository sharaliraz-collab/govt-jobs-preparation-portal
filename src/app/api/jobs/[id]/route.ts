import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Job from '@/models/Job';
import User from '@/models/User';
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
    await connectDB();
    const job = await Job.findById(params.id).populate('postedBy', 'name email');
    if (!job) {
      return NextResponse.json({ message: 'Job posting not found.' }, { status: 404 });
    }

    const computedStatus = calculateStatus(job.deadline);
    if (job.status !== computedStatus) {
      job.status = computedStatus;
      await job.save();
    }

    return NextResponse.json(job);
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

    const job = await Job.findById(params.id);
    if (!job) {
      return NextResponse.json({ message: 'Job posting not found.' }, { status: 404 });
    }

    const body = await req.json();
    const fields = [
      'titleEn', 'titleUr', 'department', 'descriptionEn', 'descriptionUr',
      'location', 'category', 'qualification', 'vacancies', 'deadline',
      'adFile', 'source', 'featured'
    ];

    fields.forEach((field) => {
      if (body[field] !== undefined) {
        if (field === 'vacancies') job.vacancies = parseInt(body.vacancies, 10);
        else if (field === 'featured') job.featured = body.featured === 'true' || body.featured === true;
        else job[field] = body[field];
      }
    });

    if (body.deadline) {
      job.status = calculateStatus(body.deadline);
    }

    const updatedJob = await job.save();
    return NextResponse.json(updatedJob);
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

    const job = await Job.findById(params.id);
    if (!job) {
      return NextResponse.json({ message: 'Job posting not found.' }, { status: 404 });
    }

    await job.deleteOne();
    return NextResponse.json({ message: 'Job posting deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
