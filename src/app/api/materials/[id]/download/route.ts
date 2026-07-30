import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const existing = await prisma.material.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: 'Test material not found.' }, { status: 404 });
    }

    const material = await prisma.material.update({
      where: { id },
      data: { downloadCount: { increment: 1 } }
    });

    return NextResponse.json({ fileUrl: material.file, downloadCount: material.downloadCount });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
