'use client';

import React from 'react';
import { Check, Sparkles, Shield, Clock } from 'lucide-react';
import Link from 'next/link';

export function PricingSection() {
  const tiers = [
    {
      name: '7-Day Sprint',
      duration: '7 Days',
      discount: 'Standard Base Rate',
      badge: 'Flexible',
      description: 'Ideal for product launches, weekend announcements, or testing campaign conversions.',
      features: [
        '100% Guaranteed Spot Placement',
        '24-Hour Moderation Guarantee',
        'Real-Time Impression Metrics',
        'Direct Website Link Tracking',
        'Standard Ad Creative Updates',
      ],
      popular: false,
    },
    {
      name: '30-Day Campaign',
      duration: '30 Days',
      discount: '15% Duration Discount',
      badge: 'Most Popular',
      description: 'Built for high-growth SaaS, developer tools, and creators seeking sustained brand exposure.',
      features: [
        'Everything in 7-Day Sprint',
        '15% Server-Calculated Savings',
        'Priority Moderation Processing',
        'Unlimited Ad Creative Updates',
        'Featured Spotlight in Advertiser Newsletter',
        'Dedicated Analytics Dashboard',
      ],
      popular: true,
    },
    {
      name: '90-Day Dominance',
      duration: '90 Days',
      discount: '30% Duration Discount',
      badge: 'Maximum Value',
      description: 'Long-term brand presence with maximum savings and permanent advertiser recognition.',
      features: [
        'Everything in 30-Day Campaign',
        '30% Server-Calculated Savings',
        'VIP Admin Concierge Support',
        'Custom Retargeting Pixel Integration',
        'Top Placement Queue Preference',
        'Quarterly Performance Audit',
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-16 border-t border-gray-800/80 bg-gray-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Transparent Pricing</h2>
          <h3 className="text-3xl font-black text-white sm:text-4xl">Duration Discounts & Rates</h3>
          <p className="text-gray-400 text-sm mt-3">
            Prices are calculated automatically on the server based on slot tier and selected duration. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative p-8 rounded-3xl border flex flex-col justify-between transition-all ${
                t.popular
                  ? 'bg-gradient-to-b from-gray-900 to-blue-950/40 border-blue-500/60 shadow-2xl ring-1 ring-blue-500/50 scale-105'
                  : 'bg-gray-900/60 border-gray-800'
              }`}
            >
              {t.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                  {t.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-white">{t.name}</h4>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-800 text-blue-400 border border-gray-700">
                    {t.duration}
                  </span>
                </div>

                <div className="mb-4">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide block">{t.discount}</span>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">{t.description}</p>
                </div>

                <div className="space-y-3 my-6 pt-6 border-t border-gray-800">
                  {t.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-800">
                <a
                  href="#macbook-display"
                  className={`w-full py-3 rounded-xl text-xs font-bold text-center block transition-all ${
                    t.popular
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }`}
                >
                  Choose {t.duration} Option
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
