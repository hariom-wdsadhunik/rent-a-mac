'use client';

import React from 'react';
import { AdvertisingSlotData } from '@/lib/types';
import { AdSlotOverlay } from './AdSlotOverlay';
import { Apple, Laptop } from 'lucide-react';

interface MacBookBackMockupProps {
  slots: AdvertisingSlotData[];
  onSelectSlot: (slot: AdvertisingSlotData) => void;
}

export function MacBookBackMockup({ slots, onSelectSlot }: MacBookBackMockupProps) {
  // Map slots to lid zones for desktop view
  const topLidSlot = slots.find((s) => s.slug === 'top-notch-bar') || slots[1];
  const centerLidSlot = slots.find((s) => s.slug === 'featured-center') || slots[0];
  const topLeftLidSlot = slots.find((s) => s.slug === 'side-left') || slots[4];
  const topRightLidSlot = slots.find((s) => s.slug === 'side-right') || slots[5];
  const bottomLeftLidSlot = slots.find((s) => s.slug === 'dock-right') || slots[2];
  const bottomRightLidSlot = slots.find((s) => s.slug === 'trackpad-banner') || slots[3];

  return (
    <div className="w-full max-w-4xl mx-auto select-none space-y-6">
      {/* DESKTOP / LARGE TABLET INTERACTIVE MACBOOK BACK LID (>=768px) */}
      <div className="hidden md:flex flex-col items-center">
        <div className="relative mx-auto w-full aspect-[16/10] max-w-3xl rounded-[36px] bg-gradient-to-b from-gray-800 via-gray-900 to-gray-950 p-8 border-2 border-gray-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-hidden group">
          {/* Metallic Aluminum Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none z-10" />

          {/* Top Notch Camera Lip */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-2.5 bg-gray-950/80 rounded-b-lg border-b border-x border-gray-800 z-20" />

          {/* Center Apple Logo Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity">
            <div className="p-6 rounded-full bg-gradient-to-b from-gray-700 to-gray-900 shadow-2xl border border-gray-600/30">
              <Apple className="w-16 h-16 text-gray-300" />
            </div>
          </div>

          {/* Top Lid Zone */}
          <div className="relative z-20 w-full max-w-lg mx-auto">
            {topLidSlot && (
              <div className="relative group/slot">
                <AdSlotOverlay slot={topLidSlot} onSelect={onSelectSlot} />
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-gray-900/90 border border-gray-700 text-[9px] font-mono text-gray-400 opacity-80 pointer-events-none">
                  LID TOP STRIP
                </div>
              </div>
            )}
          </div>

          {/* Middle Lid Slots Grid */}
          <div className="relative z-20 grid grid-cols-12 gap-4 items-center my-auto">
            <div className="col-span-3">
              {topLeftLidSlot && (
                <div className="relative group/slot">
                  <AdSlotOverlay slot={topLeftLidSlot} onSelect={onSelectSlot} />
                  <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-gray-900/90 border border-gray-700 text-[8px] font-mono text-gray-400 opacity-80 pointer-events-none whitespace-nowrap">
                    LEFT FLANK
                  </div>
                </div>
              )}
            </div>

            <div className="col-span-6">
              {centerLidSlot && (
                <div className="relative group/slot">
                  <AdSlotOverlay slot={centerLidSlot} onSelect={onSelectSlot} />
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-indigo-950/90 border border-indigo-500/50 text-[9px] font-mono font-bold text-indigo-300 shadow-md pointer-events-none">
                    PRIME CENTER BILLBOARD
                  </div>
                </div>
              )}
            </div>

            <div className="col-span-3">
              {topRightLidSlot && (
                <div className="relative group/slot">
                  <AdSlotOverlay slot={topRightLidSlot} onSelect={onSelectSlot} />
                  <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-gray-900/90 border border-gray-700 text-[8px] font-mono text-gray-400 opacity-80 pointer-events-none whitespace-nowrap">
                    RIGHT FLANK
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Lid Slots */}
          <div className="relative z-20 flex items-center justify-between gap-4 pt-2">
            <div className="w-2/5 max-w-[180px]">
              {bottomLeftLidSlot && (
                <div className="relative group/slot">
                  <AdSlotOverlay slot={bottomLeftLidSlot} onSelect={onSelectSlot} />
                  <div className="absolute -bottom-3.5 left-2 px-1.5 py-0.5 rounded bg-gray-900/90 border border-gray-700 text-[8px] font-mono text-gray-400 opacity-80 pointer-events-none">
                    BOTTOM LEFT
                  </div>
                </div>
              )}
            </div>

            <div className="text-center font-mono text-[10px] text-gray-500 tracking-widest uppercase">
              MacBook Pro Outer Lid Billboard
            </div>

            <div className="w-2/5 max-w-[220px]">
              {bottomRightLidSlot && (
                <div className="relative group/slot">
                  <AdSlotOverlay slot={bottomRightLidSlot} onSelect={onSelectSlot} />
                  <div className="absolute -bottom-3.5 right-2 px-1.5 py-0.5 rounded bg-gray-900/90 border border-gray-700 text-[8px] font-mono text-gray-400 opacity-80 pointer-events-none">
                    BOTTOM RIGHT
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-4 w-full max-w-2xl bg-gradient-to-b from-gray-900 to-black rounded-b-xl border-t border-gray-800 shadow-xl flex items-center justify-center">
          <span className="text-[9px] text-gray-600 font-mono tracking-widest uppercase">Anodized Space Gray Aluminum</span>
        </div>
      </div>

      {/* MOBILE STATIC PROMOTIONAL CONCEPT VISUAL (<768px) — NON-INTERACTIVE */}
      <div className="block md:hidden">
        <div className="relative w-full rounded-2xl bg-gradient-to-b from-gray-800 via-gray-900 to-gray-950 p-5 border border-gray-700/80 shadow-2xl space-y-3 pointer-events-none overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-800/80 pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-blue-400" /> Rent-a-Mac Concept Preview
            </span>
            <span className="text-[9px] font-mono text-gray-400">Static Visual Only</span>
          </div>

          {/* Static Concept Graphic Showcase */}
          <div className="relative h-48 rounded-xl bg-gray-950 border border-gray-800 p-4 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15">
              <Apple className="w-16 h-16 text-gray-400" />
            </div>

            {/* Static Top Strip Concept */}
            <div className="p-2 rounded-lg bg-blue-950/40 border border-blue-500/30 text-center">
              <span className="text-[9px] font-mono font-bold text-blue-300 block">
                TOP LID STRIP — BRANDING BANNER
              </span>
            </div>

            {/* Static Center Concept */}
            <div className="my-auto p-3 rounded-xl bg-indigo-950/60 border-2 border-indigo-500/50 text-center">
              <span className="text-xs font-black text-white block uppercase tracking-wider">
                PRIME CENTER BILLBOARD
              </span>
              <span className="text-[9px] font-mono text-indigo-300 block">
                High-Visibility Brand Placement
              </span>
            </div>

            {/* Static Bottom Badges Concept */}
            <div className="flex items-center justify-between gap-2 text-[8px] font-mono text-gray-400">
              <div className="w-1/2 p-1.5 rounded bg-gray-900 border border-gray-800 text-center">
                BOTTOM-LEFT DECAL
              </div>
              <div className="w-1/2 p-1.5 rounded bg-gray-900 border border-gray-800 text-center">
                BOTTOM-RIGHT PLATE
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 text-center italic font-mono pt-1">
            Static concept preview. Open Rent-a-Mac on a PC or laptop for interactive slot selection and rental.
          </p>
        </div>
      </div>
    </div>
  );
}
