import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser._id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        savedJobs: {
          include: {
            postedBy: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const formatted = {
      ...user,
      _id: user.id,
      savedJobs: user.savedJobs.map(j => ({
        ...j,
        _id: j.id,
        postedBy: j.postedBy ? { ...j.postedBy, _id: j.postedBy.id } : null,
      })),
    };

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
