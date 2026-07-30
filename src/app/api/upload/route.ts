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

    // Vercel serverless functions cap request payload at ~4.5MB
    const MAX_SIZE = 4.5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { message: 'File too large for Vercel upload. Maximum allowed size is 4.5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}_${safeName}`;

    try {
      const publicDir = path.join(process.cwd(), 'public');
      const uploadsDir = path.join(publicDir, 'uploads');

      if (!fs.existsSync(publicDir)) {
        await fs.promises.mkdir(publicDir, { recursive: true });
      }

      if (!fs.existsSync(uploadsDir)) {
        await fs.promises.mkdir(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, filename);
      await fs.promises.writeFile(filePath, buffer);

      const fileUrl = `/uploads/${filename}`;

      return NextResponse.json(
        { url: fileUrl, filename, size: file.size },
        { status: 201 }
      );
    } catch (fsError: any) {
      console.warn('File system write unavailable (Vercel/Serverless environment), using Data URL storage:', fsError);
      
      let mimeType = file.type;
      if (!mimeType) {
        const lowerName = file.name.toLowerCase();
        if (lowerName.endsWith('.pdf')) mimeType = 'application/pdf';
        else if (lowerName.endsWith('.png')) mimeType = 'image/png';
        else if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) mimeType = 'image/jpeg';
        else if (lowerName.endsWith('.webp')) mimeType = 'image/webp';
        else mimeType = 'application/octet-stream';
      }

      const base64Data = buffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64Data}`;

      return NextResponse.json(
        { url: dataUrl, filename, size: file.size },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error('Upload failed:', error);
    return NextResponse.json(
      { message: error?.message || 'File upload failed. Please try again.' },
      { status: 500 }
    );
  }
}
