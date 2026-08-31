'use client';

import React, { useState } from 'react';
import { AdvertisingSlotData } from '@/lib/types';
import { AdSlotOverlay } from './AdSlotOverlay';
import { SlotInspectModal } from './SlotInspectModal';
import { Apple, Wifi, Battery, Search, Command, Layers } from 'lucide-react';

interface MacBookMockupProps {
  slots: AdvertisingSlotData[];
}

export function MacBookMockup({ slots }: MacBookMockupProps) {
  const [selectedSlot, setSelectedSlot] = useState<AdvertisingSlotData | null>(null);

  // Group slots for screen binding
  const topBarSlot = slots.find((s) => s.slug === 'top-notch-bar') || slots[1];
  const centerSlot = slots.find((s) => s.slug === 'featured-center') || slots[0];
  const leftSlot = slots.find((s) => s.slug === 'side-left') || slots[4];
  const rightSlot = slots.find((s) => s.slug === 'side-right') || slots[5];
  const dockSlot = slots.find((s) => s.slug === 'dock-right') || slots[2];
  const trackpadSlot = slots.find((s) => s.slug === 'trackpad-banner') || slots[3];

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8 select-none overflow-x-hidden">
      {/* MacBook Container */}
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
              {/* Left Flank Slot */}
              <div className="col-span-3 hidden md:block">
                {leftSlot && (
                  <AdSlotOverlay
                    slot={leftSlot}
                    onSelect={setSelectedSlot}
                  />
                )}
              </div>

              {/* Center Screen Area */}
              <div className="col-span-12 md:col-span-6 flex flex-col gap-2 sm:gap-3">
                {topBarSlot && (
                  <AdSlotOverlay
                    slot={topBarSlot}
                    onSelect={setSelectedSlot}
                  />
                )}
                {centerSlot && (
                  <AdSlotOverlay
                    slot={centerSlot}
                    onSelect={setSelectedSlot}
                  />
                )}
              </div>

              {/* Right Flank Slot */}
              <div className="col-span-3 hidden md:block">
                {rightSlot && (
                  <AdSlotOverlay
                    slot={rightSlot}
                    onSelect={setSelectedSlot}
                  />
                )}
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
                {dockSlot && (
                  <AdSlotOverlay
                    slot={dockSlot}
                    onSelect={setSelectedSlot}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MACBOOK HINGE */}
        <div className="macbook-hinge h-2.5 sm:h-3.5 mx-8 sm:mx-12 rounded-b-md shadow-md" />

        {/* MACBOOK KEYBOARD BASE */}
        <div className="macbook-keyboard-deck relative mx-auto rounded-b-[16px] sm:rounded-b-[24px] p-3 sm:p-6 border border-gray-700/60 shadow-2xl">
          {/* Thumb Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 sm:w-24 h-2 sm:h-2.5 bg-gray-900 rounded-b-lg border-b border-x border-gray-700/50" />

          {/* KEYBOARD WELL */}
          <div className="w-full bg-black/60 rounded-xl p-2 sm:p-4 border border-white/5 shadow-inner">
            {/* Function Keys Row */}
            <div className="grid grid-cols-12 gap-1 mb-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="macbook-key h-3 sm:h-4 rounded text-[7px] sm:text-[8px] flex items-center justify-center text-gray-500">
                  F{i + 1}
                </div>
              ))}
            </div>

            {/* QWERTY Row */}
            <div className="grid grid-cols-12 gap-1 mb-1">
              {['Q','W','E','R','T','Y','U','I','O','P','[',']'].map((k) => (
                <div key={k} className="macbook-key h-4 sm:h-7 rounded text-[8px] sm:text-[10px] font-mono flex items-center justify-center text-gray-400 font-bold">
                  {k}
                </div>
              ))}
            </div>

            {/* Spacebar Row */}
            <div className="flex gap-1">
              <div className="macbook-key h-4 sm:h-7 px-1 sm:px-2 rounded text-[7px] sm:text-[9px] flex items-center justify-center text-gray-400">ctrl</div>
              <div className="macbook-key h-4 sm:h-7 px-1 sm:px-2 rounded text-[7px] sm:text-[9px] flex items-center justify-center text-gray-400">opt</div>
              <div className="macbook-key h-4 sm:h-7 px-1.5 sm:px-3 rounded text-[7px] sm:text-[9px] flex items-center justify-center text-gray-300 font-bold gap-0.5">
                <Command className="w-2 sm:w-2.5 h-2 sm:h-2.5" /> cmd
              </div>
              <div className="macbook-key h-4 sm:h-7 flex-1 rounded text-[7px] sm:text-[9px] flex items-center justify-center text-gray-600">
                space
              </div>
              <div className="macbook-key h-4 sm:h-7 px-1.5 sm:px-3 rounded text-[7px] sm:text-[9px] flex items-center justify-center text-gray-300 font-bold gap-0.5">
                <Command className="w-2 sm:w-2.5 h-2 sm:h-2.5" /> cmd
              </div>
              <div className="macbook-key h-4 sm:h-7 px-1 sm:px-2 rounded text-[7px] sm:text-[9px] flex items-center justify-center text-gray-400">opt</div>
            </div>
          </div>

          {/* PALM REST & TRACKPAD AREA */}
          <div className="mt-3 sm:mt-4 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="w-full md:w-1/3 text-center md:text-left hidden sm:block">
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Apple M3 Max • 36GB RAM</span>
            </div>

            {/* TRACKPAD WITH AD SLOT */}
            <div className="w-full md:w-2/5">
              {trackpadSlot ? (
                <AdSlotOverlay
                  slot={trackpadSlot}
                  onSelect={setSelectedSlot}
                />
              ) : (
                <div className="h-12 sm:h-16 rounded-xl border border-white/10 bg-black/40 shadow-inner flex items-center justify-center text-xs text-gray-500 font-mono">
                  Force Touch Trackpad
                </div>
              )}
            </div>

            <div className="w-full md:w-1/3 text-center md:text-right hidden sm:block">
              <span className="text-[10px] text-gray-500 font-mono">Rent-a-Mac Pro 16&quot;</span>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE SLOT SELECTOR BAR (Visible on screens <768px) */}
      <div className="block md:hidden mt-6 bg-gray-900/90 border border-gray-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" /> Mobile Slot Navigator
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
      <SlotInspectModal
        slot={selectedSlot}
        onClose={() => setSelectedSlot(null)}
      />
    </div>
  );
}
