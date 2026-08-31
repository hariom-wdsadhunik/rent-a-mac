'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  Calendar,
  DollarSign,
  User,
  X,
} from 'lucide-react';

interface RentalData {
  id: string;
  userEmail: string;
  userName: string;
  companyName?: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
  rejectionReason?: string;
  createdAt: string;
  slot: {
    name: string;
    slug: string;
  };
  advertisement: {
    id: string;
    title: string;
    brandName: string;
    targetUrl: string;
    imageUrl: string;
    status: string;
  };
  payment?: {
    status: string;
    amount: number;
  } | null;
}

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<RentalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Reject Modal State
  const [rejectingRentalId, setRejectingRentalId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Extend Modal State
  const [extendingRentalId, setExtendingRentalId] = useState<string | null>(null);
  const [extendDaysCount, setExtendDaysCount] = useState(7);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const url = statusFilter !== 'ALL' ? `/api/admin/rentals?status=${statusFilter}` : '/api/admin/rentals';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setRentals(data.rentals || []);
      }
    } catch (err) {
      console.error('Error fetching rentals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, [statusFilter]);

  const handleAction = async (rentalId: string, action: string, extraData: any = {}) => {
    try {
      const res = await fetch(`/api/admin/rentals/${rentalId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extraData }),
      });

      if (res.ok) {
        setRejectingRentalId(null);
        setExtendingRentalId(null);
        setRejectionReason('');
        fetchRentals();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Action failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error processing rental action');
    }
  };

  const filteredRentals = rentals.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.userName.toLowerCase().includes(q) ||
      r.userEmail.toLowerCase().includes(q) ||
      r.slot.name.toLowerCase().includes(q) ||
      r.advertisement.brandName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" /> Rental &amp; Campaign Management
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Review customer bookings, approve/reject submitted campaigns, and extend or suspend rental agreements.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer, email, slot, or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING_REVIEW">PENDING_REVIEW</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="REJECTED">REJECTED</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="EXPIRED">EXPIRED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>

        {/* Rentals Table */}
        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-gray-400">Loading rentals database...</div>
        ) : filteredRentals.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-gray-400">No matching rentals found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Target Slot</th>
                  <th className="pb-3">Advertisement</th>
                  <th className="pb-3">Dates &amp; Duration</th>
                  <th className="pb-3">Amount &amp; Payment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium">
                {filteredRentals.map((rental) => (
                  <tr key={rental.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-4">
                      <span className="text-white font-bold block">{rental.userName}</span>
                      <span className="text-gray-400 text-[10px] font-mono">{rental.userEmail}</span>
                      {rental.companyName && (
                        <span className="text-[10px] text-gray-400 block">{rental.companyName}</span>
                      )}
                    </td>
                    <td className="py-4 font-mono text-gray-300">{rental.slot.name}</td>
                    <td className="py-4">
                      <span className="text-white font-bold block">{rental.advertisement.brandName}</span>
                      <span className="text-gray-400 text-[10px] block truncate max-w-[140px]">
                        {rental.advertisement.title}
                      </span>
                    </td>
                    <td className="py-4 font-mono text-[11px] text-gray-300">
                      <span className="block">{rental.durationDays} Days</span>
                      <span className="text-[10px] text-gray-400 block">
                        {new Date(rental.startDate).toLocaleDateString()} &rarr;{' '}
                        {new Date(rental.endDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="text-white font-mono font-bold block">${rental.totalAmount.toFixed(2)}</span>
                      <span
                        className={`text-[9px] font-bold font-mono uppercase ${
                          rental.payment?.status === 'COMPLETED' ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {rental.payment?.status || 'UNPAID'}
                      </span>
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                          rental.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : rental.status === 'PENDING_REVIEW'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : rental.status === 'REJECTED'
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : 'bg-gray-800 text-gray-300 border-gray-700'
                        }`}
                      >
                        {rental.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {rental.status === 'PENDING_REVIEW' && (
                          <>
                            <button
                              onClick={() => handleAction(rental.id, 'approve')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-all flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Approve
                            </button>
                            <button
                              onClick={() => setRejectingRentalId(rental.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-400 font-bold text-[10px] transition-all flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" /> Reject
                            </button>
                          </>
                        )}

                        {rental.status === 'ACTIVE' && (
                          <>
                            <button
                              onClick={() => setExtendingRentalId(rental.id)}
                              className="px-2 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900 border border-blue-500/30 text-blue-400 font-semibold text-[10px]"
                            >
                              Extend
                            </button>
                            <button
                              onClick={() => handleAction(rental.id, 'suspend')}
                              className="px-2 py-1 rounded-lg bg-red-950/40 hover:bg-red-900 border border-red-500/30 text-red-400 font-semibold text-[10px]"
                            >
                              Suspend
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* REJECT MODAL */}
      {rejectingRentalId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" /> Reject Rental Campaign
            </h3>
            <p className="text-xs text-gray-400">Specify the rejection reason to send to the advertiser:</p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Image resolution below minimum requirements or inappropriate content URL."
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectingRentalId(null)}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(rejectingRentalId, 'reject', { reason: rejectionReason })}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXTEND MODAL */}
      {extendingRentalId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" /> Extend Campaign Duration
            </h3>
            <p className="text-xs text-gray-400">Select number of additional days to extend this active rental:</p>
            <input
              type="number"
              min="1"
              max="180"
              value={extendDaysCount}
              onChange={(e) => setExtendDaysCount(parseInt(e.target.value, 10))}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 font-mono text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setExtendingRentalId(null)}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(extendingRentalId, 'extend', { extendDays: extendDaysCount })}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                Extend Rental
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
