import React from 'react';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { ShieldCheck, Clock, ExternalLink, Sparkles, AlertCircle, Laptop } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

async function getAdvertiserRentals(userEmail: string) {
  return db.rental.findMany({
    where: { userEmail },
    orderBy: { createdAt: 'desc' },
    include: {
      slot: true,
      advertisement: true,
      payment: true,
    },
  });
}

export default async function AdvertiserDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const rentals = await getAdvertiserRentals(session.email);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Advertiser Portal</span>
          <h1 className="text-3xl font-black text-white mt-1">Welcome back, {session.name}</h1>
          <p className="text-xs text-gray-400">Track your active campaigns, check review status, and inspect placement dates.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#macbook-display"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <Laptop className="w-4 h-4" /> Rent Another Spot
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-gray-900 border border-gray-800 transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {rentals.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-gray-900 border border-gray-800 space-y-4">
          <Sparkles className="w-10 h-10 text-blue-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Rentals Registered Yet</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            You don&apos;t have any active or pending ad rentals associated with {session.email}. Select a spot on the MacBook to start your first campaign!
          </p>
          <div>
            <Link
              href="/#macbook-display"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all"
            >
              Explore Available Spots →
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Your Campaign History &amp; Active Slots</h2>

          <div className="grid grid-cols-1 gap-4">
            {rentals.map((r) => {
              const isActive = r.status === 'ACTIVE';
              const isPending = r.status === 'PENDING_REVIEW';
              const isRejected = r.status === 'REJECTED';

              return (
                <div
                  key={r.id}
                  className="p-6 rounded-2xl bg-gray-900 border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    {/* eslint-disable-next-html-element-suppression */}
                    <img
                      src={r.advertisement.imageUrl}
                      alt={r.advertisement.brandName}
                      className="w-16 h-16 object-cover rounded-xl border border-gray-700 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{r.advertisement.brandName}</h3>
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

                      <p className="text-xs text-gray-300 font-medium">{r.advertisement.title}</p>
                      <a
                        href={r.advertisement.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline"
                      >
                        {r.advertisement.targetUrl} <ExternalLink className="w-3 h-3" />
                      </a>

                      <div className="pt-2 flex flex-wrap gap-4 text-[11px] text-gray-400">
                        <span>Slot: <strong className="text-white">{r.slot.name} ({r.slot.position})</strong></span>
                        <span>Duration: <strong className="text-white">{r.durationDays} Days</strong></span>
                        <span>Window: <strong className="text-white">{r.startDate.toISOString().split('T')[0]} to {r.endDate.toISOString().split('T')[0]}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right border-t md:border-t-0 border-gray-800 pt-4 md:pt-0 shrink-0">
                    <span className="text-[10px] text-gray-500 uppercase block">Amount Paid</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">${r.totalAmount.toFixed(2)}</span>
                    <span className="text-[10px] text-gray-400 block mt-1">Payment Status: {r.payment?.status || 'COMPLETED'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
