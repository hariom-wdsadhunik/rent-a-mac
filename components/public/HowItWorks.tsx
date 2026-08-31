'use client';

import React from 'react';
import { MousePointerClick, ImagePlus, CreditCard, MonitorCheck } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: MousePointerClick,
      step: '01',
      title: 'Select Advertising Slot',
      description: 'Choose your desired placement on the virtual MacBook — center screen, top notch bar, macOS dock, or trackpad area.',
    },
    {
      icon: ImagePlus,
      step: '02',
      title: 'Upload Creative & Details',
      description: 'Provide your brand name, target website URL, headline, and high-resolution ad logo or banner image.',
    },
    {
      icon: CreditCard,
      step: '03',
      title: 'Secure Checkout',
      description: 'Select your duration (7, 30, or 90 days) with automatic server-side duration discounts and pay via Stripe.',
    },
    {
      icon: MonitorCheck,
      step: '04',
      title: 'Go Live on MacBook',
      description: 'Upon brief 24-hour moderation approval, your advertisement displays live on the internet’s MacBook for thousands of daily visitors.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 border-t border-gray-800/80 bg-gray-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Simple 4-Step Process</h2>
          <h3 className="text-3xl font-black text-white sm:text-4xl">How Rent-a-Mac Works</h3>
          <p className="text-gray-400 text-sm mt-3">From selecting your spot to going live in under 3 minutes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative p-6 rounded-2xl bg-gray-900/60 border border-gray-800/80 hover:border-blue-500/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-gray-700 font-mono group-hover:text-blue-500/50 transition-colors">
                    {s.step}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">{s.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{s.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
