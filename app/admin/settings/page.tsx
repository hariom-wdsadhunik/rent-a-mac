'use client';

import React, { useState } from 'react';
import { Settings, Shield, Bell, CheckCircle2, Key, Database, Server } from 'lucide-react';

export default function AdminSettingsPage() {
  const [autoApprove, setAutoApprove] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-gray-400" /> Platform &amp; System Settings
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Global marketplace policies, approval workflows, Stripe API gateway, and database status.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> System settings saved successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        {/* Marketplace Approval Policies */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" /> Campaign Verification Policy
          </h2>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-950 border border-gray-800">
            <div>
              <span className="text-xs font-bold text-white block">Require Manual Admin Review for New Ads</span>
              <p className="text-[11px] text-gray-400 mt-0.5">
                When enabled, advertisements remain in <code className="text-amber-400">PENDING_REVIEW</code> until an admin approves them.
              </p>
            </div>
            <input
              type="checkbox"
              checked={!autoApprove}
              onChange={(e) => setAutoApprove(!e.target.checked)}
              className="w-4 h-4 accent-blue-500 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-950 border border-gray-800">
            <div>
              <span className="text-xs font-bold text-white block">Email Notifications for New Submissions</span>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Send alert notifications to system admins when a customer places an order or submits creative assets.
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-4 h-4 accent-blue-500 rounded"
            />
          </div>
        </div>

        {/* Infrastructure Info */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" /> Infrastructure &amp; Deployment Topology
          </h2>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
              <span className="text-gray-400 text-[10px] uppercase block">Deployment Platform</span>
              <span className="text-white font-bold block">Cloudflare Workers (`@opennextjs/cloudflare`)</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
              <span className="text-gray-400 text-[10px] uppercase block">Database Provider</span>
              <span className="text-emerald-400 font-bold block">PostgreSQL (Prisma ORM)</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
              <span className="text-gray-400 text-[10px] uppercase block">Payment Gateway</span>
              <span className="text-blue-400 font-bold block">Stripe API (Idempotent Webhooks)</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
              <span className="text-gray-400 text-[10px] uppercase block">Auth Session Strategy</span>
              <span className="text-purple-400 font-bold block">JWT HTTP-Only Secured Cookies</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/20"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
