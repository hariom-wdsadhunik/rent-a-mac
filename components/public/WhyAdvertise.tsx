'use client';

import React from 'react';
import { Target, Monitor, ShieldCheck, Eye, Sparkles, TrendingUp } from 'lucide-react';

export function WhyAdvertise() {
  const reasons = [
    {
      icon: Eye,
      title: 'High Visual Impact',
      description: 'Unlike generic banner ads buried in sidebar clutter, your ad renders directly on the internet’s centerpiece MacBook mockup.',
    },
    {
      icon: Target,
      title: 'Tech & Creator Audience',
      description: 'Reach developers, designers, startup founders, and tech enthusiasts visiting our platform daily.',
    },
    {
      icon: ShieldCheck,
      title: 'Guaranteed Brand Safety',
      description: 'Every submitted creative undergoes strict 24-hour admin review before going live, preventing spam or inappropriate content.',
    },
    {
      icon: Monitor,
      title: 'Responsive Cross-Device Presentation',
      description: 'Optimized MacBook layout on desktop screens and a dedicated responsive inventory view for mobile visitors.',
    },
    {
      icon: TrendingUp,
      title: 'Transparent Pricing & Discounts',
      description: 'Fixed server-side pricing with automatic 15% and 30% duration discounts for longer campaigns.',
    },
    {
      icon: Sparkles,
      title: 'Self-Serve Dashboard',
      description: 'Track your active rentals, view start/end dates, and update your ad target URL or creative whenever needed.',
    },
  ];

  return (
    <section className="py-16 border-t border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Value Proposition</h2>
          <h3 className="text-3xl font-black text-white sm:text-4xl">Why Advertise on Rent-a-Mac</h3>
          <p className="text-gray-400 text-sm mt-3">
            A premium digital billboard built specifically for modern internet brands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.title}
                className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-gray-700 transition-all"
              >
                <div className="p-3 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 w-fit mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">{r.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{r.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
