import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Configure Cloudinary SDK
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
    secure: true,
  });
} else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const hasCloudinary =
      Boolean(process.env.CLOUDINARY_URL) ||
      Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

    // 1. Primary Option: Cloudinary Official SDK Upload (Permanent 25GB Cloud Storage)
    if (hasCloudinary) {
      try {
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'govt_jobs_portal',
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });

        if (result && result.secure_url) {
          return NextResponse.json(
            { url: result.secure_url, filename: file.name, size: file.size, provider: 'cloudinary' },
            { status: 201 }
          );
        }
      } catch (cloudErr: any) {
        console.warn('Cloudinary SDK upload failed, attempting fallbacks:', cloudErr?.message || cloudErr);
      }
    }

    // 2. Local Disk Storage (for local environment)
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
        { url: fileUrl, filename, size: file.size, provider: 'local' },
        { status: 201 }
      );
    } catch (fsError: any) {
      // 3. Fallback: Base64 Data URL
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
        { url: dataUrl, filename, size: file.size, provider: 'data-url' },
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
