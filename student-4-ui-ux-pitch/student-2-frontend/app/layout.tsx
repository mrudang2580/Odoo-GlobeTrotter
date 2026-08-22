import React from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'GlobeTrotter — Multi-City Travel Planning Platform',
  description: 'Empowering personalized travel planning with intelligent itineraries and automatic budgeting.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-gray-900 antialiased min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
