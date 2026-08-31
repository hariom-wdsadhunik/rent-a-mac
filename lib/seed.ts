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
    update: { passwordHash, role: 'ADMIN' },
    create: {
      email: adminEmail,
      name: 'System Admin',
      passwordHash,
      role: 'ADMIN',
      company: 'Rent-a-Mac Inc.',
    },
  });

  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Seed Advertising Slots
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
      status: 'AVAILABLE',
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

  // 3. Seed Sample Active Advertisement on Featured Screen Center
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
          userId: admin.id,
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
          stripeSessionId: 'cs_demo_cloudscale_completed',
          stripePaymentIntentId: 'pi_demo_cloudscale_completed',
        },
      });

      console.log('✅ Demo Active Advertisement created for Featured Center Slot!');
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
