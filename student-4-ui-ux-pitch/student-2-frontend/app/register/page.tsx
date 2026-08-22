'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="max-w-xl mx-auto my-8 p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Traveler Profile</h1>
      <p className="text-gray-500 text-sm mb-6">Join GlobeTrotter to plan and budget multi-city trips.</p>
      <form onSubmit={handleRegister} className="grid grid-cols-2 gap-4 text-sm">
        <div className="col-span-1">
          <label className="block font-medium text-gray-700 mb-1">First Name</label>
          <input className="w-full p-2 border rounded-lg" defaultValue="Alex" required />
        </div>
        <div className="col-span-1">
          <label className="block font-medium text-gray-700 mb-1">Last Name</label>
          <input className="w-full p-2 border rounded-lg" defaultValue="Wanderer" required />
        </div>
        <div className="col-span-2">
          <label className="block font-medium text-gray-700 mb-1">Email</label>
          <input type="email" className="w-full p-2 border rounded-lg" defaultValue="alex@wanderer.io" required />
        </div>
        <div className="col-span-1">
          <label className="block font-medium text-gray-700 mb-1">City</label>
          <input className="w-full p-2 border rounded-lg" defaultValue="San Francisco" />
        </div>
        <div className="col-span-1">
          <label className="block font-medium text-gray-700 mb-1">Country</label>
          <input className="w-full p-2 border rounded-lg" defaultValue="USA" />
        </div>
        <div className="col-span-2 mt-4">
          <button type="submit" className="w-full py-2.5 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700">Complete Registration</button>
        </div>
      </form>
      <p className="text-center text-xs text-gray-500 mt-4">Already registered? <Link href="/login" className="text-sky-600 font-semibold">Log In</Link></p>
    </div>
  );
}
