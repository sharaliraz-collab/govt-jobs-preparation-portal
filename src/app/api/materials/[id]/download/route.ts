import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Material from '@/models/Material';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const material = await Material.findById(params.id);
    if (!material) {
      return NextResponse.json({ message: 'Test material not found.' }, { status: 404 });
    }

    material.downloadCount += 1;
    await material.save();

    return NextResponse.json({ fileUrl: material.file, downloadCount: material.downloadCount });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
