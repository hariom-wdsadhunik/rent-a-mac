'use client';

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, BarChart2 } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-12 pb-8 overflow-hidden">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          The Premier Internet Billboard Marketplace
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1]">
          Rent a spot on the <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
            internet&apos;s MacBook.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-300 font-normal leading-relaxed">
          Put your brand, product, or project in front of everyone who visits. 
          Claim high-visibility screen zones, top bar strips, dock badges, or palm-rest banners with transparent pricing.
        </p>

        {/* CTA Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#macbook-display"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            Rent Your Spot <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#spots-inventory"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-gray-300 hover:text-white bg-gray-900 hover:bg-gray-800 border border-gray-800 transition-all flex items-center justify-center gap-2"
          >
            Explore Available Spots
          </a>
        </div>

        {/* Value Micro-Features */}
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto border-t border-gray-800/80 text-xs text-gray-400">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-blue-400 shrink-0" />
            <span><strong>Instant Reservation</strong> & server-calculated rates</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>24h Moderation</strong> for clean brand safety</span>
          </div>
          <div className="flex items-center gap-2.5">
            <BarChart2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span><strong>Impression Metrics</strong> & live analytics</span>
          </div>
        </div>
      </div>
    </section>
  );
}
