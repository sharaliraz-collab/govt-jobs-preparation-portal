import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Material from '@/models/Material';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const material = await Material.findById(params.id);
    if (!material) {
      return NextResponse.json({ message: 'Test material not found.' }, { status: 404 });
    }
    return NextResponse.json(material);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const material = await Material.findById(params.id);
    if (!material) {
      return NextResponse.json({ message: 'Test material not found.' }, { status: 404 });
    }

    const body = await req.json();
    const fields = ['titleEn', 'titleUr', 'subject', 'descriptionEn', 'descriptionUr', 'file', 'relatedCategory'];

    fields.forEach((field) => {
      if (body[field] !== undefined) {
        material[field] = body[field];
      }
    });

    const updatedMaterial = await material.save();
    return NextResponse.json(updatedMaterial);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const material = await Material.findById(params.id);
    if (!material) {
      return NextResponse.json({ message: 'Test material not found.' }, { status: 404 });
    }

    await material.deleteOne();
    return NextResponse.json({ message: 'Test material deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
