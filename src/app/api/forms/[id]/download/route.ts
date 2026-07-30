import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const form = await prisma.formDoc.findUnique({
      where: { id: params.id }
    });
    if (!form) {
      return NextResponse.json({ message: 'Form document not found.' }, { status: 404 });
    }

    const updated = await prisma.formDoc.update({
      where: { id: params.id },
      data: {
        downloadCount: { increment: 1 }
      }
    });

    return NextResponse.json({ fileUrl: updated.file, downloadCount: updated.downloadCount });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
