import React from 'react';
import { db } from '@/lib/db';
import { DollarSign, FileCheck, Clock, Grid, ExternalLink, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

async function getAdminMetrics() {
  const totalPayments = await db.payment.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { amount: true },
  });

  const activeRentalsCount = await db.rental.count({
    where: { status: 'ACTIVE' },
  });

  const pendingApprovalsCount = await db.rental.count({
    where: { status: 'PENDING_REVIEW' },
  });

  const availableSlotsCount = await db.advertisingSlot.count({
    where: { status: 'AVAILABLE' },
  });

  const totalSlotsCount = await db.advertisingSlot.count();

  const recentRentals = await db.rental.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      slot: true,
      advertisement: true,
      payment: true,
    },
  });

  return {
    totalRevenue: totalPayments._sum.amount || 0,
    activeRentalsCount,
    pendingApprovalsCount,
    availableSlotsCount,
    totalSlotsCount,
    recentRentals,
  };
}

export default async function AdminOverviewPage() {
  const metrics = await getAdminMetrics();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Admin Overview &amp; Analytics</h1>
        <p className="text-xs text-gray-400">Monitor revenue, moderate incoming ads, and inspect slot occupancy.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Total Revenue</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-white">${metrics.totalRevenue.toFixed(2)}</p>
          <span className="text-[10px] text-emerald-400 font-medium">Verified Payment Provider Webhooks</span>
        </div>

        <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Pending Approvals</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-amber-400">{metrics.pendingApprovalsCount}</p>
          <Link href="/admin/rentals" className="text-[10px] text-amber-400 hover:underline">
            Requires Moderation Review →
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Active Live Rentals</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileCheck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-white">{metrics.activeRentalsCount}</p>
          <span className="text-[10px] text-gray-400">Displaying Live on MacBook</span>
        </div>

        <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Inventory Occupancy</span>
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Grid className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-white">
            {metrics.totalSlotsCount - metrics.availableSlotsCount} / {metrics.totalSlotsCount}
          </p>
          <span className="text-[10px] text-gray-400">
            {metrics.availableSlotsCount} Slots Available for Rent
          </span>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Orders &amp; Submissions</h3>
          <Link href="/admin/rentals" className="text-xs text-blue-400 hover:underline">
            View All Rentals →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3">Advertiser / Brand</th>
                <th className="pb-3">Target Slot</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {metrics.recentRentals.length > 0 ? (
                metrics.recentRentals.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-800/40">
                    <td className="py-3">
                      <strong className="text-white block">{r.advertisement.brandName}</strong>
                      <span className="text-[10px] text-gray-400">{r.userEmail}</span>
                    </td>
                    <td className="py-3 text-gray-300">{r.slot.name}</td>
                    <td className="py-3 text-gray-300">{r.durationDays} Days</td>
                    <td className="py-3 text-white font-mono font-bold">${r.totalAmount.toFixed(2)}</td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          r.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : r.status === 'PENDING_REVIEW'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : r.status === 'REJECTED'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href="/admin/rentals"
                        className="text-[11px] font-semibold text-blue-400 hover:underline"
                      >
                        Moderate
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No orders recorded yet. Run seeder or initiate a test rental.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
