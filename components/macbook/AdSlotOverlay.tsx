'use client';

import React from 'react';
import { AdvertisingSlotData } from '@/lib/types';
import { Sparkles, Lock, Clock, ExternalLink } from 'lucide-react';

interface AdSlotOverlayProps {
  slot: AdvertisingSlotData;
  isSelected?: boolean;
  onSelect: (slot: AdvertisingSlotData) => void;
}

export function AdSlotOverlay({ slot, isSelected, onSelect }: AdSlotOverlayProps) {
  const isAvailable = slot.status === 'AVAILABLE';
  const isOccupied = slot.status === 'OCCUPIED' && slot.activeAd;
  const isPending = slot.status === 'PENDING';
  const isReserved = slot.status === 'RESERVED';

  const getStatusBadge = () => {
    if (isAvailable) return <span className="slot-badge-available px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1"><Sparkles className="w-3 h-3" /> Available</span>;
    if (isOccupied) return <span className="slot-badge-occupied px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1"><ExternalLink className="w-3 h-3" /> Occupied</span>;
    if (isPending) return <span className="slot-badge-pending px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1"><Clock className="w-3 h-3" /> Pending Review</span>;
    return <span className="slot-badge-reserved px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1"><Lock className="w-3 h-3" /> Reserved</span>;
  };

  return (
    <div
      onClick={() => onSelect(slot)}
      className={`group relative slot-interactive cursor-pointer rounded-lg border p-3 flex flex-col justify-between overflow-hidden backdrop-blur-md transition-all ${
        isSelected
          ? 'ring-2 ring-blue-500 border-blue-400 bg-blue-950/40 shadow-slot-active'
          : isAvailable
          ? 'border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400 hover:bg-emerald-900/30'
          : isOccupied
          ? 'border-blue-500/40 bg-blue-950/20 hover:border-blue-400'
          : 'border-amber-500/30 bg-amber-950/20'
      }`}
      style={{
        minHeight: `${Math.max(slot.height * 0.4, 70)}px`,
      }}
    >
      {/* Background Image if Occupied */}
      {isOccupied && slot.activeAd && (
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-html-element-suppression */}
          <img
            src={slot.activeAd.imageUrl}
            alt={slot.activeAd.brandName}
            className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        </div>
      )}

      {/* Header Slot Info */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-white tracking-wide uppercase px-1.5 py-0.5 rounded bg-black/60 backdrop-blur border border-white/10">
            {slot.name}
          </span>
        </div>
        {getStatusBadge()}
      </div>

      {/* Main Content Info */}
      <div className="relative z-10 my-2">
        {isOccupied && slot.activeAd ? (
          <div>
            <h4 className="text-sm font-bold text-white drop-shadow truncate">{slot.activeAd.brandName}</h4>
            <p className="text-xs text-gray-300 line-clamp-1 drop-shadow-sm">{slot.activeAd.title}</p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-300 line-clamp-2 font-medium">{slot.description}</p>
          </div>
        )}
      </div>

      {/* Footer Price & CTA */}
      <div className="relative z-10 flex items-center justify-between pt-1 border-t border-white/10">
        <div>
          <span className="text-[10px] text-gray-400 block uppercase font-medium">Starting from</span>
          <span className="text-xs font-bold text-white">${slot.basePrice7Days} <span className="text-[10px] font-normal text-gray-400">/ 7 days</span></span>
        </div>
        <button
          type="button"
          className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all group-hover:scale-105"
        >
          {isAvailable ? 'Rent Spot' : 'Inspect'}
        </button>
      </div>
    </div>
  );
}
