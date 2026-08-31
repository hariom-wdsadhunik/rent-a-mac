'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Search, Filter, DollarSign, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface PaymentRecord {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  companyName?: string;
  slotName: string;
  adTitle: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  createdAt: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/payments');
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filtered = payments.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.orderId.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q) ||
      p.customerEmail.toLowerCase().includes(q) ||
      p.slotName.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-cyan-400" /> Payment &amp; Order Transactions
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Verified Stripe webhooks &amp; order payment records. Payment statuses originate strictly from server verification.
          </p>
        </div>
      </div>

      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer, email, or slot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="PENDING">PENDING</option>
              <option value="FAILED">FAILED</option>
              <option value="REFUNDED">REFUNDED</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-gray-400">Loading payment ledger...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-gray-400">No matching payment transactions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Slot &amp; Campaign</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Payment Provider</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-3.5 font-mono text-cyan-400 font-bold text-[11px]">{p.orderId}</td>
                    <td className="py-3.5">
                      <span className="text-white font-bold block">{p.customerName}</span>
                      <span className="text-gray-400 text-[10px] font-mono">{p.customerEmail}</span>
                    </td>
                    <td className="py-3.5">
                      <span className="text-white font-mono text-[11px] block">{p.slotName}</span>
                      <span className="text-gray-400 text-[10px] block truncate max-w-[150px]">{p.adTitle}</span>
                    </td>
                    <td className="py-3.5 font-mono font-black text-white">${p.amount.toFixed(2)} {p.currency}</td>
                    <td className="py-3.5 text-gray-400 font-mono text-[11px] uppercase">{p.provider}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                          p.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : p.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-mono text-gray-400 text-[10px]">
                      {new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
