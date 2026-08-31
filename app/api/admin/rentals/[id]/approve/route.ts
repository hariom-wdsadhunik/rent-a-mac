import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin(req);
    const rentalId = params.id;

    const rental = await db.rental.findUnique({
      where: { id: rentalId },
      include: { slot: true },
    });

    if (!rental) {
      return NextResponse.json({ error: 'Rental record not found' }, { status: 404 });
    }

    // Transition status to ACTIVE
    const updatedRental = await db.rental.update({
      where: { id: rentalId },
      data: {
        status: 'ACTIVE',
      },
    });

    // Update slot status to OCCUPIED
    await db.advertisingSlot.update({
      where: { id: rental.slotId },
      data: {
        status: 'OCCUPIED',
      },
    });

    // Log admin audit action
    await db.adminAction.create({
      data: {
        adminId: admin.userId,
        action: 'APPROVE_RENTAL',
        targetId: rentalId,
        details: `Approved advertisement for slot ${rental.slot.name}`,
      },
    });

    return NextResponse.json({ success: true, rental: updatedRental });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN_ADMIN_ONLY') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }
    console.error('Approve rental error:', error);
    return NextResponse.json({ error: 'Failed to approve rental' }, { status: 500 });
  }
}
