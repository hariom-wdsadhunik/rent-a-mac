'use client';

import React, { useState } from 'react';
import { AdvertisingSlotData } from '@/lib/types';
import { Sparkles, ArrowUpRight, Laptop, Info } from 'lucide-react';
import { SlotInspectModal } from '../macbook/SlotInspectModal';

interface SlotsGridProps {
  slots: AdvertisingSlotData[];
}

export function SlotsGrid({ slots }: SlotsGridProps) {
  const [selectedSlot, setSelectedSlot] = useState<AdvertisingSlotData | null>(null);

  return (
    <section id="spots-inventory" className="py-12 md:py-16 border-t border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* DESKTOP INTERACTIVE INVENTORY GRID (>=768px) */}
        <div className="hidden md:block">
          <div className="flex flex-row items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
                MacBook Outer Lid Inventory
              </h2>
              <h3 className="text-3xl font-black text-white sm:text-4xl">Own a piece of the MacBook.</h3>
              <p className="text-gray-400 text-sm mt-2">
                Inspect current availability, physical lid placement, dimensions, and pro-rated duration pricing.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Database Inventory State
            </div>
          </div>

          {/* Desktop Inventory Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((slot) => {
              const isAvailable = slot.status === 'AVAILABLE';
              const isOccupied = slot.status === 'OCCUPIED';

              return (
                <div
                  key={slot.id}
                  className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-gray-400 px-2 py-0.5 rounded bg-gray-800 border border-gray-700">
                        Lid Zone: {slot.position}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          isAvailable
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : isOccupied
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {slot.status}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {slot.name}
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">{slot.description}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 py-2 px-3 rounded-lg bg-gray-950 border border-gray-800">
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase">Resolution</span>
                        <strong className="text-white">{slot.width}×{slot.height}px</strong>
                      </div>
                      <div className="border-l border-gray-800 pl-4">
                        <span className="text-[10px] text-gray-500 block uppercase">Base Rate</span>
                        <strong className="text-emerald-400">${slot.basePrice7Days} / 7d</strong>
                      </div>
                    </div>

                    {isOccupied && slot.activeAd && (
                      <div className="mb-4 p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs flex items-center gap-3">
                        {/* eslint-disable-next-html-element-suppression */}
                        <img
                          src={slot.activeAd.imageUrl}
                          alt={slot.activeAd.brandName}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                        <div className="truncate">
                          <span className="text-[10px] text-blue-400 font-semibold block">Active Lid Decal</span>
                          <strong className="text-white truncate block">{slot.activeAd.brandName}</strong>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-gray-500 block text-[10px]">30-Day Rate</span>
                      <span className="font-bold text-white">
                        ${(slot.basePrice7Days * (30 / 7) * 0.85).toFixed(0)}{' '}
                        <span className="text-[10px] font-normal text-emerald-400">(15% off)</span>
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isAvailable
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      {isAvailable ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5" /> Rent Spot
                        </>
                      ) : (
                        <>
                          Inspect Details <ArrowUpRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE STATIC MARKETING PLACEMENT GUIDE (<768px) — NON-INTERACTIVE */}
        <div className="block md:hidden space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">
              MacBook Placement Types
            </h2>
            <h3 className="text-2xl font-black text-white">Advertising space is limited.</h3>
            <p className="text-gray-400 text-xs mt-1">
              Rent-a-Mac features 6 distinct physical placement types on the MacBook outer lid.
            </p>
          </div>

          {/* Static Non-Clickable Placement Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { name: 'Featured Center Billboard', pos: 'Prime Center', desc: 'Highest visibility placement right in the center of the outer lid.' },
              { name: 'Top Notch Strip', pos: 'Top Lid Bar', desc: 'Horizontal strip running along the top of the aluminum lid.' },
              { name: 'Side Flank Left', pos: 'Left Lid Corner', desc: 'Vertical decal space flanking the left side of the Apple logo.' },
              { name: 'Side Flank Right', pos: 'Right Lid Corner', desc: 'Vertical decal space flanking the right side of the Apple logo.' },
              { name: 'Bottom Left Badge', pos: 'Bottom Left', desc: 'Sleek app icon badge on the bottom left of the outer lid.' },
              { name: 'Bottom Right Plate', pos: 'Bottom Right', desc: 'Branded plate placement on the bottom right of the outer lid.' },
            ].map((p, i) => (
              <div key={i} className="p-4 rounded-xl bg-gray-900 border border-gray-800 space-y-1.5 pointer-events-none">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{p.name}</span>
                  <span className="text-[9px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30">
                    {p.pos}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-normal">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Single Clear Mobile Rental CTA Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/80 via-indigo-950/70 to-gray-900 border border-blue-500/40 text-center space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto">
              <Laptop className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Rent from a PC or laptop</h4>
            <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
              Open Rent-a-Mac on a desktop or laptop to inspect the advertising surface, choose your placement, configure your campaign, and complete your rental.
            </p>
            <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 text-[11px] text-gray-400 flex items-center justify-center gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
              <span>URL: <strong className="text-white">https://rent-a-mac.wdsadhunik.workers.dev</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop-Only Inspect Modal */}
      <SlotInspectModal slot={selectedSlot} onClose={() => setSelectedSlot(null)} />
    </section>
  );
}
