'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How fast does my advertisement go live after payment?',
      a: 'Once your Stripe payment is confirmed, your rental enters the PENDING_REVIEW state. Our moderation team reviews uploaded creative within 24 hours to ensure brand safety and URL validity. Upon approval, it displays live immediately.',
    },
    {
      q: 'What advertisement formats and image specs are supported?',
      a: 'We accept PNG, JPG, WebP, SVG, and GIF image files up to 5MB. Target URLs must be valid HTTPS links. Specific pixel dimensions for each slot are displayed on the MacBook screen and inventory cards.',
    },
    {
      q: 'Can I edit my ad creative after my rental is live?',
      a: 'Yes! Advertisers can log into their Advertiser Dashboard at any time to submit updated image creative or change the target URL. Updated creative undergoes quick moderation before replacing the active banner.',
    },
    {
      q: 'How does pricing work?',
      a: 'Pricing is server-calculated based on slot tier and duration. We offer 7-day base rentals, 30-day rentals (15% discount), and 90-day rentals (30% discount). Prices are locked at checkout.',
    },
    {
      q: 'What happens if an ad is rejected during moderation?',
      a: 'If an advertisement fails moderation (e.g., due to broken links, invalid image formatting, or policy violations), our team will contact you or issue a full refund to your original payment method.',
    },
    {
      q: 'Can two advertisers rent the same slot for overlapping dates?',
      a: 'No. Our server-side availability engine performs strict date collision checks immediately before checkout session creation, preventing double bookings.',
    },
  ];

  return (
    <section id="faq" className="py-16 border-t border-gray-800/80 bg-gray-950/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-4 h-4" /> Got Questions?
          </div>
          <h2 className="text-3xl font-black text-white sm:text-4xl">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="rounded-2xl bg-gray-900/70 border border-gray-800 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-sm font-bold text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-blue-400' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-gray-300 leading-relaxed border-t border-gray-800/60 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
