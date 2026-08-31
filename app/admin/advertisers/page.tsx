'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Ban, CheckCircle2, Globe, Building } from 'lucide-react';

interface AdvertiserData {
  id: string;
  name: string;
  email: string;
  company?: string;
  website?: string;
  role: string;
  status: string;
  createdAt: string;
  totalRentals: number;
  activeRentals: number;
  totalSpending: number;
}

export default function AdminAdvertisersPage() {
  const [advertisers, setAdvertisers] = useState<AdvertiserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAdvertisers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/advertisers');
      if (res.ok) {
        const data = await res.json();
        setAdvertisers(data.advertisers || []);
      }
    } catch (err) {
      console.error('Error fetching advertisers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisers();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    try {
      const res = await fetch('/api/admin/advertisers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        fetchAdvertisers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = advertisers.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.company && u.company.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" /> Advertiser Accounts Management
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Directory of registered advertisers, spending history, active campaigns, and account standing.
          </p>
        </div>
      </div>

      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 space-y-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-gray-400">Loading advertiser accounts...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-gray-400">No advertisers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="pb-3">Advertiser Profile</th>
                  <th className="pb-3">Company &amp; Website</th>
                  <th className="pb-3">Total Campaigns</th>
                  <th className="pb-3">Active Campaigns</th>
                  <th className="pb-3">Lifetime Spend</th>
                  <th className="pb-3">Account Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-3.5">
                      <span className="text-white font-bold block">{u.name}</span>
                      <span className="text-gray-400 text-[10px] font-mono">{u.email}</span>
                    </td>
                    <td className="py-3.5">
                      <span className="text-gray-200 block">{u.company || '—'}</span>
                      {u.website ? (
                        <a
                          href={u.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-400 text-[10px] font-mono hover:underline flex items-center gap-1"
                        >
                          <Globe className="w-3 h-3" /> {u.website}
                        </a>
                      ) : (
                        <span className="text-[10px] text-gray-500 font-mono">No website set</span>
                      )}
                    </td>
                    <td className="py-3.5 font-mono text-gray-300">{u.totalRentals}</td>
                    <td className="py-3.5 font-mono text-emerald-400 font-bold">{u.activeRentals}</td>
                    <td className="py-3.5 font-mono font-bold text-white">${u.totalSpending.toFixed(2)}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                          u.status === 'SUSPENDED'
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleToggleStatus(u.id, u.status)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          u.status === 'SUSPENDED'
                            ? 'bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-400'
                            : 'bg-red-950/40 hover:bg-red-900 border border-red-500/30 text-red-400'
                        }`}
                      >
                        {u.status === 'SUSPENDED' ? 'Restore Account' : 'Suspend Account'}
                      </button>
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
