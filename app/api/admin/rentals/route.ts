import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where = status && status !== 'ALL' ? { status } : {};

    const rentals = await db.rental.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        slot: true,
        advertisement: true,
        payment: true,
        user: { select: { id: true, name: true, email: true, company: true } },
      },
    });

    return NextResponse.json({ rentals });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN_ADMIN_ONLY')) {
      return NextResponse.json({ error: 'Unauthorized admin access required' }, { status: 403 });
    }
    console.error('Admin Rentals GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch rentals' }, { status: 500 });
  }
}
