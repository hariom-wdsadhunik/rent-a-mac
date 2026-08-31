import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const slots = await db.advertisingSlot.findMany({
      orderBy: { basePrice7Days: 'desc' },
      include: {
        rentals: {
          where: {
            status: 'ACTIVE',
            startDate: { lte: new Date() },
            endDate: { gte: new Date() },
            advertisement: {
              status: 'APPROVED',
            },
          },
          include: {
            advertisement: true,
            payment: true,
          },
          take: 1,
        },
      },
    });

    const formattedSlots = slots.map((slot) => {
      // If slot is disabled by Admin, hide public ad
      if (slot.status === 'DISABLED') {
        return {
          id: slot.id,
          name: slot.name,
          slug: slot.slug,
          description: slot.description,
          position: slot.position,
          gridArea: slot.gridArea,
          width: slot.width,
          height: slot.height,
          basePrice7Days: slot.basePrice7Days,
          status: 'DISABLED',
          activeAd: null,
        };
      }

      const activeRental = slot.rentals.find(
        (r) => r.payment?.status === 'COMPLETED' || r.payment === null
      );

      const activeAd = activeRental && activeRental.advertisement ? {
        title: activeRental.advertisement.title,
        brandName: activeRental.advertisement.brandName,
        targetUrl: activeRental.advertisement.targetUrl,
        imageUrl: activeRental.advertisement.imageUrl,
        endDate: activeRental.endDate.toISOString().split('T')[0],
      } : null;

      return {
        id: slot.id,
        name: slot.name,
        slug: slot.slug,
        description: slot.description,
        position: slot.position,
        gridArea: slot.gridArea,
        width: slot.width,
        height: slot.height,
        basePrice7Days: slot.basePrice7Days,
        status: activeAd ? 'OCCUPIED' : slot.status,
        activeAd,
      };
    });

    return NextResponse.json({ slots: formattedSlots });
  } catch (error) {
    console.error('Error fetching inventory slots:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory slots' }, { status: 500 });
  }
}
