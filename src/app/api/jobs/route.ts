import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Job from '@/models/Job';
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
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');

    const query: any = {};

    if (category) query.category = { $regex: category, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (status) query.status = status;
    if (featured === 'true') query.featured = true;

    if (search) {
      query.$or = [
        { titleEn: { $regex: search, $options: 'i' } },
        { titleUr: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { descriptionEn: { $regex: search, $options: 'i' } },
        { descriptionUr: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    const updatedJobs = await Promise.all(
      jobs.map(async (job) => {
        const computedStatus = calculateStatus(job.deadline);
        if (job.status !== computedStatus) {
          job.status = computedStatus;
          await job.save();
        }
        return job;
      })
    );

    return NextResponse.json(updatedJobs);
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

    const initialStatus = calculateStatus(deadline);

    const job = await Job.create({
      titleEn,
      titleUr: titleUr || titleEn,
      department,
      descriptionEn: descriptionEn || '',
      descriptionUr: descriptionUr || descriptionEn || '',
      location: location || 'Islamabad',
      category: category || 'General',
      qualification: qualification || 'Bachelor',
      vacancies: vacancies ? parseInt(vacancies, 10) : 1,
      deadline,
      adFile: adFile || '',
      source,
      status: initialStatus,
      featured: featured === true || featured === 'true',
      postedBy: authUser._id
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
