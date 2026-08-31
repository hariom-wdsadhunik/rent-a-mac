import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    // Compute metrics
    const totalSlots = await db.advertisingSlot.count();
    const availableSlots = await db.advertisingSlot.count({ where: { status: 'AVAILABLE' } });
    const reservedSlots = await db.advertisingSlot.count({ where: { status: 'RESERVED' } });
    const activeRentals = await db.rental.count({ where: { status: 'ACTIVE' } });
    const pendingApprovals = await db.rental.count({ where: { status: 'PENDING_REVIEW' } });

    // Calculate total revenue from COMPLETED payments
    const payments = await db.payment.findMany({
      where: { status: 'COMPLETED' },
      select: { amount: true },
    });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // Upcoming expirations (active rentals ending within next 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const upcomingExpirations = await db.rental.count({
      where: {
        status: 'ACTIVE',
        endDate: {
          gte: new Date(),
          lte: sevenDaysFromNow,
        },
      },
    });

    // Fetch recent activity actions log
    const recentActivity = await db.adminAction.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        admin: { select: { name: true, email: true } },
      },
    });

    // Recent rentals
    const recentRentals = await db.rental.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        slot: { select: { name: true, slug: true } },
        advertisement: { select: { title: true, brandName: true } },
      },
    });

    return NextResponse.json({
      metrics: {
        totalSlots,
        availableSlots,
        reservedSlots,
        activeRentals,
        pendingApprovals,
        totalRevenue,
        upcomingExpirations,
      },
      recentActivity,
      recentRentals,
    });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN_ADMIN_ONLY')) {
      return NextResponse.json({ error: 'Unauthorized admin access required' }, { status: 403 });
    }
    console.error('Admin Overview Error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin overview metrics' }, { status: 500 });
  }
}
