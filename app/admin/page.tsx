import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import {
  Grid,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertTriangle,
  FileText,
  ArrowRight,
  TrendingUp,
  Activity,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  // Compute metrics directly from DB
  const totalSlots = await db.advertisingSlot.count();
  const availableSlots = await db.advertisingSlot.count({ where: { status: 'AVAILABLE' } });
  const reservedSlots = await db.advertisingSlot.count({ where: { status: 'RESERVED' } });
  const activeRentals = await db.rental.count({ where: { status: 'ACTIVE' } });
  const pendingApprovals = await db.rental.count({ where: { status: 'PENDING_REVIEW' } });

  // Calculate total revenue from COMPLETED payments
  const payments = await db.payment.findMany({
    where: { status: 'COMPLETED' },
    select: { amount: true },
  });
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  // Upcoming expirations (active rentals ending within next 7 days)
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const upcomingExpirationsCount = await db.rental.count({
    where: {
      status: 'ACTIVE',
      endDate: {
        gte: new Date(),
        lte: sevenDaysFromNow,
      },
    },
  });

  // Recent activity actions log
  const recentActions = await db.adminAction.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: {
      admin: { select: { name: true, email: true } },
    },
  });

  // Recent rentals
  const recentRentals = await db.rental.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      slot: { select: { name: true, slug: true } },
      advertisement: { select: { title: true, brandName: true } },
      payment: { select: { status: true } },
    },
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Operational Dashboard
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time backend control, metrics, and inventory status for Rent-a-Mac.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/slots"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
          >
            Visual Slot Manager <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total & Available Slots */}
        <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-gray-400">
            <span>Total Inventory Slots</span>
            <Grid className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">{totalSlots}</span>
            <span className="text-xs text-emerald-400 font-semibold">{availableSlots} Available</span>
          </div>
          <p className="text-[11px] text-gray-400 font-mono">
            {reservedSlots} reserved | {totalSlots - availableSlots - reservedSlots} occupied/other
          </p>
        </div>

        {/* Active Rentals */}
        <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-gray-400">
            <span>Active Live Rentals</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-400">{activeRentals}</span>
            <span className="text-xs text-gray-400 font-medium">Currently Displayed</span>
          </div>
          <p className="text-[11px] text-gray-400 font-mono">Live on public MacBook mockup</p>
        </div>

        {/* Pending Approvals */}
        <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-gray-400">
            <span>Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-400">{pendingApprovals}</span>
            {pendingApprovals > 0 ? (
              <Link href="/admin/rentals" className="text-xs text-amber-400 hover:underline font-bold">
                Review Now &rarr;
              </Link>
            ) : (
              <span className="text-xs text-gray-400">All Clear</span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 font-mono">Requires admin sign-off</p>
        </div>

        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-gray-400">
            <span>Total Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white">${totalRevenue.toFixed(2)}</span>
            <span className="text-xs text-blue-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Stripe Verified
            </span>
          </div>
          <p className="text-[11px] text-gray-400 font-mono">{upcomingExpirationsCount} expiring in &lt; 7d</p>
        </div>
      </div>

      {/* Main Content Grid: Recent Rentals & Recent Admin Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Rentals Table (2 Cols) */}
        <div className="lg:col-span-2 bg-gray-900/80 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" /> Recent Campaign Submissions
            </h2>
            <Link href="/admin/rentals" className="text-xs text-blue-400 hover:underline font-semibold">
              View All &rarr;
            </Link>
          </div>

          {recentRentals.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs font-mono">
              No recent rentals recorded in database.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="pb-3">Advertiser</th>
                    <th className="pb-3">Slot</th>
                    <th className="pb-3">Brand / Ad</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium">
                  {recentRentals.map((rental) => (
                    <tr key={rental.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-3">
                        <span className="text-white font-bold block">{rental.userName}</span>
                        <span className="text-gray-400 text-[10px] font-mono">{rental.userEmail}</span>
                      </td>
                      <td className="py-3 text-gray-300 font-mono text-[11px]">{rental.slot.name}</td>
                      <td className="py-3">
                        <span className="text-white block">{rental.advertisement.brandName}</span>
                        <span className="text-gray-400 text-[10px] truncate max-w-[150px] block">
                          {rental.advertisement.title}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-bold text-white">${rental.totalAmount.toFixed(2)}</td>
                      <td className="py-3">
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Admin Activity Feed (1 Col) */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" /> Operational Activity Log
          </h2>

          {recentActions.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-xs font-mono">
              No recent admin actions recorded.
            </div>
          ) : (
            <div className="space-y-3">
              {recentActions.map((action) => (
                <div
                  key={action.id}
                  className="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-blue-400 uppercase tracking-wider text-[10px]">
                      {action.action.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(action.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-200">{action.details || 'No details specified.'}</p>
                  <span className="text-[10px] text-gray-400 block font-mono">
                    By: {action.admin.name} ({action.admin.email})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
