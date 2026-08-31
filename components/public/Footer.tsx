'use client';

import React from 'react';
import Link from 'next/link';
import { Laptop, Shield, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black py-12 text-xs text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-black text-white block">Rent-a-Mac</span>
            <span className="text-[11px] text-gray-400">Rent a spot on the internet’s MacBook</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400 font-medium">
          <a href="#macbook-display" className="hover:text-white transition-colors">MacBook Showcase</a>
          <a href="#spots-inventory" className="hover:text-white transition-colors">Inventory Slots</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing Rates</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          <Link href="/login" className="hover:text-white transition-colors flex items-center gap-1">
            <Shield className="w-3 h-3 text-blue-400" /> Admin Portal
          </Link>
        </div>

        <div className="text-center md:text-right text-[11px] text-gray-400">
          <p>© {new Date().getFullYear()} Rent-a-Mac Platform. All rights reserved.</p>
          <p className="mt-1 flex items-center justify-center md:justify-end gap-1">
            Engineered with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for digital advertisers.
          </p>
        </div>
      </div>
    </footer>
  );
}
