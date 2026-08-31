import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    const rentalId = params.id;
    const body = await req.json();
    const { action, reason, extendDays } = body;

    const rental = await db.rental.findUnique({
      where: { id: rentalId },
      include: { slot: true, advertisement: true },
    });

    if (!rental) {
      return NextResponse.json({ error: 'Rental not found' }, { status: 404 });
    }

    if (action === 'approve') {
      // Approve rental and activate advertisement
      await db.rental.update({
        where: { id: rentalId },
        data: { status: 'ACTIVE', rejectionReason: null },
      });

      await db.advertisement.update({
        where: { id: rental.advertisementId },
        data: { status: 'APPROVED' },
      });

      await db.advertisingSlot.update({
        where: { id: rental.slotId },
        data: { status: 'OCCUPIED' },
      });

      await db.adminAction.create({
        data: {
          adminId: admin.userId,
          action: 'RENTAL_APPROVED',
          targetId: rentalId,
          details: `Approved rental #${rentalId} for slot "${rental.slot.name}".`,
        },
      });

      return NextResponse.json({ success: true, message: 'Rental approved successfully' });
    }

    if (action === 'reject') {
      await db.rental.update({
        where: { id: rentalId },
        data: {
          status: 'REJECTED',
          rejectionReason: reason || 'Does not meet guidelines',
        },
      });

      await db.advertisement.update({
        where: { id: rental.advertisementId },
        data: { status: 'REJECTED', notes: reason },
      });

      await db.advertisingSlot.update({
        where: { id: rental.slotId },
        data: { status: 'AVAILABLE' },
      });

      await db.adminAction.create({
        data: {
          adminId: admin.userId,
          action: 'RENTAL_REJECTED',
          targetId: rentalId,
          details: `Rejected rental #${rentalId}. Reason: ${reason || 'Unspecified'}`,
        },
      });

      return NextResponse.json({ success: true, message: 'Rental rejected' });
    }

    if (action === 'suspend') {
      await db.rental.update({
        where: { id: rentalId },
        data: { status: 'SUSPENDED' },
      });

      await db.advertisement.update({
        where: { id: rental.advertisementId },
        data: { status: 'SUSPENDED' },
      });

      await db.advertisingSlot.update({
        where: { id: rental.slotId },
        data: { status: 'AVAILABLE' },
      });

      await db.adminAction.create({
        data: {
          adminId: admin.userId,
          action: 'RENTAL_SUSPENDED',
          targetId: rentalId,
          details: `Suspended rental #${rentalId} for slot "${rental.slot.name}".`,
        },
      });

      return NextResponse.json({ success: true, message: 'Rental suspended' });
    }

    if (action === 'extend') {
      const daysToAdd = parseInt(String(extendDays || 7), 10);
      const newEndDate = new Date(rental.endDate);
      newEndDate.setDate(newEndDate.getDate() + daysToAdd);

      await db.rental.update({
        where: { id: rentalId },
        data: {
          endDate: newEndDate,
          durationDays: rental.durationDays + daysToAdd,
        },
      });

      await db.adminAction.create({
        data: {
          adminId: admin.userId,
          action: 'RENTAL_EXTENDED',
          targetId: rentalId,
          details: `Extended rental #${rentalId} by ${daysToAdd} days until ${newEndDate.toISOString().split('T')[0]}.`,
        },
      });

      return NextResponse.json({ success: true, newEndDate: newEndDate.toISOString() });
    }

    if (action === 'cancel') {
      await db.rental.update({
        where: { id: rentalId },
        data: { status: 'CANCELLED' },
      });

      await db.advertisingSlot.update({
        where: { id: rental.slotId },
        data: { status: 'AVAILABLE' },
      });

      await db.adminAction.create({
        data: {
          adminId: admin.userId,
          action: 'RENTAL_CANCELLED',
          targetId: rentalId,
          details: `Cancelled rental #${rentalId}.`,
        },
      });

      return NextResponse.json({ success: true, message: 'Rental cancelled' });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN_ADMIN_ONLY')) {
      return NextResponse.json({ error: 'Unauthorized admin access required' }, { status: 403 });
    }
    console.error('Admin Rental Action Error:', error);
    return NextResponse.json({ error: 'Failed to process rental action' }, { status: 500 });
  }
}
