import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { APTITUDE_TOPICS } from '@/data/aptitudeTopics';

export const dynamic = 'force-dynamic';

function isValidSlug(slug: string) {
  return APTITUDE_TOPICS.some((t) => t.slug === slug);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const slug = params.slug;
    if (!isValidSlug(slug)) {
      return NextResponse.json({ message: 'Unknown aptitude topic' }, { status: 404 });
    }

    const row = await prisma.aptitudeProgress.findUnique({
      where: { userId_topicSlug: { userId: authUser.id, topicSlug: slug } },
    });

    return NextResponse.json({
      topicSlug: slug,
      answers: (row?.answers as Record<string, number>) || {},
      revealed: (row?.revealed as Record<string, boolean>) || {},
      updatedAt: row?.updatedAt || null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const slug = params.slug;
    if (!isValidSlug(slug)) {
      return NextResponse.json({ message: 'Unknown aptitude topic' }, { status: 404 });
    }

    const body = await req.json();
    const answers =
      body.answers && typeof body.answers === 'object' && !Array.isArray(body.answers)
        ? body.answers
        : {};
    const revealed =
      body.revealed && typeof body.revealed === 'object' && !Array.isArray(body.revealed)
        ? body.revealed
        : {};

    const row = await prisma.aptitudeProgress.upsert({
      where: { userId_topicSlug: { userId: authUser.id, topicSlug: slug } },
      create: {
        userId: authUser.id,
        topicSlug: slug,
        answers,
        revealed,
      },
      update: {
        answers,
        revealed,
      },
    });

    return NextResponse.json({
      topicSlug: slug,
      answers: row.answers,
      revealed: row.revealed,
      updatedAt: row.updatedAt,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
