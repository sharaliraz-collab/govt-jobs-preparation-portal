import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tab = searchParams.get('tab');
    const where: any = {};
    if (tab) where.tab = tab;

    const posts = await prisma.employeePost.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: [
        { pinned: 'desc' },
        { publishedAt: 'desc' }
      ]
    });

    return NextResponse.json(posts.map(p => ({
      ...p,
      _id: p.id,
      author: p.author ? { ...p.author, _id: p.author.id } : undefined
    })));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const body = await req.json();
    const data: any = {
      titleEn: body.titleEn,
      titleUr: body.titleUr,
      tab: body.tab || 'notifications',
      bodyEn: body.bodyEn,
      bodyUr: body.bodyUr,
      fileUrl: body.fileUrl,
      coverImage: body.coverImage,
      pinned: body.pinned || false,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined
    };

    if (authUser?.id) {
      data.authorId = authUser.id;
    }

    const post = await prisma.employeePost.create({
      data,
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json({
      ...post,
      _id: post.id,
      author: post.author ? { ...post.author, _id: post.author.id } : undefined
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...rest } = body;

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required for update' }, { status: 400 });
    }

    const existing = await prisma.employeePost.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Employee post not found' }, { status: 404 });
    }

    const fields = ['titleEn', 'titleUr', 'tab', 'bodyEn', 'bodyUr', 'fileUrl', 'coverImage', 'pinned', 'publishedAt'];
    const updateData: any = {};

    fields.forEach((field) => {
      if (rest[field] !== undefined) {
        if (field === 'publishedAt') {
          updateData[field] = rest[field] ? new Date(rest[field]) : undefined;
        } else {
          updateData[field] = rest[field];
        }
      }
    });

    const post = await prisma.employeePost.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json({
      ...post,
      _id: post.id,
      author: post.author ? { ...post.author, _id: post.author.id } : undefined
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ message: 'Not authorized as admin' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { searchParams } = new URL(req.url);
    const id = body?.id || searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required for deletion' }, { status: 400 });
    }

    const existing = await prisma.employeePost.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Employee post not found' }, { status: 404 });
    }

    await prisma.employeePost.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Employee post deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
