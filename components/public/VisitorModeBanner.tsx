'use client';

import React from 'react';
import { Laptop, Info, ArrowRight, Eye, HelpCircle } from 'lucide-react';

export function VisitorModeBanner() {
  return (
    <div className="block md:hidden max-w-4xl mx-auto px-4 mb-6">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-gray-900 border border-blue-500/30 text-left space-y-3 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Laptop className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white tracking-tight">
            You&apos;re viewing Rent-a-Mac in Visitor Mode.
          </span>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          Explore the MacBook, discover available advertising spots, and see how it works.
        </p>

        <div className="p-3 rounded-xl bg-gray-950/80 border border-gray-800 text-[11px] text-gray-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-white">Want to rent an advertising spot?</strong> Open Rent-a-Mac on a PC or laptop for the full interactive advertising workspace.
          </span>
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          <a
            href="#macbook-display"
            className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> View the MacBook
          </a>
          <a
            href="#how-it-works"
            className="flex-1 py-2.5 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 font-semibold text-xs text-center flex items-center justify-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" /> How Renting Works
          </a>
        </div>
      </div>
    </div>
  );
}
