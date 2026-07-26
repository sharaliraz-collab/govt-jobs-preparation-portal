import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import FormDoc from '@/models/FormDoc';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const form = await FormDoc.findById(params.id);
    if (!form) {
      return NextResponse.json({ message: 'Form document not found.' }, { status: 404 });
    }

    form.downloadCount += 1;
    await form.save();

    return NextResponse.json({ fileUrl: form.file, downloadCount: form.downloadCount });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
