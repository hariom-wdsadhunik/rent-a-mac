import { db } from './db';

export interface AvailabilityResult {
  available: boolean;
  reason?: string;
  conflictingRentalId?: string;
}

/**
 * Checks whether an advertising slot is available for the given date window.
 * Prevents double-booking and overlapping active/pending rentals.
 */
export async function checkSlotAvailability(
  slotId: string,
  startDate: Date,
  endDate: Date
): Promise<AvailabilityResult> {
  const slot = await db.advertisingSlot.findUnique({
    where: { id: slotId },
  });

  if (!slot) {
    return { available: false, reason: 'Advertising slot does not exist.' };
  }

  if (slot.status === 'DISABLED') {
    return { available: false, reason: 'This advertising slot is currently disabled by administration.' };
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  if (startDate < now) {
    return { available: false, reason: 'Start date cannot be in the past.' };
  }

  if (endDate <= startDate) {
    return { available: false, reason: 'End date must be after the start date.' };
  }

  // Query for overlapping rentals with active or pending status
  const conflictingRental = await db.rental.findFirst({
    where: {
      slotId,
      status: {
        in: ['PAID', 'PENDING_PAYMENT', 'PENDING_REVIEW', 'ACTIVE', 'RESERVED'],
      },
      AND: [
        { startDate: { lte: endDate } },
        { endDate: { gte: startDate } },
      ],
    },
  });

  if (conflictingRental) {
    return {
      available: false,
      reason: `Slot is already reserved or occupied from ${conflictingRental.startDate.toISOString().split('T')[0]} to ${conflictingRental.endDate.toISOString().split('T')[0]}.`,
      conflictingRentalId: conflictingRental.id,
    };
  }

  return { available: true };
}
