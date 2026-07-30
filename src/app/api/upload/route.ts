import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    let apiKey = process.env.CLOUDINARY_API_KEY;
    let apiSecret = process.env.CLOUDINARY_API_SECRET;

    if ((!cloudName || !apiKey || !apiSecret) && process.env.CLOUDINARY_URL) {
      try {
        // format: cloudinary://<api_key>:<api_secret>@<cloud_name>
        const cleanUrl = process.env.CLOUDINARY_URL.trim();
        const match = cleanUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
        if (match) {
          apiKey = apiKey || match[1];
          apiSecret = apiSecret || match[2];
          cloudName = cloudName || match[3];
        }
      } catch (e) {
        console.warn('Failed parsing CLOUDINARY_URL:', e);
      }
    }

    // 1. Cloudinary Cloud Storage (Free 25 GB Permanent CDN Storage)
    if (cloudName && apiKey && apiSecret) {
      try {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const strToSign = `timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

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
        const dataUri = `data:${mimeType};base64,${base64Data}`;

        const cdnFormData = new FormData();
        cdnFormData.append('file', dataUri);
        cdnFormData.append('api_key', apiKey);
        cdnFormData.append('timestamp', timestamp);
        cdnFormData.append('signature', signature);

        const cdnRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: 'POST',
          body: cdnFormData,
        });

        if (cdnRes.ok) {
          const cdnData = await cdnRes.json();
          return NextResponse.json(
            { url: cdnData.secure_url, filename: file.name, size: file.size, provider: 'cloudinary' },
            { status: 201 }
          );
        }
      } catch (cdnErr) {
        console.warn('Cloudinary upload fallback to local/data-url:', cdnErr);
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
