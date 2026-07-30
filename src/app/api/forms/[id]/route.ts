import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const form = await prisma.formDoc.findUnique({
      where: { id: params.id }
    });
    if (!form) {
      return NextResponse.json({ message: 'Form document not found.' }, { status: 404 });
    }
    return NextResponse.json({ ...form, _id: form.id });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const existing = await prisma.formDoc.findUnique({
      where: { id: params.id }
    });
    if (!existing) {
      return NextResponse.json({ message: 'Form document not found.' }, { status: 404 });
    }

    const body = await req.json();
    const fields = ['titleEn', 'titleUr', 'descriptionEn', 'descriptionUr', 'category', 'file', 'relatedTo'];
    const data: any = {};

    fields.forEach((field) => {
      if (body[field] !== undefined) {
        data[field] = body[field];
      }
    });

    const updatedForm = await prisma.formDoc.update({
      where: { id: params.id },
      data
    });

    return NextResponse.json({ ...updatedForm, _id: updatedForm.id });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const existing = await prisma.formDoc.findUnique({
      where: { id: params.id }
    });
    if (!existing) {
      return NextResponse.json({ message: 'Form document not found.' }, { status: 404 });
    }

    await prisma.formDoc.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ message: 'Form document deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
