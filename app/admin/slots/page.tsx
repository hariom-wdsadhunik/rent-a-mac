'use client';

import React, { useState, useEffect } from 'react';
import {
  Grid,
  Plus,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  Ban,
  DollarSign,
  Search,
  Filter,
  X,
  History,
  Laptop,
} from 'lucide-react';

interface SlotData {
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
  calculatedStatus: string;
  impressionsCount: number;
  clicksCount: number;
  totalRentalsCount: number;
  activeRental?: {
    id: string;
    userName: string;
    userEmail: string;
    companyName?: string;
    totalAmount: number;
    endDate: string;
    advertisement: {
      title: string;
      brandName: string;
      targetUrl: string;
      imageUrl: string;
    };
  } | null;
  rentals?: any[];
}

export default function AdminSlotsPage() {
  const [slots, setSlots] = useState<SlotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal States
  const [selectedSlot, setSelectedSlot] = useState<SlotData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    name: '',
    slug: '',
    description: '',
    position: '',
    gridArea: '',
    width: 200,
    height: 100,
    basePrice7Days: 99,
    status: 'AVAILABLE',
  });

  // Create Form State
  const [createFormData, setCreateFormData] = useState({
    name: '',
    slug: '',
    description: '',
    position: 'Screen Center',
    gridArea: 'center-screen',
    width: 300,
    height: 150,
    basePrice7Days: 99,
    status: 'AVAILABLE',
  });

  const [activeTab, setActiveTab] = useState<'DETAILS' | 'HISTORY'>('DETAILS');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Fetch slots from admin API
  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/slots');
      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots || []);
      }
    } catch (err) {
      console.error('Error loading slots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const openEditModal = (slot: SlotData) => {
    setSelectedSlot(slot);
    setEditFormData({
      name: slot.name,
      slug: slot.slug,
      description: slot.description,
      position: slot.position,
      gridArea: slot.gridArea,
      width: slot.width,
      height: slot.height,
      basePrice7Days: slot.basePrice7Days,
      status: slot.calculatedStatus || slot.status,
    });
    setActiveTab('DETAILS');
    setIsEditModalOpen(true);
  };

  const handleUpdateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    try {
      const res = await fetch('/api/admin/slots', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedSlot.id,
          ...editFormData,
        }),
      });

      if (res.ok) {
        setActionMessage('Slot updated successfully!');
        setIsEditModalOpen(false);
        fetchSlots();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to update slot');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating slot');
    }
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createFormData),
      });

      if (res.ok) {
        setActionMessage('New slot created successfully!');
        setIsCreateModalOpen(false);
        setCreateFormData({
          name: '',
          slug: '',
          description: '',
          position: 'Screen Center',
          gridArea: 'center-screen',
          width: 300,
          height: 150,
          basePrice7Days: 99,
          status: 'AVAILABLE',
        });
        fetchSlots();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to create slot');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating slot');
    }
  };

  const handleToggleStatus = async (slot: SlotData) => {
    const newStatus = slot.status === 'DISABLED' ? 'AVAILABLE' : 'DISABLED';
    try {
      const res = await fetch('/api/admin/slots', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: slot.id, status: newStatus }),
      });
      if (res.ok) {
        fetchSlots();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter slots
  const filteredSlots = slots.filter((slot) => {
    const matchesSearch =
      slot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || slot.calculatedStatus === statusFilter || slot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Slot lookup helpers for Visual MacBook Display
  const getSlotBySlug = (slug: string) => slots.find((s) => s.slug === slug);
  const featuredCenter = getSlotBySlug('featured-center') || slots[0];
  const topNotch = getSlotBySlug('top-notch-bar') || slots[1];
  const dockRight = getSlotBySlug('dock-right') || slots[2];
  const trackpad = getSlotBySlug('trackpad-banner') || slots[3];
  const sideLeft = getSlotBySlug('side-left') || slots[4];
  const sideRight = getSlotBySlug('side-right') || slots[5];

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'OCCUPIED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">OCCUPIED</span>;
      case 'PENDING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">PENDING</span>;
      case 'RESERVED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">RESERVED</span>;
      case 'DISABLED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">DISABLED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">AVAILABLE</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Grid className="w-6 h-6 text-indigo-400" /> Advertising Slot Management
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Visual control layout &amp; Inventory pricing parameters for MacBook ad placement zones.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Slot
        </button>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* VISUAL MACBOOK SLOT MANAGER */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Laptop className="w-4 h-4 text-blue-400" /> Interactive Visual Layout Manager
          </h2>
          <span className="text-[11px] text-gray-400 font-mono">
            Click any zone on the MacBook mockup below to inspect or edit slot state
          </span>
        </div>

        {/* Visual MacBook Wireframe Grid */}
        <div className="max-w-3xl mx-auto bg-gray-950 border border-gray-800 rounded-2xl p-4 md:p-6 space-y-4">
          {/* Top Camera Bar Zone */}
          {topNotch && (
            <div
              onClick={() => openEditModal(topNotch)}
              className="p-2 rounded-lg bg-gray-900 border border-dashed border-gray-700 hover:border-blue-400 cursor-pointer transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-400 font-bold">TOP BAR:</span>
                <span className="text-xs font-bold text-white">{topNotch.name}</span>
                <span className="text-[10px] font-mono text-gray-400">(${topNotch.basePrice7Days}/7d)</span>
              </div>
              {getStatusBadge(topNotch.calculatedStatus || topNotch.status)}
            </div>
          )}

          {/* Screen Content Grid */}
          <div className="grid grid-cols-12 gap-3 min-h-[160px]">
            {/* Left Flank */}
            <div className="col-span-3">
              {sideLeft ? (
                <div
                  onClick={() => openEditModal(sideLeft)}
                  className="h-full p-3 rounded-xl bg-gray-900 border border-dashed border-gray-700 hover:border-blue-400 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <span className="text-[10px] font-mono text-gray-400 font-bold block">LEFT FLANK</span>
                  <span className="text-xs font-bold text-white block">{sideLeft.name}</span>
                  {getStatusBadge(sideLeft.calculatedStatus || sideLeft.status)}
                </div>
              ) : (
                <div className="h-full border border-gray-800 rounded-xl flex items-center justify-center text-[10px] text-gray-400 font-mono">
                  Left Side
                </div>
              )}
            </div>

            {/* Featured Center Slot */}
            <div className="col-span-6">
              {featuredCenter ? (
                <div
                  onClick={() => openEditModal(featuredCenter)}
                  className="h-full p-4 rounded-xl bg-gray-900/90 border-2 border-indigo-500/40 hover:border-indigo-400 cursor-pointer transition-all flex flex-col justify-between text-center"
                >
                  <span className="text-[10px] font-mono text-indigo-400 font-bold block uppercase tracking-wider">
                    FEATURED SCREEN CENTER
                  </span>
                  <div>
                    <span className="text-sm font-black text-white block">{featuredCenter.name}</span>
                    <span className="text-xs font-mono text-emerald-400 block">${featuredCenter.basePrice7Days}/7d</span>
                  </div>
                  <div className="flex justify-center">
                    {getStatusBadge(featuredCenter.calculatedStatus || featuredCenter.status)}
                  </div>
                </div>
              ) : (
                <div className="h-full border border-gray-800 rounded-xl flex items-center justify-center text-[10px] text-gray-400 font-mono">
                  Featured Center
                </div>
              )}
            </div>

            {/* Right Flank */}
            <div className="col-span-3">
              {sideRight ? (
                <div
                  onClick={() => openEditModal(sideRight)}
                  className="h-full p-3 rounded-xl bg-gray-900 border border-dashed border-gray-700 hover:border-blue-400 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <span className="text-[10px] font-mono text-gray-400 font-bold block">RIGHT FLANK</span>
                  <span className="text-xs font-bold text-white block">{sideRight.name}</span>
                  {getStatusBadge(sideRight.calculatedStatus || sideRight.status)}
                </div>
              ) : (
                <div className="h-full border border-gray-800 rounded-xl flex items-center justify-center text-[10px] text-gray-400 font-mono">
                  Right Side
                </div>
              )}
            </div>
          </div>

          {/* macOS Dock Slot */}
          {dockRight && (
            <div
              onClick={() => openEditModal(dockRight)}
              className="p-2.5 rounded-xl bg-gray-900 border border-dashed border-gray-700 hover:border-blue-400 cursor-pointer transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-400 font-bold">DOCK AREA:</span>
                <span className="text-xs font-bold text-white">{dockRight.name}</span>
              </div>
              {getStatusBadge(dockRight.calculatedStatus || dockRight.status)}
            </div>
          )}

          {/* Trackpad Slot */}
          {trackpad && (
            <div
              onClick={() => openEditModal(trackpad)}
              className="p-2.5 rounded-xl bg-gray-900/60 border border-dashed border-gray-700 hover:border-blue-400 cursor-pointer transition-all flex items-center justify-between max-w-sm mx-auto"
            >
              <span className="text-[10px] font-mono text-gray-400 font-bold">TRACKPAD:</span>
              <span className="text-xs font-bold text-white">{trackpad.name}</span>
              {getStatusBadge(trackpad.calculatedStatus || trackpad.status)}
            </div>
          )}
        </div>
      </div>

      {/* INVENTORY TABLE & FILTERS */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search slots by name, slug, or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="OCCUPIED">OCCUPIED</option>
              <option value="PENDING">PENDING</option>
              <option value="RESERVED">RESERVED</option>
              <option value="DISABLED">DISABLED</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-gray-400">
            Loading slot inventory database...
          </div>
        ) : filteredSlots.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-gray-400">
            No matching advertising slots found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="pb-3">Slot Name &amp; Slug</th>
                  <th className="pb-3">Position</th>
                  <th className="pb-3">Dimensions</th>
                  <th className="pb-3">Base Rate (7d)</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Impressions / Clicks</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-medium">
                {filteredSlots.map((slot) => {
                  const currentSt = slot.calculatedStatus || slot.status;
                  return (
                    <tr key={slot.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-3.5">
                        <span className="text-white font-bold block">{slot.name}</span>
                        <span className="text-[10px] text-indigo-400 font-mono">slug: {slot.slug}</span>
                      </td>
                      <td className="py-3.5 text-gray-300 font-mono text-[11px]">{slot.position}</td>
                      <td className="py-3.5 text-gray-400 font-mono text-[11px]">
                        {slot.width}px &times; {slot.height}px
                      </td>
                      <td className="py-3.5 font-mono font-bold text-white">${slot.basePrice7Days.toFixed(2)}</td>
                      <td className="py-3.5">{getStatusBadge(currentSt)}</td>
                      <td className="py-3.5 text-gray-400 font-mono text-[11px]">
                        {slot.impressionsCount} views | {slot.clicksCount} clicks
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(slot)}
                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                            title="Manage Slot"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(slot)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              slot.status === 'DISABLED'
                                ? 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/30'
                                : 'bg-red-950/40 hover:bg-red-900 text-red-400 border border-red-500/30'
                            }`}
                            title={slot.status === 'DISABLED' ? 'Enable Slot' : 'Disable Slot'}
                          >
                            {slot.status === 'DISABLED' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT / INSPECT SLOT MODAL */}
      {isEditModalOpen && selectedSlot && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Grid className="w-4 h-4 text-indigo-400" /> Manage Slot: {selectedSlot.name}
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {selectedSlot.id}</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-gray-800 text-xs font-bold text-gray-400">
              <button
                onClick={() => setActiveTab('DETAILS')}
                className={`pb-2.5 px-4 border-b-2 transition-all ${
                  activeTab === 'DETAILS'
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent hover:text-gray-200'
                }`}
              >
                Configuration &amp; Pricing
              </button>
              <button
                onClick={() => setActiveTab('HISTORY')}
                className={`pb-2.5 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'HISTORY'
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent hover:text-gray-200'
                }`}
              >
                <History className="w-3.5 h-3.5" /> Rental History ({selectedSlot.rentals?.length || 0})
              </button>
            </div>

            {/* Tab 1: Configuration Form */}
            {activeTab === 'DETAILS' && (
              <form onSubmit={handleUpdateSlot} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">Slot Name</label>
                    <input
                      type="text"
                      required
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">Slug (Unique)</label>
                    <input
                      type="text"
                      required
                      value={editFormData.slug}
                      onChange={(e) => setEditFormData({ ...editFormData, slug: e.target.value })}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">Position</label>
                    <input
                      type="text"
                      value={editFormData.position}
                      onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value })}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">Grid Area</label>
                    <input
                      type="text"
                      value={editFormData.gridArea}
                      onChange={(e) => setEditFormData({ ...editFormData, gridArea: e.target.value })}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">Base Price (7 Days)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editFormData.basePrice7Days}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, basePrice7Days: parseFloat(e.target.value) })
                      }
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">Width (px)</label>
                    <input
                      type="number"
                      value={editFormData.width}
                      onChange={(e) => setEditFormData({ ...editFormData, width: parseInt(e.target.value, 10) })}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">Height (px)</label>
                    <input
                      type="number"
                      value={editFormData.height}
                      onChange={(e) => setEditFormData({ ...editFormData, height: parseInt(e.target.value, 10) })}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">Status State</label>
                    <select
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="RESERVED">RESERVED</option>
                      <option value="PENDING">PENDING</option>
                      <option value="OCCUPIED">OCCUPIED</option>
                      <option value="DISABLED">DISABLED</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Rental History */}
            {activeTab === 'HISTORY' && (
              <div className="space-y-3 text-xs">
                {!selectedSlot.rentals || selectedSlot.rentals.length === 0 ? (
                  <p className="text-center py-8 text-gray-500 font-mono">No rental history for this slot.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedSlot.rentals.map((r: any) => (
                      <div key={r.id} className="p-3 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
                        <div className="flex items-center justify-between font-bold text-white">
                          <span>{r.advertisement?.brandName || r.userName}</span>
                          <span className="font-mono text-emerald-400">${r.totalAmount.toFixed(2)}</span>
                        </div>
                        <p className="text-[11px] text-gray-400">{r.advertisement?.title}</p>
                        <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono pt-1">
                          <span>
                            {new Date(r.startDate).toLocaleDateString()} &rarr; {new Date(r.endDate).toLocaleDateString()}
                          </span>
                          <span className="uppercase text-indigo-400 font-bold">{r.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE NEW SLOT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" /> Create New Advertising Slot
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Slot Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Top Notch Banner 2"
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Slug (Unique identifier)</label>
                  <input
                    type="text"
                    required
                    placeholder="top-notch-bar-2"
                    value={createFormData.slug}
                    onChange={(e) => setCreateFormData({ ...createFormData, slug: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Detailed description of visibility and target audience..."
                  value={createFormData.description}
                  onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Position</label>
                  <input
                    type="text"
                    required
                    value={createFormData.position}
                    onChange={(e) => setCreateFormData({ ...createFormData, position: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Grid Area</label>
                  <input
                    type="text"
                    required
                    value={createFormData.gridArea}
                    onChange={(e) => setCreateFormData({ ...createFormData, gridArea: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Base Price (7d)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={createFormData.basePrice7Days}
                    onChange={(e) =>
                      setCreateFormData({ ...createFormData, basePrice7Days: parseFloat(e.target.value) })
                    }
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
                >
                  Create Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
