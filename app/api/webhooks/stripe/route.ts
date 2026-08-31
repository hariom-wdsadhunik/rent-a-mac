import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;

  // 1. Signature Verification
  if (stripe && process.env.STRIPE_WEBHOOK_SECRET && signature) {
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error('Stripe webhook signature error:', err?.message);
      return NextResponse.json({ error: `Webhook Error: ${err?.message}` }, { status: 400 });
    }
  } else {
    // In dev mock mode or unconfigured webhook secret mode
    try {
      event = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: 'Invalid webhook payload JSON' }, { status: 400 });
    }
  }

  // 2. Process Event Idempotently
  if (event.type === 'checkout.session.completed' || event.type === 'mock.checkout.completed') {
    const session = event.data?.object || event.session;
    const rentalId = session?.metadata?.rentalId || session?.rentalId;
    const sessionId = session?.id || session?.stripeSessionId;

    if (rentalId || sessionId) {
      const existingPayment = await db.payment.findFirst({
        where: {
          OR: [
            { stripeSessionId: sessionId },
            { rentalId: rentalId },
          ],
        },
        include: { rental: true },
      });

      if (existingPayment && existingPayment.status === 'COMPLETED') {
        // Already processed — return 200 OK (Idempotence)
        return NextResponse.json({ received: true, message: 'Already processed' });
      }

      if (existingPayment) {
        // Update Payment status to COMPLETED
        await db.payment.update({
          where: { id: existingPayment.id },
          data: {
            status: 'COMPLETED',
            stripePaymentIntentId: session?.payment_intent || `pi_completed_${Date.now()}`,
          },
        });

        // Update Rental status to PENDING_REVIEW (Moderation stage)
        await db.rental.update({
          where: { id: existingPayment.rentalId },
          data: {
            status: 'PENDING_REVIEW',
          },
        });

        console.log(`✅ Webhook updated Rental ${existingPayment.rentalId} to PENDING_REVIEW!`);
      }
    }
  }

  return NextResponse.json({ received: true });
}
