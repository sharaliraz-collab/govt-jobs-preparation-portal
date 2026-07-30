import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: jobId } = params;
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: { savedJobs: { select: { id: true } } }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isSaved = user.savedJobs.some((job) => job.id === jobId);

    if (isSaved) {
      await prisma.user.update({
        where: { id: authUser.id },
        data: { savedJobs: { disconnect: { id: jobId } } }
      });
    } else {
      await prisma.user.update({
        where: { id: authUser.id },
        data: { savedJobs: { connect: { id: jobId } } }
      });
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: { savedJobs: { select: { id: true } } }
    });

    const savedJobs = updatedUser?.savedJobs.map((job) => job.id) || [];

    return NextResponse.json({
      message: isSaved ? 'Job removed from saved list.' : 'Job saved successfully.',
      savedJobs
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
