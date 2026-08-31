import { PricingBreakdown } from './types';

/**
 * Calculates server-authoritative pricing for rental durations.
 * Rule: 7 Days (Base), 30 Days (15% discount), 90 Days (30% discount)
 */
export function calculateRentalPrice(basePrice7Days: number, durationDays: number): PricingBreakdown {
  if (basePrice7Days <= 0 || durationDays <= 0) {
    throw new Error('Invalid pricing parameters: basePrice and duration must be greater than zero.');
  }

  const dailyBaseRate = basePrice7Days / 7;
  const rawSubtotal = dailyBaseRate * durationDays;

  let discountPercentage = 0;
  if (durationDays >= 90) {
    discountPercentage = 30;
  } else if (durationDays >= 30) {
    discountPercentage = 15;
  }

  const discountAmount = Math.round((rawSubtotal * (discountPercentage / 100)) * 100) / 100;
  const finalPrice = Math.round((rawSubtotal - discountAmount) * 100) / 100;
  const pricePerDay = Math.round((finalPrice / durationDays) * 100) / 100;

  return {
    slotId: '',
    durationDays,
    basePrice7Days,
    discountPercentage,
    discountAmount,
    subtotal: Math.round(rawSubtotal * 100) / 100,
    finalPrice,
    pricePerDay,
  };
}
