import React from 'react';
import Link from 'next/link';
import { Compass, PlusCircle, User, LayoutDashboard, Search, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-sky-600">
          <Compass className="w-7 h-7 text-amber-500 animate-spin-slow" />
          <span>GlobeTrotter</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/dashboard" className="hover:text-sky-600 flex items-center gap-1.5"><LayoutDashboard className="w-4 h-4" /> Dashboard</Link>
          <Link href="/trips" className="hover:text-sky-600">My Trips</Link>
          <Link href="/search/cities" className="hover:text-sky-600 flex items-center gap-1.5"><Search className="w-4 h-4" /> Discover</Link>
          <Link href="/community" className="hover:text-sky-600">Community</Link>
          <Link href="/admin" className="hover:text-sky-600 text-xs px-2 py-1 bg-gray-100 rounded flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> Admin</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/trips/new" className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm font-medium flex items-center gap-1.5 shadow-sm">
            <PlusCircle className="w-4 h-4" /> Plan New Trip
          </Link>
          <Link href="/profile" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:ring-2 hover:ring-sky-500">
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
