'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShieldCheck, Clock, ArrowRight, Laptop } from 'lucide-react';
import Link from 'next/link';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const rentalId = searchParams.get('rental_id');
  const sessionId = searchParams.get('session_id');

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
      <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-xl shadow-emerald-500/10">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30">
          Payment Processed &amp; Received
        </span>
        <h1 className="text-3xl font-black text-white sm:text-4xl">Your Ad Has Been Submitted!</h1>
        <p className="text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
          Thank you for advertising on Rent-a-Mac. Your order has been registered and is now queued for 24-hour moderation approval.
        </p>
      </div>

      {/* Confirmation Details Card */}
      <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 text-left space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <span className="text-gray-400">Order Reference ID:</span>
          <span className="font-mono text-white font-bold">{rentalId || 'RENT-MAC-PENDING'}</span>
        </div>
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <span className="text-gray-400">Transaction Session:</span>
          <span className="font-mono text-gray-300 truncate max-w-[200px]">{sessionId || 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Current Status:</span>
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> PENDING_REVIEW
          </span>
        </div>
      </div>

      {/* Process Info */}
      <div className="p-5 rounded-2xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-300 text-left flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 shrink-0 text-blue-400 mt-0.5" />
        <div>
          <h4 className="font-bold text-white mb-0.5">What Happens Next?</h4>
          <p className="text-gray-300 leading-relaxed">
            Our admin team inspects your target URL and banner graphic. Once approved, your status transitions to <strong className="text-emerald-400">ACTIVE</strong> and your ad will automatically display live on the MacBook homepage.
          </p>
        </div>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
        >
          <Laptop className="w-4 h-4" /> View MacBook Homepage
        </Link>
        <Link
          href="/login"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white bg-gray-900 border border-gray-800 transition-all flex items-center justify-center gap-2"
        >
          Portal Login <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-gray-400">Loading Order Confirmation...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
