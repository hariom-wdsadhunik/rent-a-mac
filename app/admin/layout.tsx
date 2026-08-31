import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col md:flex-row font-sans text-gray-100 antialiased">
      {/* Responsive Mobile Header + Admin Sidebar Drawer */}
      <AdminSidebar session={{ name: session.name, email: session.email }} />

      {/* Main Admin Content Viewport */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
