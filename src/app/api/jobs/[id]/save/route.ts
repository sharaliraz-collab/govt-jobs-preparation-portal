import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const jobId = params.id;
    const user = await User.findById(authUser._id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isSaved = user.savedJobs.some((id: any) => id.toString() === jobId);

    if (isSaved) {
      user.savedJobs = user.savedJobs.filter((id: any) => id.toString() !== jobId);
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();
    return NextResponse.json({
      message: isSaved ? 'Job removed from saved list.' : 'Job saved successfully.',
      savedJobs: user.savedJobs
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
