'use client';

import React, { useState, useEffect } from 'react';
import { Grid, Plus, Sparkles, DollarSign, Loader2 } from 'lucide-react';

interface AdminSlotItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  position: string;
  gridArea: string;
  width: number;
  height: number;
  basePrice7Days: number;
  status: string;
}

export default function AdminSlotsPage() {
  const [slots, setSlots] = useState<AdminSlotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState('Center Screen');
  const [gridArea, setGridArea] = useState('custom-area');
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(200);
  const [basePrice7Days, setBasePrice7Days] = useState(99);
  const [status, setStatus] = useState('AVAILABLE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/slots');
      const data = await res.json();
      if (data.slots) {
        setSlots(data.slots);
      }
    } catch (err) {
      console.error('Failed to load slots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          description,
          position,
          gridArea,
          width,
          height,
          basePrice7Days,
          status,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        await fetchSlots();
      }
    } catch (err) {
      console.error('Failed to create slot:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Advertising Slots Manager</h1>
          <p className="text-xs text-gray-400">Configure MacBook advertising inventory, resolution mappings, and base rates.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create New Slot
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-gray-400">Loading inventory slots...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((s) => (
            <div key={s.id} className="p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-bold px-2 py-0.5 rounded bg-gray-800">
                  {s.position}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    s.status === 'AVAILABLE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : s.status === 'OCCUPIED'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{s.name}</h3>
              <p className="text-xs text-gray-400 line-clamp-2">{s.description}</p>

              <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
                <span className="text-gray-400">{s.width}×{s.height}px</span>
                <span className="font-bold text-emerald-400 font-mono">${s.basePrice7Days}/7d</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Create Advertising Slot</h3>
            <form onSubmit={handleCreateSlot} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">Slot Name</label>
                <input
                  type="text"
                  placeholder="e.g. Header Spotlight"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-0]/g, '-'));
                  }}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Slug ID</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value, 10))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value, 10))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Base Price (7 Days USD)</label>
                <input
                  type="number"
                  value={basePrice7Days}
                  onChange={(e) => setBasePrice7Days(parseFloat(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white"
                >
                  {isSubmitting ? 'Saving...' : 'Save Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
