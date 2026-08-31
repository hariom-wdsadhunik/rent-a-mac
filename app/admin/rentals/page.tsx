'use client';

import React, { useState, useEffect } from 'react';
import { Check, X, ExternalLink, ShieldCheck, Clock, AlertCircle, RefreshCw } from 'lucide-react';

interface AdminRentalItem {
  id: string;
  userName: string;
  userEmail: string;
  companyName?: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
  rejectionReason?: string;
  slot: {
    name: string;
    position: string;
  };
  advertisement: {
    title: string;
    brandName: string;
    targetUrl: string;
    imageUrl: string;
  };
  payment?: {
    status: string;
    stripeSessionId?: string;
  };
}

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<AdminRentalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/slots');
      const data = await res.json();
      // Extract all rentals from slots query or specialized rental endpoint
      const allRentals: AdminRentalItem[] = [];
      if (data.slots) {
        data.slots.forEach((slot: any) => {
          if (slot.rentals) {
            slot.rentals.forEach((r: any) => {
              allRentals.push({
                ...r,
                slot: { name: slot.name, position: slot.position },
              });
            });
          }
        });
      }
      setRentals(allRentals);
    } catch (err) {
      console.error('Failed to load rentals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleApprove = async (rentalId: string) => {
    setActionLoading(rentalId);
    try {
      const res = await fetch(`/api/admin/rentals/${rentalId}/approve`, {
        method: 'POST',
      });
      if (res.ok) {
        await fetchRentals();
      }
    } catch (err) {
      console.error('Approve failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (rentalId: string) => {
    const reason = prompt('Enter rejection reason for advertiser:', 'Violated brand safety standards');
    if (!reason) return;

    setActionLoading(rentalId);
    try {
      const res = await fetch(`/api/admin/rentals/${rentalId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        await fetchRentals();
      }
    } catch (err) {
      console.error('Reject failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Rentals Moderation Queue</h1>
          <p className="text-xs text-gray-400">Review submitted ad creative, verify destination URLs, and approve live display.</p>
        </div>
        <button
          onClick={fetchRentals}
          className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-gray-400">Loading rentals database...</div>
      ) : rentals.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-gray-900 border border-gray-800 text-xs text-gray-500">
          No rentals found in system. Submit a campaign on the homepage to populate moderation queue.
        </div>
      ) : (
        <div className="space-y-4">
          {rentals.map((r) => {
            const isPending = r.status === 'PENDING_REVIEW';
            const isActive = r.status === 'ACTIVE';
            const isRejected = r.status === 'REJECTED';

            return (
              <div
                key={r.id}
                className={`p-6 rounded-2xl border transition-all ${
                  isPending
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : isActive
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-gray-900 border-gray-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Creative Thumbnail & Info */}
                  <div className="flex items-start gap-4">
                    {/* eslint-disable-next-html-element-suppression */}
                    <img
                      src={r.advertisement?.imageUrl || 'https://via.placeholder.com/150'}
                      alt={r.advertisement?.brandName || 'Ad Creative'}
                      className="w-20 h-20 object-cover rounded-xl border border-gray-700 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{r.advertisement?.brandName}</h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            isActive
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : isPending
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : isRejected
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-gray-800 text-gray-400'
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>

                      <p className="text-xs text-gray-300 font-medium">{r.advertisement?.title}</p>

                      <a
                        href={r.advertisement?.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline"
                      >
                        {r.advertisement?.targetUrl} <ExternalLink className="w-3 h-3" />
                      </a>

                      <div className="pt-2 flex flex-wrap gap-4 text-[11px] text-gray-400">
                        <span>Advertiser: <strong className="text-white">{r.userName} ({r.userEmail})</strong></span>
                        <span>Target Slot: <strong className="text-white">{r.slot.name}</strong></span>
                        <span>Duration: <strong className="text-white">{r.durationDays} Days</strong></span>
                        <span>Amount Paid: <strong className="text-emerald-400 font-mono">${r.totalAmount.toFixed(2)}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-800">
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleApprove(r.id)}
                          disabled={actionLoading === r.id}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" /> Approve Ad
                        </button>
                        <button
                          onClick={() => handleReject(r.id)}
                          disabled={actionLoading === r.id}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 transition-all flex items-center gap-1.5"
                        >
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </>
                    )}

                    {isActive && (
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" /> Live on MacBook Screen
                      </span>
                    )}

                    {isRejected && (
                      <span className="text-xs text-red-400 font-medium">
                        Rejected: {r.rejectionReason}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
