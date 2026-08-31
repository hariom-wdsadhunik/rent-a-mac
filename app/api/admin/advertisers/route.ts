import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        website: true,
        role: true,
        status: true,
        createdAt: true,
        rentals: {
          select: {
            id: true,
            status: true,
            totalAmount: true,
            payment: { select: { status: true, amount: true } },
          },
        },
      },
    });

    const formattedAdvertisers = users.map((u) => {
      const totalRentals = u.rentals.length;
      const activeRentals = u.rentals.filter((r) => r.status === 'ACTIVE').length;
      const totalSpending = u.rentals
        .filter((r) => r.payment?.status === 'COMPLETED')
        .reduce((sum, r) => sum + r.totalAmount, 0);

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        company: u.company,
        website: u.website,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt,
        totalRentals,
        activeRentals,
        totalSpending,
      };
    });

    return NextResponse.json({ advertisers: formattedAdvertisers });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN_ADMIN_ONLY')) {
      return NextResponse.json({ error: 'Unauthorized admin access required' }, { status: 403 });
    }
    console.error('Admin Advertisers GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch advertisers' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'User ID and status are required' }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: { status },
      select: { id: true, email: true, name: true, status: true },
    });

    await db.adminAction.create({
      data: {
        adminId: admin.userId,
        action: 'ADVERTISER_STATUS_CHANGED',
        targetId: id,
        details: `Changed user account status for "${updatedUser.email}" to "${status}".`,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN_ADMIN_ONLY')) {
      return NextResponse.json({ error: 'Unauthorized admin access required' }, { status: 403 });
    }
    console.error('Admin Advertisers PATCH Error:', error);
    return NextResponse.json({ error: 'Failed to update advertiser status' }, { status: 500 });
  }
}
