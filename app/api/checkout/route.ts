import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkoutSchema } from '@/lib/validation';
import { checkSlotAvailability } from '@/lib/availability';
import { calculateRentalPrice } from '@/lib/pricing';
import { createPaymentCheckoutSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Zod Input Validation
    const parseResult = checkoutSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      slotId,
      startDate: startDateStr,
      durationDays,
      userName,
      userEmail,
      companyName,
      adTitle,
      brandName,
      targetUrl,
      imageUrl,
    } = parseResult.data;

    const startDate = new Date(startDateStr);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + durationDays);

    // 2. Server Availability Check
    const availability = await checkSlotAvailability(slotId, startDate, endDate);
    if (!availability.available) {
      return NextResponse.json(
        { error: availability.reason || 'Advertising slot is unavailable for selected dates.' },
        { status: 409 }
      );
    }

    // 3. Slot Query & Server-Side Price Calculation
    const slot = await db.advertisingSlot.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      return NextResponse.json({ error: 'Advertising slot not found.' }, { status: 404 });
    }

    const pricing = calculateRentalPrice(slot.basePrice7Days, durationDays);

    // 4. Create Advertisement Record
    const ad = await db.advertisement.create({
      data: {
        title: adTitle,
        brandName,
        targetUrl,
        imageUrl,
      },
    });

    // 5. Create Rental Record
    const rental = await db.rental.create({
      data: {
        userName,
        userEmail,
        companyName: companyName || null,
        slotId: slot.id,
        advertisementId: ad.id,
        durationDays,
        startDate,
        endDate,
        totalAmount: pricing.finalPrice,
        status: 'PENDING_PAYMENT',
      },
    });

    // 6. Create Stripe/Payment Session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const checkoutSession = await createPaymentCheckoutSession({
      rentalId: rental.id,
      slotName: slot.name,
      amount: pricing.finalPrice,
      customerEmail: userEmail,
      successUrl: `${appUrl}/checkout/success`,
      cancelUrl: `${appUrl}/checkout?slotId=${slot.id}`,
    });

    // 7. Save Payment Record
    await db.payment.create({
      data: {
        rentalId: rental.id,
        amount: pricing.finalPrice,
        currency: 'usd',
        status: 'PENDING',
        stripeSessionId: checkoutSession.sessionId,
      },
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutSession.url,
      rentalId: rental.id,
    });
  } catch (error: any) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Server error creating checkout session' },
      { status: 500 }
    );
  }
}
