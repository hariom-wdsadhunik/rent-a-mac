import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    // Fetch slot performance metrics
    const slots = await db.advertisingSlot.findMany({
      orderBy: { clicksCount: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        impressionsCount: true,
        clicksCount: true,
        basePrice7Days: true,
        rentals: {
          where: { status: 'ACTIVE' },
          select: { totalAmount: true },
        },
      },
    });

    const topSlots = slots.map((s) => {
      const ctr = s.impressionsCount > 0 ? ((s.clicksCount / s.impressionsCount) * 100).toFixed(2) : '0.00';
      return {
        id: s.id,
        name: s.name,
        slug: s.slug,
        impressions: s.impressionsCount,
        clicks: s.clicksCount,
        ctr: `${ctr}%`,
        basePrice: s.basePrice7Days,
      };
    });

    // Count totals
    const totalImpressions = slots.reduce((sum, s) => sum + s.impressionsCount, 0);
    const totalClicks = slots.reduce((sum, s) => sum + s.clicksCount, 0);
    const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

    const completedPayments = await db.payment.findMany({
      where: { status: 'COMPLETED' },
      select: { amount: true, createdAt: true },
    });

    const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({
      summary: {
        totalImpressions,
        totalClicks,
        avgCTR: `${avgCTR}%`,
        totalRevenue,
        completedRentalsCount: completedPayments.length,
      },
      topSlots,
    });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN_ADMIN_ONLY')) {
      return NextResponse.json({ error: 'Unauthorized admin access required' }, { status: 403 });
    }
    console.error('Admin Analytics GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
