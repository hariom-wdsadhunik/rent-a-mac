import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { slotSchema } from '@/lib/validation';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const slots = await db.advertisingSlot.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        rentals: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    return NextResponse.json({ slots });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN_ADMIN_ONLY') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch admin slots' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();

    const parseResult = slotSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid slot schema parameters', details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const slot = await db.advertisingSlot.create({
      data: parseResult.data,
    });

    await db.adminAction.create({
      data: {
        adminId: admin.userId,
        action: 'CREATE_SLOT',
        targetId: slot.id,
        details: `Created new advertising slot: ${slot.name}`,
      },
    });

    return NextResponse.json({ success: true, slot });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN_ADMIN_ONLY') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('Create slot error:', error);
    return NextResponse.json({ error: 'Failed to create slot' }, { status: 500 });
  }
}
