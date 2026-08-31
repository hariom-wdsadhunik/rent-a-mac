import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Rent-a-Mac database...');

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@rent-a-mac.com';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'AdminPassword123!';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: 'ADMIN', status: 'ACTIVE' },
    create: {
      email: adminEmail,
      name: 'System Admin',
      passwordHash,
      role: 'ADMIN',
      company: 'Rent-a-Mac Inc.',
      website: 'https://rent-a-mac.com',
      status: 'ACTIVE',
    },
  });

  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Seed Sample Advertiser User
  const advertiserUser = await prisma.user.upsert({
    where: { email: 'alex@cloudscale.io' },
    update: { status: 'ACTIVE' },
    create: {
      email: 'alex@cloudscale.io',
      name: 'Alex Rivers',
      passwordHash,
      role: 'USER',
      company: 'CloudScale AI Inc.',
      website: 'https://cloudscale.io',
      status: 'ACTIVE',
    },
  });

  // 3. Seed Advertising Slots
  const slots = [
    {
      name: 'Featured Screen Center',
      slug: 'featured-center',
      description: 'Prime screen real estate right in the center of the MacBook display. Maximum visibility for high-impact brand campaigns.',
      position: 'Center Screen',
      gridArea: 'center-screen',
      width: 460,
      height: 240,
      basePrice7Days: 149.00,
      status: 'OCCUPIED',
      impressionsCount: 14200,
      clicksCount: 380,
    },
    {
      name: 'Top Notch Banner',
      slug: 'top-notch-bar',
      description: 'Sleek horizontal advertising strip positioned right below the MacBook camera notch.',
      position: 'Top Bar',
      gridArea: 'top-bar',
      width: 680,
      height: 48,
      basePrice7Days: 99.00,
      status: 'AVAILABLE',
      impressionsCount: 8900,
      clicksCount: 140,
    },
    {
      name: 'Dock Right Badge',
      slug: 'dock-right',
      description: 'Interactive app icon slot inside the macOS Dock area. Great for SaaS tools and mobile apps.',
      position: 'Dock',
      gridArea: 'dock-right',
      width: 140,
      height: 140,
      basePrice7Days: 59.00,
      status: 'PENDING',
      impressionsCount: 5200,
      clicksCount: 95,
    },
    {
      name: 'Keyboard Trackpad Banner',
      slug: 'trackpad-banner',
      description: 'Unique placement on the metallic palm-rest below the keyboard enclosure.',
      position: 'Trackpad Area',
      gridArea: 'trackpad',
      width: 520,
      height: 64,
      basePrice7Days: 79.00,
      status: 'AVAILABLE',
      impressionsCount: 4100,
      clicksCount: 62,
    },
    {
      name: 'Side Display Left',
      slug: 'side-left',
      description: 'Vertical sidebar spot flanking the main content display.',
      position: 'Left Screen Flank',
      gridArea: 'side-left',
      width: 180,
      height: 260,
      basePrice7Days: 89.00,
      status: 'AVAILABLE',
      impressionsCount: 6300,
      clicksCount: 110,
    },
    {
      name: 'Side Display Right',
      slug: 'side-right',
      description: 'Vertical sidebar spot flanking the main content display.',
      position: 'Right Screen Flank',
      gridArea: 'side-right',
      width: 180,
      height: 260,
      basePrice7Days: 89.00,
      status: 'AVAILABLE',
      impressionsCount: 6100,
      clicksCount: 105,
    },
  ];

  const createdSlots: Record<string, string> = {};

  for (const slotData of slots) {
    const slot = await prisma.advertisingSlot.upsert({
      where: { slug: slotData.slug },
      update: slotData,
      create: slotData,
    });
    createdSlots[slot.slug] = slot.id;
    console.log(`✅ Slot created/updated: ${slot.name} ($${slot.basePrice7Days}/7d)`);
  }

  // 4. Seed Active & Approved Demo Rental on Featured Center Slot
  const centerSlotId = createdSlots['featured-center'];
  if (centerSlotId) {
    const existingRental = await prisma.rental.findFirst({
      where: { slotId: centerSlotId, status: 'ACTIVE' },
    });

    if (!existingRental) {
      const ad = await prisma.advertisement.create({
        data: {
          title: 'CloudScale AI — Automated Infrastructure',
          brandName: 'CloudScale AI',
          targetUrl: 'https://example.com/cloudscale',
          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
          altText: 'CloudScale AI Logo & Banner',
          status: 'APPROVED',
        },
      });

      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setDate(today.getDate() + 30);

      const rental = await prisma.rental.create({
        data: {
          userName: 'Alex Rivers',
          userEmail: 'alex@cloudscale.io',
          companyName: 'CloudScale Inc.',
          slotId: centerSlotId,
          advertisementId: ad.id,
          userId: advertiserUser.id,
          durationDays: 30,
          startDate: today,
          endDate: nextMonth,
          totalAmount: 549.00,
          status: 'ACTIVE',
        },
      });

      await prisma.payment.create({
        data: {
          rentalId: rental.id,
          amount: 549.00,
          currency: 'usd',
          status: 'COMPLETED',
          provider: 'stripe',
          stripeSessionId: 'cs_demo_cloudscale_completed',
          stripePaymentIntentId: 'pi_demo_cloudscale_completed',
        },
      });

      await prisma.adminAction.create({
        data: {
          adminId: admin.id,
          action: 'RENTAL_APPROVED',
          targetId: rental.id,
          details: 'Approved active advertisement campaign for CloudScale AI on Featured Center slot.',
        },
      });

      console.log('✅ Demo Active Rental & Payment created!');
    }
  }

  // 5. Seed Pending Approval Demo Rental on Dock Right Slot
  const dockSlotId = createdSlots['dock-right'];
  if (dockSlotId) {
    const existingPending = await prisma.rental.findFirst({
      where: { slotId: dockSlotId, status: 'PENDING_REVIEW' },
    });

    if (!existingPending) {
      const adPending = await prisma.advertisement.create({
        data: {
          title: 'DevPulse — Developer Productivity Analytics',
          brandName: 'DevPulse',
          targetUrl: 'https://example.com/devpulse',
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
          altText: 'DevPulse App Icon',
          status: 'PENDING_REVIEW',
        },
      });

      const today = new Date();
      const endPeriod = new Date();
      endPeriod.setDate(today.getDate() + 14);

      const pendingRental = await prisma.rental.create({
        data: {
          userName: 'Sarah Chen',
          userEmail: 'sarah@devpulse.app',
          companyName: 'DevPulse Labs',
          slotId: dockSlotId,
          advertisementId: adPending.id,
          durationDays: 14,
          startDate: today,
          endDate: endPeriod,
          totalAmount: 118.00,
          status: 'PENDING_REVIEW',
        },
      });

      await prisma.payment.create({
        data: {
          rentalId: pendingRental.id,
          amount: 118.00,
          currency: 'usd',
          status: 'COMPLETED',
          provider: 'stripe',
          stripeSessionId: 'cs_demo_devpulse_pending',
          stripePaymentIntentId: 'pi_demo_devpulse_pending',
        },
      });

      console.log('✅ Demo Pending Review Rental & Payment created!');
    }
  }

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
