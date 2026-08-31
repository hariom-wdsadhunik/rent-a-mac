'use client';

import React from 'react';
import Link from 'next/link';
import { Laptop, Shield, Sparkles, UserCheck } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
              Rent-a-Mac
            </span>
            <span className="hidden sm:inline-block text-[10px] text-gray-400 font-mono ml-2 px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700">
              Billboard Marketplace
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-300">
          <a href="#macbook-display" className="hover:text-white transition-colors">
            Interactive MacBook
          </a>
          <a href="#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#spots-inventory" className="hover:text-white transition-colors">
            Inventory & Pricing
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-all border border-gray-800"
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            Portal Login
          </Link>
          <a
            href="#macbook-display"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Rent Your Spot
          </a>
        </div>
      </div>
    </header>
  );
}
