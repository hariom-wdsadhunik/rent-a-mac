'use client';

import React, { useState } from 'react';
import { AdvertisingSlotData } from '@/lib/types';
import { AdSlotOverlay } from './AdSlotOverlay';
import { Apple, Layers, Sparkles } from 'lucide-react';

interface MacBookBackMockupProps {
  slots: AdvertisingSlotData[];
  onSelectSlot: (slot: AdvertisingSlotData) => void;
}

export function MacBookBackMockup({ slots, onSelectSlot }: MacBookBackMockupProps) {
  // Map slots to lid zones
  const topLidSlot = slots.find((s) => s.slug === 'top-notch-bar') || slots[1];
  const centerLidSlot = slots.find((s) => s.slug === 'featured-center') || slots[0];
  const topLeftLidSlot = slots.find((s) => s.slug === 'side-left') || slots[4];
  const topRightLidSlot = slots.find((s) => s.slug === 'side-right') || slots[5];
  const bottomLeftLidSlot = slots.find((s) => s.slug === 'dock-right') || slots[2];
  const bottomRightLidSlot = slots.find((s) => s.slug === 'trackpad-banner') || slots[3];

  return (
    <div className="w-full max-w-4xl mx-auto select-none">
      {/* MACBOOK BACK / OUTER ALUMINUM LID CONTAINER */}
      <div className="relative mx-auto w-full aspect-[16/10] max-w-3xl rounded-[28px] sm:rounded-[36px] bg-gradient-to-b from-gray-800 via-gray-900 to-gray-950 p-4 sm:p-8 border-2 border-gray-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-hidden group">
        
        {/* Metallic Aluminum Sheen & Glare Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none z-10" />

        {/* Top Lid Notch Lip Shadow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 sm:w-36 h-2 bg-gray-950/80 rounded-b-lg border-b border-x border-gray-800 z-20" />

        {/* CENTER EMBOSSED APPLE LOGO */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity">
          <div className="p-4 sm:p-6 rounded-full bg-gradient-to-b from-gray-700 to-gray-900 shadow-2xl border border-gray-600/30">
            <Apple className="w-10 sm:w-16 h-10 sm:h-16 text-gray-300" />
          </div>
        </div>

        {/* TOP LID ZONE (Horizontal Strip) */}
        <div className="relative z-20 w-full max-w-lg mx-auto">
          {topLidSlot && (
            <div className="relative group/slot">
              <AdSlotOverlay slot={topLidSlot} onSelect={onSelectSlot} />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-gray-900/90 border border-gray-700 text-[9px] font-mono text-gray-400 opacity-80 pointer-events-none">
                LID TOP STRIP
              </div>
            </div>
          )}
        </div>

        {/* MIDDLE LID SLOTS GRID (Left Decal, Center Billboard, Right Decal) */}
        <div className="relative z-20 grid grid-cols-12 gap-2 sm:gap-4 items-center my-auto">
          {/* Top Left Lid Decal */}
          <div className="col-span-3">
            {topLeftLidSlot && (
              <div className="relative group/slot">
                <AdSlotOverlay slot={topLeftLidSlot} onSelect={onSelectSlot} />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-gray-900/90 border border-gray-700 text-[8px] font-mono text-gray-400 opacity-80 pointer-events-none whitespace-nowrap">
                  LEFT FLANK
                </div>
              </div>
            )}
          </div>

          {/* Center Lid Primary Billboard */}
          <div className="col-span-6">
            {centerLidSlot && (
              <div className="relative group/slot">
                <AdSlotOverlay slot={centerLidSlot} onSelect={onSelectSlot} />
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-indigo-950/90 border border-indigo-500/50 text-[9px] font-mono font-bold text-indigo-300 shadow-md pointer-events-none">
                  PRIME CENTER BILLBOARD
                </div>
              </div>
            )}
          </div>

          {/* Top Right Lid Decal */}
          <div className="col-span-3">
            {topRightLidSlot && (
              <div className="relative group/slot">
                <AdSlotOverlay slot={topRightLidSlot} onSelect={onSelectSlot} />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-gray-900/90 border border-gray-700 text-[8px] font-mono text-gray-400 opacity-80 pointer-events-none whitespace-nowrap">
                  RIGHT FLANK
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM LID SLOTS (Bottom-Left Badge & Bottom-Right Badge) */}
        <div className="relative z-20 flex items-center justify-between gap-4 pt-2">
          {/* Bottom Left Badge */}
          <div className="w-2/5 max-w-[180px]">
            {bottomLeftLidSlot && (
              <div className="relative group/slot">
                <AdSlotOverlay slot={bottomLeftLidSlot} onSelect={onSelectSlot} />
                <div className="absolute -bottom-3 left-2 px-1.5 py-0.5 rounded bg-gray-900/90 border border-gray-700 text-[8px] font-mono text-gray-400 opacity-80 pointer-events-none">
                  BOTTOM LEFT BADGE
                </div>
              </div>
            )}
          </div>

          {/* Center Hinge Branding */}
          <div className="hidden sm:block text-center font-mono text-[10px] text-gray-500 tracking-widest uppercase">
            MacBook Pro Outer Lid Billboard
          </div>

          {/* Bottom Right Badge */}
          <div className="w-2/5 max-w-[220px]">
            {bottomRightLidSlot && (
              <div className="relative group/slot">
                <AdSlotOverlay slot={bottomRightLidSlot} onSelect={onSelectSlot} />
                <div className="absolute -bottom-3 right-2 px-1.5 py-0.5 rounded bg-gray-900/90 border border-gray-700 text-[8px] font-mono text-gray-400 opacity-80 pointer-events-none">
                  BOTTOM RIGHT PLATE
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MACBOOK HINGE BASE */}
      <div className="h-3 sm:h-4 mx-10 sm:mx-16 bg-gradient-to-b from-gray-900 to-black rounded-b-xl border-t border-gray-800 shadow-xl flex items-center justify-center">
        <span className="text-[9px] text-gray-600 font-mono tracking-widest uppercase">Metallic Anodized Aluminum</span>
      </div>
    </div>
  );
}
