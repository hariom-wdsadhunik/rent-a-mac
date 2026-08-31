import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-11-20.acacia' as Stripe.LatestApiVersion,
    })
  : null;

export async function createPaymentCheckoutSession(params: {
  rentalId: string;
  slotName: string;
  amount: number;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string; sessionId: string }> {
  if (stripe && stripeSecretKey) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: params.customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Rent-a-Mac Ad Space: ${params.slotName}`,
              description: `Advertising Space Rental (Ref ID: ${params.rentalId})`,
            },
            unit_amount: Math.round(params.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${params.successUrl}?session_id={CHECKOUT_SESSION_ID}&rental_id=${params.rentalId}`,
      cancel_url: params.cancelUrl,
      metadata: {
        rentalId: params.rentalId,
      },
    });

    return {
      url: session.url || params.successUrl,
      sessionId: session.id,
    };
  }

  // Fallback Dev Mock Checkout Session if Stripe keys are omitted in dev
  const mockSessionId = `cs_test_mock_${Date.now()}_${params.rentalId}`;
  const mockSuccessUrl = `${params.successUrl}?session_id=${mockSessionId}&rental_id=${params.rentalId}&mock=true`;

  return {
    url: mockSuccessUrl,
    sessionId: mockSessionId,
  };
}
