import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import FormDoc from '@/models/FormDoc';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const form = await FormDoc.findById(params.id);
    if (!form) {
      return NextResponse.json({ message: 'Form document not found.' }, { status: 404 });
    }
    return NextResponse.json(form);
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

    const form = await FormDoc.findById(params.id);
    if (!form) {
      return NextResponse.json({ message: 'Form document not found.' }, { status: 404 });
    }

    const body = await req.json();
    const fields = ['titleEn', 'titleUr', 'descriptionEn', 'descriptionUr', 'category', 'file', 'relatedTo'];

    fields.forEach((field) => {
      if (body[field] !== undefined) {
        form[field] = body[field];
      }
    });

    const updatedForm = await form.save();
    return NextResponse.json(updatedForm);
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

    const form = await FormDoc.findById(params.id);
    if (!form) {
      return NextResponse.json({ message: 'Form document not found.' }, { status: 404 });
    }

    await form.deleteOne();
    return NextResponse.json({ message: 'Form document deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
