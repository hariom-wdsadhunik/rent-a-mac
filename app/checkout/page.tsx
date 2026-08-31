'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { calculateRentalPrice } from '@/lib/pricing';
import { AdvertisingSlotData } from '@/lib/types';
import { Sparkles, Calendar, Upload, Globe, Building2, User, Mail, ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const slotIdParam = searchParams.get('slotId');
  const durationParam = searchParams.get('duration');

  const [slots, setSlots] = useState<AdvertisingSlotData[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>(slotIdParam || '');
  const [durationDays, setDurationDays] = useState<7 | 30 | 90>(
    durationParam ? (parseInt(durationParam, 10) as any) : 7
  );

  // Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [startDateStr, setStartDateStr] = useState<string>(todayStr);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [adTitle, setAdTitle] = useState('');
  const [brandName, setBrandName] = useState('');
  const [targetUrl, setTargetUrl] = useState('https://');
  const [imageUrl, setImageUrl] = useState('');

  // UI State
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/slots')
      .then((res) => res.json())
      .then((data) => {
        if (data.slots) {
          setSlots(data.slots);
          if (!selectedSlotId && data.slots.length > 0) {
            setSelectedSlotId(data.slots[0].id);
          }
        }
      })
      .catch((err) => console.error('Failed to load slots:', err));
  }, [selectedSlotId]);

  const selectedSlot = slots.find((s) => s.id === selectedSlotId);
  const pricing = selectedSlot
    ? calculateRentalPrice(selectedSlot.basePrice7Days, durationDays)
    : null;

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setImageUrl(data.url);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload creative image.');
    } finally {
      setIsUploading(false);
    }
  };

  // Submit Order Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId) {
      setErrorMsg('Please select an advertising slot.');
      return;
    }
    if (!imageUrl) {
      setErrorMsg('Please upload your ad banner/logo creative.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: selectedSlotId,
          startDate: startDateStr,
          durationDays,
          userName,
          userEmail,
          companyName,
          adTitle,
          brandName,
          targetUrl,
          imageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Checkout initialization failed');
      }

      // Redirect to Stripe Checkout or Mock Success
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred processing your checkout.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-xs text-blue-400 hover:underline">← Back to MacBook Display</Link>
        <h1 className="text-3xl font-black text-white mt-2">Rent Advertising Space</h1>
        <p className="text-sm text-gray-400">Complete your campaign details below for 24-hour admin review and live display.</p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Select Slot */}
          <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" /> 1. Select Advertising Slot
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {slots.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSlotId(s.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedSlotId === s.id
                      ? 'bg-blue-950/40 border-blue-500 text-white ring-1 ring-blue-500'
                      : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{s.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400">${s.basePrice7Days}/7d</span>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-1">{s.position} • {s.width}×{s.height}px</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Campaign Dates & Duration */}
          <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" /> 2. Dates & Duration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Start Date</label>
                <input
                  type="date"
                  min={todayStr}
                  value={startDateStr}
                  onChange={(e) => setStartDateStr(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Duration Window</label>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(parseInt(e.target.value, 10) as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value={7}>7 Days (Standard Base Rate)</option>
                  <option value={30}>30 Days (15% Discount)</option>
                  <option value={90}>90 Days (30% Discount)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Ad Creative & Target URL */}
          <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-400" /> 3. Advertisement Creative & URL
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme SaaS"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Ad Headline / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Next-Gen Developer Tools"
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Target Website URL</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Creative Upload Area */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Upload Banner / Logo Creative</label>
              <div className="border-2 border-dashed border-gray-800 hover:border-blue-500/50 rounded-xl p-6 text-center bg-gray-950 transition-colors">
                {imageUrl ? (
                  <div className="space-y-3">
                    {/* eslint-disable-next-html-element-suppression */}
                    <img
                      src={imageUrl}
                      alt="Ad Preview"
                      className="max-h-28 mx-auto rounded-lg border border-gray-700 object-contain"
                    />
                    <p className="text-[11px] text-emerald-400 font-medium">✓ File uploaded successfully</p>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-[10px] text-gray-400 underline hover:text-white"
                    >
                      Remove and replace file
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-300 font-medium">Click to select or drag image file here</p>
                    <p className="text-[10px] text-gray-500 mt-1">PNG, JPG, WebP, SVG, GIF up to 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="creative-file-input"
                    />
                    <label
                      htmlFor="creative-file-input"
                      className="inline-block mt-3 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-white font-semibold cursor-pointer"
                    >
                      {isUploading ? 'Uploading File...' : 'Choose Image File'}
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 4: Advertiser Contact Info */}
          <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" /> 4. Advertiser Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="jane@company.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Company / Organization (Optional)</label>
              <input
                type="text"
                placeholder="Acme Corporation"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Payment Button */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-6">
            <h3 className="text-base font-bold text-white border-b border-gray-800 pb-4 flex items-center justify-between">
              <span>Order Summary</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </h3>

            {selectedSlot && pricing ? (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase block">Selected Slot</span>
                  <h4 className="text-sm font-bold text-white">{selectedSlot.name}</h4>
                  <p className="text-gray-400">{selectedSlot.position} ({selectedSlot.width}×{selectedSlot.height}px)</p>
                </div>

                <div className="space-y-2 text-gray-300 pt-2">
                  <div className="flex justify-between">
                    <span>Base 7-Day Rate:</span>
                    <span>${selectedSlot.basePrice7Days.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration Window:</span>
                    <span className="font-semibold text-white">{durationDays} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${pricing.subtotal.toFixed(2)}</span>
                  </div>
                  {pricing.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Duration Discount ({pricing.discountPercentage}%):</span>
                      <span>-${pricing.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block">Total Due Now</span>
                    <span className="text-2xl font-black text-blue-400">${pricing.finalPrice.toFixed(2)}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">(${pricing.pricePerDay.toFixed(2)}/day)</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isUploading || !imageUrl}
                  className="w-full py-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing Payment...
                    </>
                  ) : (
                    <>
                      Proceed to Secure Checkout <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-gray-500 leading-tight">
                  🔒 Payments are processed securely via Stripe. Upon payment confirmation, your ad enters moderation review.
                </p>
              </div>
            ) : (
              <div className="text-center text-gray-500 text-xs py-8">
                Loading slot pricing breakdown...
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-gray-400">Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
