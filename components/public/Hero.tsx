'use client';

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, BarChart2, Laptop, Info } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-8 md:pt-12 pb-8 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 text-center space-y-5 md:space-y-6 relative z-10">
        {/* ELEGANT MOBILE VISITOR MODE CALLOUT (<768px) */}
        <div className="block md:hidden">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/90 via-indigo-950/80 to-gray-900 border border-blue-500/40 text-left space-y-2.5 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Laptop className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-white tracking-tight">
                You&apos;re viewing Rent-a-Mac in Visitor Mode.
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Mobile is for exploring. The actual advertising workspace is designed for PC and laptop screens.
            </p>
            <div className="pt-1 text-[11px] font-medium text-blue-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Want to rent a spot? Open Rent-a-Mac on a PC or laptop.</span>
            </div>
          </div>
        </div>

        {/* DESKTOP STATUS PILL (>=768px) */}
        <div className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          The Premier Internet Laptop Lid Billboard Marketplace
        </div>

        {/* Primary Headline */}
        <h1 className="text-3xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1]">
          Rent a spot on the <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
            internet&apos;s MacBook.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="max-w-2xl mx-auto text-xs sm:text-base md:text-lg text-gray-300 font-normal leading-relaxed">
          <span className="block md:hidden">
            Explore Rent-a-Mac on mobile. To choose and rent an advertising spot, open the site on a PC or laptop.
          </span>
          <span className="hidden md:block">
            Put your brand on the back of a virtual MacBook outer lid and let thousands of daily tech enthusiasts discover it. Claim high-visibility center billboards, top lid strips, or corner decals with transparent pricing.
          </span>
        </p>

        {/* MOBILE CTA BUTTON (<768px) */}
        <div className="flex md:hidden flex-col gap-2.5 pt-1 max-w-sm mx-auto">
          <div className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600/90 border border-blue-500/50 shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 text-center">
            <Laptop className="w-4 h-4 shrink-0" /> Open on a PC or laptop to rent
          </div>
        </div>

        {/* DESKTOP CTA BUTTONS (>=768px) */}
        <div className="hidden md:flex flex-row items-center justify-center gap-3 pt-2">
          <a
            href="#macbook-display"
            className="px-8 py-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            Rent Your Spot <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#macbook-display"
            className="px-8 py-4 rounded-xl text-sm font-bold text-gray-300 hover:text-white bg-gray-900 hover:bg-gray-800 border border-gray-800 transition-all flex items-center justify-center gap-2"
          >
            Explore the MacBook
          </a>
        </div>

        {/* Micro Features */}
        <div className="pt-6 md:pt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 text-left max-w-3xl mx-auto border-t border-gray-800/80 text-xs text-gray-400">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-blue-400 shrink-0" />
            <span><strong>Instant Outer Lid Booking</strong> &amp; server rates</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>24h Moderation</strong> for clean brand safety</span>
          </div>
          <div className="flex items-center gap-2.5">
            <BarChart2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span><strong>Impression Metrics</strong> &amp; live analytics</span>
          </div>
        </div>
      </div>
    </section>
  );
}
