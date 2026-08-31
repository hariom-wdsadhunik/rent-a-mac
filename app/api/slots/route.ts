import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
          },
          include: {
            advertisement: true,
          },
          take: 1,
        },
      },
    });

    const formattedSlots = slots.map((slot) => {
      const activeRental = slot.rentals[0];
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
        status: activeRental ? 'OCCUPIED' : slot.status,
        activeAd: activeRental && activeRental.advertisement
          ? {
              title: activeRental.advertisement.title,
              brandName: activeRental.advertisement.brandName,
              targetUrl: activeRental.advertisement.targetUrl,
              imageUrl: activeRental.advertisement.imageUrl,
              endDate: activeRental.endDate.toISOString().split('T')[0],
            }
          : null,
      };
    });

    return NextResponse.json({ slots: formattedSlots });
  } catch (error) {
    console.error('Error fetching inventory slots:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory slots' }, { status: 500 });
  }
}
