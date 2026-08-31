import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventType, slotId, advertisementId } = body;

    if (!eventType || (!slotId && !advertisementId)) {
      return NextResponse.json({ error: 'eventType and slotId/advertisementId required' }, { status: 400 });
    }

    // Record analytics event
    await db.analyticsEvent.create({
      data: {
        eventType,
        slotId: slotId || null,
        advertisementId: advertisementId || null,
      },
    });

    // Update slot counters if slotId exists
    if (slotId) {
      if (eventType === 'IMPRESSION') {
        await db.advertisingSlot.update({
          where: { id: slotId },
          data: { impressionsCount: { increment: 1 } },
        });
      } else if (eventType === 'SLOT_CLICK' || eventType === 'AD_CLICK') {
        await db.advertisingSlot.update({
          where: { id: slotId },
          data: { clicksCount: { increment: 1 } },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tracking Error:', error);
    return NextResponse.json({ error: 'Failed to record tracking event' }, { status: 500 });
  }
}
