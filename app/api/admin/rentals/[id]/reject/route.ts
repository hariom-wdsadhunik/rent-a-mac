import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin(req);
    const rentalId = params.id;
    const body = await req.json().catch(() => ({}));
    const reason = body?.reason || 'Violated brand safety guidelines or broken destination URL.';

    const rental = await db.rental.findUnique({
      where: { id: rentalId },
    });

    if (!rental) {
      return NextResponse.json({ error: 'Rental record not found' }, { status: 404 });
    }

    const updatedRental = await db.rental.update({
      where: { id: rentalId },
      data: {
        status: 'REJECTED',
        rejectionReason: reason,
      },
    });

    // Update slot status back to AVAILABLE
    await db.advertisingSlot.update({
      where: { id: rental.slotId },
      data: {
        status: 'AVAILABLE',
      },
    });

    await db.adminAction.create({
      data: {
        adminId: admin.userId,
        action: 'REJECT_RENTAL',
        targetId: rentalId,
        details: `Rejected rental: ${reason}`,
      },
    });

    return NextResponse.json({ success: true, rental: updatedRental });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN_ADMIN_ONLY') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }
    console.error('Reject rental error:', error);
    return NextResponse.json({ error: 'Failed to reject rental' }, { status: 500 });
  }
}
