import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    const MAX_SIZE = 25 * 1024 * 1024; // 25MB limit
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { message: 'File too large. Maximum size is 25MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
    const publicDir = path.resolve(process.cwd(), 'public');

    fs.mkdirSync(publicDir, { recursive: true });
    fs.mkdirSync(uploadsDir, { recursive: true });

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}_${safeName}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json(
      { url: fileUrl, filename, size: file.size },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Upload failed:', error);
    return NextResponse.json(
      { message: error?.message || 'File upload failed. Please try again.' },
      { status: 500 }
    );
  }
}
