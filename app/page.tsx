import React from 'react';
import { db } from '@/lib/db';
import { Hero } from '@/components/public/Hero';
import { MacBookMockup } from '@/components/macbook/MacBookMockup';
import { VisitorModeBanner } from '@/components/public/VisitorModeBanner';
import { HowItWorks } from '@/components/public/HowItWorks';
import { SlotsGrid } from '@/components/public/SlotsGrid';
import { PricingSection } from '@/components/public/PricingSection';
import { WhyAdvertise } from '@/components/public/WhyAdvertise';
import { FAQ } from '@/components/public/FAQ';
import { AdvertisingSlotData } from '@/lib/types';
import { ArrowRight, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getInventorySlots(): Promise<AdvertisingSlotData[]> {
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

    if (slots.length > 0) {
      return slots.map((slot) => {
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
          status: (activeAd ? 'OCCUPIED' : slot.status) as any,
          activeAd,
        };
      });
    }
  } catch (e) {
    console.error('Failed to query DB inventory, falling back to default slots:', e);
  }

  // Fallback initial slots if DB is unseeded or during static build-time
  return [
    {
      id: 'slot-1',
      name: 'Featured Screen Center',
      slug: 'featured-center',
      description: 'Prime screen real estate right in the center of the MacBook display.',
      position: 'Center Screen',
      gridArea: 'center-screen',
      width: 460,
      height: 240,
      basePrice7Days: 149.00,
      status: 'OCCUPIED',
      activeAd: {
        title: 'CloudScale AI — Automated Infrastructure',
        brandName: 'CloudScale AI',
        targetUrl: 'https://example.com/cloudscale',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        endDate: '2026-09-30',
      },
    },
    {
      id: 'slot-2',
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
      id: 'slot-3',
      name: 'Dock Right Badge',
      slug: 'dock-right',
      description: 'Interactive app icon slot inside the macOS Dock area.',
      position: 'Dock',
      gridArea: 'dock-right',
      width: 140,
      height: 140,
      basePrice7Days: 59.00,
      status: 'AVAILABLE',
    },
    {
      id: 'slot-4',
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
      id: 'slot-5',
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
      id: 'slot-6',
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
}

export default async function HomePage() {
  const slots = await getInventorySlots();

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Mobile Visitor Mode Intent Banner */}
      <VisitorModeBanner />

      {/* 3. Interactive MacBook Showcase Centerpiece */}
      <section id="macbook-display" className="scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto px-4 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Interactive Visual Showcase</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Click Any Advertising Slot To Inspect</h2>
          <p className="text-xs text-gray-400 mt-1">Hover over slots for live availability preview &amp; price tiers</p>
        </div>
        <MacBookMockup slots={slots} />
      </section>

      {/* 4. How It Works */}
      <HowItWorks />

      {/* 5. Complete Inventory Grid (Mobile + Desktop Cards) */}
      <SlotsGrid slots={slots} />

      {/* 6. Pricing & Duration Discounts */}
      <PricingSection />

      {/* 7. Why Advertise Here */}
      <WhyAdvertise />

      {/* 8. FAQ */}
      <FAQ />

      {/* 9. Final CTA Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4" /> Ready to Launch Your Campaign?
          </div>
          <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Claim Your Spot on the Internet&apos;s MacBook
          </h3>
          <p className="max-w-xl mx-auto text-sm text-gray-300">
            Join forward-thinking tech companies, indie developers, and creators displaying their brands to thousands of daily visitors.
          </p>
          <div>
            <a
              href="#macbook-display"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition-all hover:scale-105"
            >
              Rent Your Spot Now <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
