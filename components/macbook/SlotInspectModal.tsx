'use client';

import React, { useState, useEffect } from 'react';
import { AdvertisingSlotData } from '@/lib/types';
import { calculateRentalPrice } from '@/lib/pricing';
import { X, CheckCircle2, ShieldCheck, Sparkles, ExternalLink, Calendar, Laptop, Info } from 'lucide-react';
import Link from 'next/link';

interface SlotInspectModalProps {
  slot: AdvertisingSlotData | null;
  onClose: () => void;
}

export function SlotInspectModal({ slot, onClose }: SlotInspectModalProps) {
  const [selectedDuration, setSelectedDuration] = useState<7 | 30 | 90>(7);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileNotice, setShowMobileNotice] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!slot) return null;

  const isAvailable = slot.status === 'AVAILABLE';
  const pricing = calculateRentalPrice(slot.basePrice7Days, selectedDuration);

  const handleMobileRentClick = () => {
    // Record analytics event for mobile rent intent
    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'MOBILE_RENT_INTENT',
          slotId: slot.id,
        }),
      }).catch(() => {});
    } catch {}

    setShowMobileNotice(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-gray-950/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">{slot.name}</h3>
              <p className="text-xs text-gray-400">Position: {slot.position} • ID: {slot.slug}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* POLITE MOBILE NOTICE OVERLAY */}
        {showMobileNotice ? (
          <div className="p-6 space-y-5 text-center">
            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto">
                <Laptop className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Rental requires a PC or laptop</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                The Rent-a-Mac advertising workspace is designed for desktop and laptop screens so you can properly inspect, configure, and upload your advertising placement.
              </p>
              <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 text-[11px] text-gray-400 text-left flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Open <strong>https://rent-a-mac.com</strong> on your computer to complete your campaign reservation.</span>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={() => setShowMobileNotice(false)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Status Alert */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  isAvailable
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                    : 'bg-blue-950/40 border-blue-500/30 text-blue-300'
                }`}
              >
                {isAvailable ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-blue-400" />
                )}
                <div>
                  <h4 className="text-sm font-semibold">
                    {isAvailable ? 'Spot Available for Reservation' : `Spot Occupied (${slot.status})`}
                  </h4>
                  <p className="text-xs text-gray-300 mt-0.5">
                    {isAvailable
                      ? 'Reserve this outer lid spot on the internet’s MacBook. All submissions are moderated within 24 hours.'
                      : slot.activeAd
                      ? `Currently rented by ${slot.activeAd.brandName} until ${slot.activeAd.endDate}. You can inspect active creative details below.`
                      : 'This spot is currently reserved or under review.'}
                  </p>
                </div>
              </div>

              {/* Occupied Creative Preview */}
              {slot.activeAd && (
                <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-3">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Lid Decal</h4>
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-html-element-suppression */}
                    <img
                      src={slot.activeAd.imageUrl}
                      alt={slot.activeAd.brandName}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-700"
                    />
                    <div>
                      <h5 className="text-sm font-bold text-white">{slot.activeAd.brandName}</h5>
                      <p className="text-xs text-gray-300">{slot.activeAd.title}</p>
                      <a
                        href={slot.activeAd.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline mt-1"
                      >
                        {slot.activeAd.targetUrl} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Slot Description */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Description &amp; Lid Placement
                </h4>
                <p className="text-sm text-gray-300">{slot.description}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                  <span>
                    Resolution: <strong className="text-white">{slot.width}px × {slot.height}px</strong>
                  </span>
                  <span>
                    Grid Area: <strong className="text-white">{slot.gridArea}</strong>
                  </span>
                </div>
              </div>

              {/* Duration Selector */}
              {isAvailable && (
                <div className="space-y-3 pt-2 border-t border-gray-800">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Select Rental Duration
                  </h4>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { days: 7, label: '7 Days', discount: 'Base Rate' },
                      { days: 30, label: '30 Days', discount: 'Save 15%' },
                      { days: 90, label: '90 Days', discount: 'Save 30%' },
                    ].map((option) => (
                      <button
                        key={option.days}
                        type="button"
                        onClick={() => setSelectedDuration(option.days as 7 | 30 | 90)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedDuration === option.days
                            ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500'
                            : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{option.label}</span>
                          <Calendar className="w-3.5 h-3.5 opacity-60" />
                        </div>
                        <span className="block text-[10px] font-semibold text-blue-400 mt-1">
                          {option.discount}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Server Price Breakdown */}
                  <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-2 text-xs">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal ({pricing.durationDays} days)</span>
                      <span>${pricing.subtotal.toFixed(2)}</span>
                    </div>
                    {pricing.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-medium">
                        <span>Duration Discount ({pricing.discountPercentage}%)</span>
                        <span>-${pricing.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-gray-800">
                      <span>Total Investment</span>
                      <span className="text-blue-400 text-base">
                        ${pricing.finalPrice.toFixed(2)}{' '}
                        <span className="text-xs font-normal text-gray-400">
                          (${pricing.pricePerDay.toFixed(2)}/day)
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-800 bg-gray-950/60 flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
              {isAvailable ? (
                isMobile ? (
                  <button
                    onClick={handleMobileRentClick}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center gap-1.5"
                  >
                    <Laptop className="w-3.5 h-3.5" /> Rent on PC
                  </button>
                ) : (
                  <Link
                    href={`/checkout?slotId=${slot.id}&duration=${selectedDuration}`}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:scale-105"
                  >
                    Rent This Spot Now →
                  </Link>
                )
              ) : (
                <span className="text-xs text-gray-500 font-medium">Currently Unavailable</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
