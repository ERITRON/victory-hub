/**
 * GET  /api/sync  -> returns the signed-in user's saved app state (or null if none yet)
 * PUT  /api/sync  -> upserts the signed-in user's app state
 *
 * The entire syncable slice of the Zustand store is stored as a single JSON
 * blob per user, mirroring what used to live only in browser localStorage.
 */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function getUserId() {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  return id ?? null;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const record = await prisma.appData.findUnique({ where: { userId } });
  if (!record) return NextResponse.json({ data: null });

  try {
    return NextResponse.json({ data: JSON.parse(record.data), updatedAt: record.updatedAt });
  } catch {
    return NextResponse.json({ data: null });
  }
}

export async function PUT(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { data?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const dataStr = JSON.stringify(body.data ?? {});

  const record = await prisma.appData.upsert({
    where: { userId },
    update: { data: dataStr },
    create: { userId, data: dataStr },
  });

  return NextResponse.json({ ok: true, updatedAt: record.updatedAt });
}
