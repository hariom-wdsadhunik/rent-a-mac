import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const advertisements = await db.advertisement.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        rentals: {
          include: {
            slot: { select: { name: true, slug: true } },
            payment: true,
          },
        },
      },
    });

    return NextResponse.json({ advertisements });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN_ADMIN_ONLY')) {
      return NextResponse.json({ error: 'Unauthorized admin access required' }, { status: 403 });
    }
    console.error('Admin Advertisements GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch advertisements' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Advertisement ID and status are required' }, { status: 400 });
    }

    const updatedAd = await db.advertisement.update({
      where: { id },
      data: {
        status,
        ...(notes !== undefined && { notes }),
      },
    });

    await db.adminAction.create({
      data: {
        adminId: admin.userId,
        action: 'ADVERTISEMENT_STATUS_CHANGED',
        targetId: id,
        details: `Changed advertisement "${updatedAd.title}" status to "${status}".`,
      },
    });

    return NextResponse.json({ advertisement: updatedAd });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN_ADMIN_ONLY')) {
      return NextResponse.json({ error: 'Unauthorized admin access required' }, { status: 403 });
    }
    console.error('Admin Advertisements PATCH Error:', error);
    return NextResponse.json({ error: 'Failed to update advertisement status' }, { status: 500 });
  }
}
