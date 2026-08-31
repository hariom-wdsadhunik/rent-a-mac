'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, ArrowRight, Laptop, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (data.user?.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/advertiser');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdmin = () => {
    setEmail('admin@rent-a-mac.com');
    setPassword('AdminPassword123!');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center space-y-3 mb-8">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-white">Portal Access Login</h1>
        <p className="text-xs text-gray-400">Sign in to manage advertisements, approve rentals, or edit inventory.</p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
            <input
              type="email"
              placeholder="admin@rent-a-mac.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
            </>
          ) : (
            <>
              Sign In <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Demo Admin Quick Credentials Pill */}
        <div className="pt-4 border-t border-gray-800 text-center">
          <span className="text-[11px] text-gray-400 block mb-2">Development / Admin Access</span>
          <button
            type="button"
            onClick={handleQuickAdmin}
            className="w-full py-2 px-3 rounded-lg bg-gray-950 hover:bg-gray-800 border border-gray-800 text-[11px] font-mono text-blue-400 transition-colors"
          >
            Fill Admin Credentials (admin@rent-a-mac.com)
          </button>
        </div>
      </form>

      <div className="text-center mt-6 text-xs text-gray-500">
        <Link href="/" className="hover:text-white transition-colors">← Return to Homepage</Link>
      </div>
    </div>
  );
}
