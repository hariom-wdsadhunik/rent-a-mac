'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Eye, MousePointerClick, DollarSign, Award, Percent } from 'lucide-react';

interface AnalyticsData {
  summary: {
    totalImpressions: number;
    totalClicks: number;
    avgCTR: string;
    totalRevenue: number;
    completedRentalsCount: number;
  };
  topSlots: {
    id: string;
    name: string;
    slug: string;
    impressions: number;
    clicks: number;
    ctr: string;
    basePrice: number;
  }[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/analytics');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-rose-400" /> Operational Inventory Analytics
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real tracking data from database: impressions, click-through performance, inventory occupancy rate, and gross earnings.
          </p>
        </div>
      </div>

      {loading || !data ? (
        <div className="py-20 text-center text-xs font-mono text-gray-400">Loading analytics engine...</div>
      ) : (
        <>
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-gray-400">
                <span>Total Ad Impressions</span>
                <Eye className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-3xl font-black text-white">{data.summary.totalImpressions.toLocaleString()}</span>
              <p className="text-[11px] text-gray-400 font-mono">Public MacBook impressions</p>
            </div>

            <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-gray-400">
                <span>Total Ad Clicks</span>
                <MousePointerClick className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-3xl font-black text-emerald-400">{data.summary.totalClicks.toLocaleString()}</span>
              <p className="text-[11px] text-gray-400 font-mono">Outbound website clicks</p>
            </div>

            <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-gray-400">
                <span>Average CTR</span>
                <Percent className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-3xl font-black text-amber-400">{data.summary.avgCTR}</span>
              <p className="text-[11px] text-gray-400 font-mono">Click-Through Rate</p>
            </div>

            <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-gray-400">
                <span>Completed Orders</span>
                <Award className="w-4 h-4 text-rose-400" />
              </div>
              <span className="text-3xl font-black text-white">{data.summary.completedRentalsCount}</span>
              <p className="text-[11px] text-gray-400 font-mono">${data.summary.totalRevenue.toFixed(2)} total revenue</p>
            </div>
          </div>

          {/* Top Performing Slots Ranking Table */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-400" /> Slot Engagement Leaderboard
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="pb-3">Rank &amp; Slot Name</th>
                    <th className="pb-3">Base Price (7d)</th>
                    <th className="pb-3">Total Impressions</th>
                    <th className="pb-3">Total Clicks</th>
                    <th className="pb-3">Click-Through Rate</th>
                    <th className="pb-3 text-right">Performance Bar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-medium">
                  {data.topSlots.map((slot, index) => (
                    <tr key={slot.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-3.5">
                        <span className="text-white font-bold block">
                          #{index + 1} {slot.name}
                        </span>
                        <span className="text-gray-400 text-[10px] font-mono">{slot.slug}</span>
                      </td>
                      <td className="py-3.5 font-mono text-gray-300">${slot.basePrice.toFixed(2)}</td>
                      <td className="py-3.5 font-mono text-white">{slot.impressions.toLocaleString()}</td>
                      <td className="py-3.5 font-mono text-emerald-400 font-bold">{slot.clicks.toLocaleString()}</td>
                      <td className="py-3.5 font-mono text-amber-400 font-bold">{slot.ctr}</td>
                      <td className="py-3.5 text-right w-36">
                        <div className="w-full bg-gray-950 rounded-full h-2 overflow-hidden border border-gray-800">
                          <div
                            className="bg-rose-500 h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                100,
                                data.summary.totalClicks > 0
                                  ? (slot.clicks / data.summary.totalClicks) * 100
                                  : 0
                              )}%`,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
