'use client';

import Link from 'next/link';
import CertificateGenerator from '@/components/CertificateGenerator';

export default function CertificatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-slate-700 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-white hover:text-blue-400 transition-colors flex items-center gap-2">
              <span>&larr;</span>
              <span className="font-semibold">Claude Code Mastery</span>
            </Link>
            <h1 className="text-lg font-bold text-white">Certificate</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CertificateGenerator />

        <div className="mt-12 pt-8 border-t border-slate-700 flex justify-between">
          <Link href="/assessments" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            <span>&larr;</span> Assessment Dashboard
          </Link>
          <Link href="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            Home <span>&rarr;</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
