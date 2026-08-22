'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('demo@globetrotter.io');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('gt_token', 'demo-jwt-token-2026');
    router.push('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <Compass className="w-12 h-12 text-sky-600 mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-500 text-sm">Log in to manage your multi-city adventures</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
          </div>
        </div>
        <button type="submit" className="w-full py-2.5 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition">Sign In</button>
      </form>
      <div className="mt-6 text-center text-xs text-gray-500">
        Don't have an account? <Link href="/register" className="text-sky-600 font-semibold hover:underline">Create one</Link>
      </div>
    </div>
  );
}
