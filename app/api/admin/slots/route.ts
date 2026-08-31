import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET all slots with full rental status & history
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const slots = await db.advertisingSlot.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        rentals: {
          orderBy: { createdAt: 'desc' },
          include: {
            advertisement: true,
            payment: true,
          },
        },
      },
    });

    const formattedSlots = slots.map((slot) => {
      const activeRental = slot.rentals.find(
        (r) => r.status === 'ACTIVE' && r.startDate <= new Date() && r.endDate >= new Date()
      );
      const pendingRental = slot.rentals.find((r) => r.status === 'PENDING_REVIEW');

      return {
        ...slot,
        calculatedStatus: activeRental ? 'OCCUPIED' : pendingRental ? 'PENDING' : slot.status,
        activeRental: activeRental || null,
        pendingRental: pendingRental || null,
        totalRentalsCount: slot.rentals.length,
      };
    });

    return NextResponse.json({ slots: formattedSlots });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN_ADMIN_ONLY')) {
      return NextResponse.json({ error: 'Unauthorized admin access required' }, { status: 403 });
    }
    console.error('Admin Slots GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch advertising slots' }, { status: 500 });
  }
}

// POST create new slot
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();

    const { name, slug, description, position, gridArea, width, height, basePrice7Days, status } = body;

    if (!name || !slug || !position || !gridArea || !basePrice7Days) {
      return NextResponse.json({ error: 'Missing required slot fields' }, { status: 400 });
    }

    const existingSlug = await db.advertisingSlot.findUnique({ where: { slug } });
    if (existingSlug) {
      return NextResponse.json({ error: `Slot with slug "${slug}" already exists` }, { status: 400 });
    }

    const newSlot = await db.advertisingSlot.create({
      data: {
        name,
        slug,
        description: description || '',
        position,
        gridArea,
        width: parseInt(String(width || 200), 10),
        height: parseInt(String(height || 100), 10),
        basePrice7Days: parseFloat(String(basePrice7Days)),
        status: status || 'AVAILABLE',
      },
    });

    await db.adminAction.create({
      data: {
        adminId: admin.userId,
        action: 'SLOT_CREATED',
        targetId: newSlot.id,
        details: `Created new slot "${newSlot.name}" ($${newSlot.basePrice7Days}/7d).`,
      },
    });

    return NextResponse.json({ slot: newSlot }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN_ADMIN_ONLY')) {
      return NextResponse.json({ error: 'Unauthorized admin access required' }, { status: 403 });
    }
    console.error('Admin Slots POST Error:', error);
    return NextResponse.json({ error: 'Failed to create advertising slot' }, { status: 500 });
  }
}

// PATCH update existing slot
export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();

    const { id, name, slug, description, position, gridArea, width, height, basePrice7Days, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Slot ID is required' }, { status: 400 });
    }

    const updatedSlot = await db.advertisingSlot.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(position && { position }),
        ...(gridArea && { gridArea }),
        ...(width && { width: parseInt(String(width), 10) }),
        ...(height && { height: parseInt(String(height), 10) }),
        ...(basePrice7Days && { basePrice7Days: parseFloat(String(basePrice7Days)) }),
        ...(status && { status }),
      },
    });

    await db.adminAction.create({
      data: {
        adminId: admin.userId,
        action: 'SLOT_UPDATED',
        targetId: updatedSlot.id,
        details: `Updated slot "${updatedSlot.name}" status to "${updatedSlot.status}".`,
      },
    });

    return NextResponse.json({ slot: updatedSlot });
  } catch (error) {
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN_ADMIN_ONLY')) {
      return NextResponse.json({ error: 'Unauthorized admin access required' }, { status: 403 });
    }
    console.error('Admin Slots PATCH Error:', error);
    return NextResponse.json({ error: 'Failed to update advertising slot' }, { status: 500 });
  }
}
