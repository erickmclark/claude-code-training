'use client';

import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('./Navbar'), {
  ssr: false,
  loading: () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="font-semibold text-lg text-gray-900 dark:text-white tracking-tight">
          Claude Code Mastery
        </span>
      </div>
    </nav>
  ),
});

export default function NavbarLoader() {
  return <Navbar />;
}
