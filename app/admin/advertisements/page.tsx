'use client';

import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Ban,
  RotateCcw,
  Search,
  Filter,
} from 'lucide-react';

interface AdvertisementData {
  id: string;
  title: string;
  brandName: string;
  targetUrl: string;
  imageUrl: string;
  altText?: string;
  status: string;
  notes?: string;
  createdAt: string;
  rentals: {
    id: string;
    userName: string;
    userEmail: string;
    slot: { name: string };
    payment?: { status: string };
  }[];
}

export default function AdminAdvertisementsPage() {
  const [ads, setAds] = useState<AdvertisementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/advertisements');
      if (res.ok) {
        const data = await res.json();
        setAds(data.advertisements || []);
      }
    } catch (err) {
      console.error('Error fetching ads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/advertisements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        fetchAds();
      }
    } catch (err) {
      console.error('Error updating ad status:', err);
    }
  };

  const filteredAds = ads.filter((ad) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      ad.brandName.toLowerCase().includes(q) ||
      ad.title.toLowerCase().includes(q) ||
      ad.targetUrl.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || ad.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-amber-400" /> Advertisement Review Portal
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Review creative banners, verify target destination URLs, and approve or suspend public ad displays.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by brand name, title, or destination URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING_REVIEW">PENDING_REVIEW</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>
          </div>
        </div>

        {/* Ads Cards Grid */}
        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-gray-400">Loading advertisements...</div>
        ) : filteredAds.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-gray-400">No advertisements found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAds.map((ad) => {
              const primaryRental = ad.rentals[0];
              return (
                <div key={ad.id} className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Creative Banner Preview */}
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 border border-gray-800 group">
                      <img src={ad.imageUrl} alt={ad.altText || ad.title} className="w-full h-full object-cover" />
                      <a
                        href={ad.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-[10px] flex items-center gap-1 font-mono border border-white/20 opacity-90 group-hover:opacity-100 transition-opacity"
                      >
                        Visit <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Ad Details */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-sm">{ad.brandName}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                            ad.status === 'APPROVED'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : ad.status === 'PENDING_REVIEW'
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }`}
                        >
                          {ad.status}
                        </span>
                      </div>
                      <h4 className="text-xs text-gray-300 font-medium mt-1">{ad.title}</h4>
                      <p className="text-[10px] text-gray-500 font-mono mt-1 truncate">{ad.targetUrl}</p>
                    </div>

                    {primaryRental && (
                      <div className="pt-2 border-t border-gray-800/80 text-[10px] text-gray-400 space-y-0.5 font-mono">
                        <span className="block">Target Slot: <strong className="text-white">{primaryRental.slot.name}</strong></span>
                        <span className="block">Advertiser: <strong className="text-white">{primaryRental.userName}</strong> ({primaryRental.userEmail})</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-gray-800 flex items-center justify-end gap-2 text-xs">
                    {ad.status !== 'APPROVED' && (
                      <button
                        onClick={() => handleUpdateStatus(ad.id, 'APPROVED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Approve
                      </button>
                    )}
                    {ad.status === 'APPROVED' && (
                      <button
                        onClick={() => handleUpdateStatus(ad.id, 'SUSPENDED')}
                        className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-400 font-bold text-[10px] flex items-center gap-1"
                      >
                        <Ban className="w-3 h-3" /> Suspend
                      </button>
                    )}
                    {ad.status === 'SUSPENDED' && (
                      <button
                        onClick={() => handleUpdateStatus(ad.id, 'APPROVED')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Restore
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
