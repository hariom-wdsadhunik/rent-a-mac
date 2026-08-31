import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';

export const metadata: Metadata = {
  title: "Rent-a-Mac — Rent a spot on the internet's MacBook",
  description: 'The premier advertising marketplace to rent high-visibility ad space on a virtual MacBook interface. Simple duration discounts, instant checkout, and guaranteed brand safety.',
  keywords: [
    'Rent advertising space',
    'Rent a website advertising spot',
    'Digital advertising space',
    'MacBook advertising',
    'Ad space marketplace',
  ],
  authors: [{ name: 'Rent-a-Mac' }],
  openGraph: {
    title: "Rent-a-Mac — Rent a spot on the internet's MacBook",
    description: 'Rent advertising space on a virtual MacBook mockup. Put your brand in front of thousands of daily tech enthusiasts.',
    type: 'website',
    url: 'https://rent-a-mac.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Rent-a-Mac — Internet's MacBook Advertising Platform",
    description: 'Claim your spot on the internet’s MacBook billboard.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
