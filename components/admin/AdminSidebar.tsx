'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  LayoutDashboard,
  FileText,
  Grid,
  CreditCard,
  Users,
  Image as ImageIcon,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  session: {
    name: string;
    email: string;
  };
}

export function AdminSidebar({ session }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard, color: 'text-blue-400' },
    { href: '/admin/slots', label: 'Visual Slot Manager', icon: Grid, color: 'text-indigo-400' },
    { href: '/admin/rentals', label: 'Rentals', icon: FileText, color: 'text-emerald-400' },
    { href: '/admin/advertisements', label: 'Advertisements', icon: ImageIcon, color: 'text-amber-400' },
    { href: '/admin/advertisers', label: 'Advertisers', icon: Users, color: 'text-purple-400' },
    { href: '/admin/payments', label: 'Payments', icon: CreditCard, color: 'text-cyan-400' },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, color: 'text-rose-400' },
    { href: '/admin/settings', label: 'Settings', icon: Settings, color: 'text-gray-400' },
  ];

  return (
    <>
      {/* Mobile Top Header Bar (Visible on <768px screens) */}
      <div className="md:hidden bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Rent-a-Mac Admin</span>
            <span className="text-[9px] text-gray-400 font-mono">Control Center</span>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-gray-950 border border-gray-800 text-gray-300 hover:text-white"
          aria-label="Toggle Admin Navigation"
        >
          {mobileOpen ? <X className="w-5 h-5 text-red-400" /> : <Menu className="w-5 h-5 text-blue-400" />}
        </button>
      </div>

      {/* Desktop Sidebar + Mobile Drawer Panel */}
      <aside
        className={`${
          mobileOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-gray-900/95 border-r border-gray-800 p-5 flex flex-col justify-between shrink-0 sticky top-0 h-auto md:h-screen z-30`}
      >
        <div className="space-y-6">
          {/* Admin Desktop Header Branding */}
          <div className="hidden md:flex items-center gap-3 pb-4 border-b border-gray-800/80">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white tracking-wide block">Rent-a-Mac</span>
              <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Control Center</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold text-gray-400">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-gray-800/80 hover:text-white transition-all group"
                >
                  <Icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="pt-5 border-t border-gray-800/80 space-y-3 mt-6 md:mt-0">
          <div className="flex items-center justify-between text-xs bg-gray-950/60 p-2.5 rounded-xl border border-gray-800/60">
            <div className="truncate pr-2">
              <span className="text-white font-bold block truncate">{session.name}</span>
              <span className="text-[10px] text-gray-400 font-mono truncate">{session.email}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
              ADMIN
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 text-[11px] font-medium text-gray-400 hover:text-white flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-950/80 border border-gray-800 hover:border-gray-700 transition-all"
            >
              Public Site <ExternalLink className="w-3 h-3" />
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 text-[11px] font-semibold flex items-center gap-1.5 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
