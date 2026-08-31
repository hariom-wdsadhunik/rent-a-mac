import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Shield, LayoutDashboard, FileText, Grid, ShoppingBag, LogOut, ExternalLink } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col md:flex-row">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Admin Header Branding */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black text-white block">Rent-a-Mac</span>
              <span className="text-[10px] text-gray-400 font-mono uppercase">Admin Control Panel</span>
            </div>
          </div>

          {/* Admin Navigation */}
          <nav className="space-y-1 text-xs font-semibold text-gray-400">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-gray-800 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              Overview &amp; Metrics
            </Link>
            <Link
              href="/admin/rentals"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              Rentals &amp; Approvals
            </Link>
            <Link
              href="/admin/slots"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Grid className="w-4 h-4 text-indigo-400" />
              Advertising Slots
            </Link>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="pt-6 border-t border-gray-800 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-white font-bold block truncate">{session.name}</span>
              <span className="text-[10px] text-gray-400 font-mono truncate">{session.email}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              ADMIN
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 text-[11px] text-gray-400 hover:text-white flex items-center justify-center gap-1 py-1.5 rounded-lg bg-gray-950 border border-gray-800"
            >
              View Site <ExternalLink className="w-3 h-3" />
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 text-[11px] font-semibold flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" /> Logout
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Viewport */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
