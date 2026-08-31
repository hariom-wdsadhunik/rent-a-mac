import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const payments = await db.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        rental: {
          include: {
            slot: { select: { name: true, slug: true } },
            advertisement: { select: { title: true, brandName: true } },
          },
        },
      },
    });

    const formattedPayments = payments.map((p) => ({
      id: p.id,
      orderId: p.stripeSessionId || `ORD-${p.id.slice(0, 8)}`,
      customerName: p.rental.userName,
      customerEmail: p.rental.userEmail,
      companyName: p.rental.companyName,
      slotName: p.rental.slot.name,
      adTitle: p.rental.advertisement.title,
      amount: p.amount,
      currency: p.currency.toUpperCase(),
      status: p.status,
      provider: p.provider || 'stripe',
      createdAt: p.createdAt,
    }));

    return NextResponse.json({ payments: formattedPayments });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN_ADMIN_ONLY')) {
      return NextResponse.json({ error: 'Unauthorized admin access required' }, { status: 403 });
    }
    console.error('Admin Payments GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch payment records' }, { status: 500 });
  }
}
