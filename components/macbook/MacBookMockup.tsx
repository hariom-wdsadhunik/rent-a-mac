'use client';

import React, { useState } from 'react';
import { AdvertisingSlotData } from '@/lib/types';
import { AdSlotOverlay } from './AdSlotOverlay';
import { SlotInspectModal } from './SlotInspectModal';
import { MacBookBackMockup } from './MacBookBackMockup';
import { Apple, Wifi, Battery, Search, Command, Layers, Monitor, ShieldAlert } from 'lucide-react';

interface MacBookMockupProps {
  slots: AdvertisingSlotData[];
}

export function MacBookMockup({ slots }: MacBookMockupProps) {
  const [selectedSlot, setSelectedSlot] = useState<AdvertisingSlotData | null>(null);
  const [viewMode, setViewMode] = useState<'BACK' | 'FRONT'>('BACK');

  // Group slots for front screen binding (secondary preview mode)
  const topBarSlot = slots.find((s) => s.slug === 'top-notch-bar') || slots[1];
  const centerSlot = slots.find((s) => s.slug === 'featured-center') || slots[0];
  const leftSlot = slots.find((s) => s.slug === 'side-left') || slots[4];
  const rightSlot = slots.find((s) => s.slug === 'side-right') || slots[5];
  const dockSlot = slots.find((s) => s.slug === 'dock-right') || slots[2];
  const trackpadSlot = slots.find((s) => s.slug === 'trackpad-banner') || slots[3];

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8 select-none overflow-x-hidden space-y-6">
      {/* VIEW MODE TOGGLE BAR: BACK LID (HERO) vs FRONT SCREEN (SECONDARY) */}
      <div className="flex items-center justify-center gap-2">
        <div className="p-1 rounded-2xl bg-gray-900 border border-gray-800 flex items-center gap-1 shadow-lg">
          <button
            onClick={() => setViewMode('BACK')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'BACK'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> MacBook Back Lid (Primary Billboard)
          </button>

          <button
            onClick={() => setViewMode('FRONT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'FRONT'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Screen View (Preview)
          </button>
        </div>
      </div>

      {/* VIEWPORT 1: MACBOOK BACK / OUTER LID (HERO ADVERTISING PRODUCT) */}
      {viewMode === 'BACK' ? (
        <MacBookBackMockup slots={slots} onSelectSlot={setSelectedSlot} />
      ) : (
        /* VIEWPORT 2: SECONDARY FRONT SCREEN PREVIEW MODE */
        <div className="relative mx-auto max-w-4xl">
          {/* MACBOOK DISPLAY (LID) */}
          <div className="macbook-housing relative rounded-t-[20px] sm:rounded-t-[28px] p-2 sm:p-5 pb-3 sm:pb-4 border border-gray-700/60 shadow-2xl">
            {/* Top Notch Camera */}
            <div className="absolute top-1.5 sm:top-2 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-3 sm:h-4 bg-black rounded-b-xl flex items-center justify-center gap-1.5 sm:gap-2 z-40 border-b border-x border-gray-800">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-blue-500/80" />
              </div>
              <div className="w-1 h-1 rounded-full bg-green-500/60" />
            </div>

            {/* INNER SCREEN CONTAINER */}
            <div className="relative w-full aspect-[16/10] bg-mac-screen rounded-lg sm:rounded-xl overflow-hidden border border-gray-950 flex flex-col justify-between shadow-inner">
              {/* Screen Glare Layer */}
              <div className="macbook-screen-glare absolute inset-0 z-20" />

              {/* macOS Menu Bar */}
              <div className="relative z-30 h-6 sm:h-7 bg-black/80 backdrop-blur-md border-b border-white/10 px-2 sm:px-3 flex items-center justify-between text-xs text-gray-300">
                <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px]">
                  <Apple className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" />
                  <span className="font-semibold text-white">Rent-a-Mac</span>
                  <span className="hidden sm:inline hover:text-white cursor-pointer">File</span>
                  <span className="hidden sm:inline hover:text-white cursor-pointer">View</span>
                  <span className="hidden sm:inline hover:text-white cursor-pointer">Window</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-gray-400">
                  <Search className="w-2.5 sm:w-3 h-2.5 sm:h-3 hover:text-white cursor-pointer" />
                  <Wifi className="w-2.5 sm:w-3 h-2.5 sm:h-3 hover:text-white cursor-pointer" />
                  <Battery className="w-3 sm:w-3.5 h-3 sm:h-3.5 hover:text-white cursor-pointer" />
                  <span className="font-mono text-white text-[9px] sm:text-[10px]">10:42 AM</span>
                </div>
              </div>

              {/* MAIN SCREEN CANVAS GRID */}
              <div className="relative flex-1 p-2 sm:p-6 grid grid-cols-12 gap-2 sm:gap-3 z-10 overflow-hidden items-center">
                <div className="col-span-3 hidden md:block">
                  {leftSlot && <AdSlotOverlay slot={leftSlot} onSelect={setSelectedSlot} />}
                </div>

                <div className="col-span-12 md:col-span-6 flex flex-col gap-2 sm:gap-3">
                  {topBarSlot && <AdSlotOverlay slot={topBarSlot} onSelect={setSelectedSlot} />}
                  {centerSlot && <AdSlotOverlay slot={centerSlot} onSelect={setSelectedSlot} />}
                </div>

                <div className="col-span-3 hidden md:block">
                  {rightSlot && <AdSlotOverlay slot={rightSlot} onSelect={setSelectedSlot} />}
                </div>
              </div>

              {/* macOS DOCK */}
              <div className="relative z-30 h-10 sm:h-14 bg-white/5 backdrop-blur-xl border-t border-white/10 px-2 sm:px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                    macOS Dock
                  </span>
                </div>
                <div className="max-w-[140px] sm:max-w-[200px]">
                  {dockSlot && <AdSlotOverlay slot={dockSlot} onSelect={setSelectedSlot} />}
                </div>
              </div>
            </div>
          </div>

          {/* KEYBOARD BASE */}
          <div className="macbook-keyboard-deck relative mx-auto rounded-b-[16px] sm:rounded-b-[24px] p-3 sm:p-6 border border-gray-700/60 shadow-2xl">
            <div className="mt-3 sm:mt-4 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="w-full md:w-2/5 mx-auto">
                {trackpadSlot ? (
                  <AdSlotOverlay slot={trackpadSlot} onSelect={setSelectedSlot} />
                ) : (
                  <div className="h-12 sm:h-16 rounded-xl border border-white/10 bg-black/40 shadow-inner flex items-center justify-center text-xs text-gray-500 font-mono">
                    Force Touch Trackpad
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE SLOT SELECTOR BAR */}
      <div className="block md:hidden mt-6 bg-gray-900/90 border border-gray-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" /> Mobile Lid Slot Navigator
          </span>
          <span className="text-[10px] text-gray-400 font-mono">Tap slot to inspect &amp; rent</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {slots.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSlot(s)}
              className="p-2.5 rounded-xl bg-gray-950 border border-gray-800 hover:border-blue-500 text-left transition-all space-y-1"
            >
              <span className="text-white font-bold block text-[11px] truncate">{s.name}</span>
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-mono text-emerald-400">${s.basePrice7Days}/7d</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                    s.status === 'OCCUPIED' ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {s.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Inspect / Booking Modal */}
      <SlotInspectModal slot={selectedSlot} onClose={() => setSelectedSlot(null)} />
    </div>
  );
}
