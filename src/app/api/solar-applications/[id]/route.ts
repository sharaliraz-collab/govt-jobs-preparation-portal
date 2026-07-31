import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const application = await prisma.solarApplication.findUnique({
      where: { id: params.id }
    });
    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }
    return NextResponse.json(application);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const application = await prisma.solarApplication.update({
      where: { id: params.id },
      data: { status: body.status }
    });
    return NextResponse.json(application);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
