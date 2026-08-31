'use client';

import React, { useState } from 'react';
import { AdvertisingSlotData } from '@/lib/types';
import { AdSlotOverlay } from './AdSlotOverlay';
import { Apple, Layers, Sparkles, Laptop, ShieldCheck } from 'lucide-react';

interface MacBookBackMockupProps {
  slots: AdvertisingSlotData[];
  onSelectSlot: (slot: AdvertisingSlotData) => void;
}

export function MacBookBackMockup({ slots, onSelectSlot }: MacBookBackMockupProps) {
  const [activeMobileSlotId, setActiveMobileSlotId] = useState<string | null>(null);

  // Map slots to lid zones
  const topLidSlot = slots.find((s) => s.slug === 'top-notch-bar') || slots[1];
  const centerLidSlot = slots.find((s) => s.slug === 'featured-center') || slots[0];
  const topLeftLidSlot = slots.find((s) => s.slug === 'side-left') || slots[4];
  const topRightLidSlot = slots.find((s) => s.slug === 'side-right') || slots[5];
  const bottomLeftLidSlot = slots.find((s) => s.slug === 'dock-right') || slots[2];
  const bottomRightLidSlot = slots.find((s) => s.slug === 'trackpad-banner') || slots[3];

  return (
    <div className="w-full max-w-4xl mx-auto select-none space-y-6">
      {/* DESKTOP / LARGE TABLET VIEW COMPOSITION (>=768px) */}
      <div className="hidden md:flex flex-col items-center">
        <div className="relative mx-auto w-full aspect-[16/10] max-w-3xl rounded-[36px] bg-gradient-to-b from-gray-800 via-gray-900 to-gray-950 p-8 border-2 border-gray-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-hidden group">
          {/* Metallic Aluminum Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none z-10" />

          {/* Top Notch Camera Lip */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-2.5 bg-gray-950/80 rounded-b-lg border-b border-x border-gray-800 z-20" />

          {/* Center Apple Logo */}
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

      {/* DEDICATED MOBILE VISITOR COMPOSITION (<768px) */}
      <div className="block md:hidden space-y-4">
        {/* Mobile Visual Aluminum MacBook Lid Showcase Graphic */}
        <div className="relative w-full rounded-2xl bg-gradient-to-b from-gray-800 via-gray-900 to-gray-950 p-4 border border-gray-700/80 shadow-2xl space-y-3 overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-blue-400" /> MacBook Outer Lid Surface
            </span>
            <span className="text-[9px] font-mono text-gray-400">Visitor Preview</span>
          </div>

          {/* Lid Diagram Graphic with Highlighted Active Selection */}
          <div className="relative h-44 rounded-xl bg-gray-950 border border-gray-800/80 p-3 flex flex-col justify-between overflow-hidden">
            {/* Background Apple Logo Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15 pointer-events-none">
              <Apple className="w-14 h-14 text-gray-400" />
            </div>

            {/* Top Lid Bar Indicator */}
            {topLidSlot && (
              <div
                onClick={() => {
                  setActiveMobileSlotId(topLidSlot.id);
                  onSelectSlot(topLidSlot);
                }}
                className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                  activeMobileSlotId === topLidSlot.id
                    ? 'bg-blue-600/30 border-blue-400 text-white'
                    : 'bg-gray-900/80 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <span className="text-[9px] font-mono font-bold block truncate">
                  TOP STRIP: {topLidSlot.name} (${topLidSlot.basePrice7Days}/7d)
                </span>
              </div>
            )}

            {/* Middle Grid Indicators */}
            <div className="grid grid-cols-12 gap-1.5 items-center my-auto">
              <div className="col-span-3">
                {topLeftLidSlot && (
                  <div
                    onClick={() => {
                      setActiveMobileSlotId(topLeftLidSlot.id);
                      onSelectSlot(topLeftLidSlot);
                    }}
                    className={`p-1 rounded-lg border text-center transition-all cursor-pointer ${
                      activeMobileSlotId === topLeftLidSlot.id
                        ? 'bg-blue-600/30 border-blue-400 text-white'
                        : 'bg-gray-900/80 border-gray-800 text-gray-400'
                    }`}
                  >
                    <span className="text-[8px] font-mono block truncate">L-Flank</span>
                  </div>
                )}
              </div>

              <div className="col-span-6">
                {centerLidSlot && (
                  <div
                    onClick={() => {
                      setActiveMobileSlotId(centerLidSlot.id);
                      onSelectSlot(centerLidSlot);
                    }}
                    className={`p-2 rounded-xl border-2 text-center transition-all cursor-pointer ${
                      activeMobileSlotId === centerLidSlot.id
                        ? 'bg-indigo-600/40 border-indigo-400 text-white'
                        : 'bg-indigo-950/60 border-indigo-500/40 text-indigo-200'
                    }`}
                  >
                    <span className="text-[9px] font-bold block truncate">PRIME BILLBOARD</span>
                    <span className="text-[8px] font-mono text-emerald-400 block">${centerLidSlot.basePrice7Days}/7d</span>
                  </div>
                )}
              </div>

              <div className="col-span-3">
                {topRightLidSlot && (
                  <div
                    onClick={() => {
                      setActiveMobileSlotId(topRightLidSlot.id);
                      onSelectSlot(topRightLidSlot);
                    }}
                    className={`p-1 rounded-lg border text-center transition-all cursor-pointer ${
                      activeMobileSlotId === topRightLidSlot.id
                        ? 'bg-blue-600/30 border-blue-400 text-white'
                        : 'bg-gray-900/80 border-gray-800 text-gray-400'
                    }`}
                  >
                    <span className="text-[8px] font-mono block truncate">R-Flank</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Badges Indicators */}
            <div className="flex items-center justify-between gap-2">
              {bottomLeftLidSlot && (
                <div
                  onClick={() => {
                    setActiveMobileSlotId(bottomLeftLidSlot.id);
                    onSelectSlot(bottomLeftLidSlot);
                  }}
                  className={`w-1/2 p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                    activeMobileSlotId === bottomLeftLidSlot.id
                      ? 'bg-blue-600/30 border-blue-400 text-white'
                      : 'bg-gray-900/80 border-gray-800 text-gray-400'
                  }`}
                >
                  <span className="text-[8px] font-mono block truncate">Bottom-L Badge</span>
                </div>
              )}
              {bottomRightLidSlot && (
                <div
                  onClick={() => {
                    setActiveMobileSlotId(bottomRightLidSlot.id);
                    onSelectSlot(bottomRightLidSlot);
                  }}
                  className={`w-1/2 p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                    activeMobileSlotId === bottomRightLidSlot.id
                      ? 'bg-blue-600/30 border-blue-400 text-white'
                      : 'bg-gray-900/80 border-gray-800 text-gray-400'
                  }`}
                >
                  <span className="text-[8px] font-mono block truncate">Bottom-R Plate</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Advertising Slot Navigator Cards */}
        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" /> Mobile Slot Navigator
            </span>
            <span className="text-[10px] text-gray-400 font-mono">Tap slot to inspect details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {slots.map((s) => {
              const isSelected = activeMobileSlotId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveMobileSlotId(s.id);
                    onSelectSlot(s);
                  }}
                  className={`p-3 rounded-xl text-left transition-all space-y-1.5 ${
                    isSelected
                      ? 'bg-blue-950/80 border-2 border-blue-500 text-white shadow-lg'
                      : 'bg-gray-950 border border-gray-800 hover:border-gray-700 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-[11px] truncate">{s.name}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                        s.status === 'OCCUPIED'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span className="font-mono">Zone: {s.position}</span>
                    <span className="font-mono text-emerald-400 font-bold">${s.basePrice7Days}/7d</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
