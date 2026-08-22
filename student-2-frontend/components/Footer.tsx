import React from 'react';
import Link from 'next/link';
import { Compass, Heart, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900">GlobeTrotter</span>
              <p className="text-xs text-slate-500">Personalized Multi-City Travel Planning Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-600">
            <Link href="/" className="hover:text-sky-600">Dashboard</Link>
            <Link href="/trips" className="hover:text-sky-600">My Trips</Link>
            <Link href="/cities" className="hover:text-sky-600">Cities</Link>
            <Link href="/activities" className="hover:text-sky-600">Activities</Link>
            <Link href="/admin" className="hover:text-sky-600">Admin</Link>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Built for Odoo Hackathon 2026</span>
            <a
              href="https://github.com/mrudang2580/Odoo-GlobeTrotter"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
