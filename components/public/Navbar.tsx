'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Laptop, Shield, Sparkles, Menu, X } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-300">
          <a href="#macbook-display" className="hover:text-white transition-colors">
            Interactive MacBook
          </a>
          <a href="#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#spots-inventory" className="hover:text-white transition-colors">
            Available Spots
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
        </nav>

        {/* Desktop Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
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

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-red-400" /> : <Menu className="w-5 h-5 text-blue-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay (Marketing & Information Links Only) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-800 bg-gray-950 p-4 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3 text-xs font-semibold text-gray-300">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-gray-900 hover:text-white"
            >
              Home
            </Link>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-gray-900 hover:text-white"
            >
              How It Works
            </a>
            <a
              href="#why-advertise"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-gray-900 hover:text-white"
            >
              Why Advertise
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-gray-900 hover:text-white"
            >
              FAQ
            </a>
          </nav>

          <div className="pt-3 border-t border-gray-800 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-gray-300 bg-gray-900 border border-gray-800"
            >
              <Shield className="w-4 h-4 text-blue-400" /> Admin / Advertiser Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
