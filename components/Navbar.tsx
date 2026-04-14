'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore, useState, useEffect } from 'react';
import { getCompletedCount } from '@/utils/progress';
import { checkStreak, getGamification } from '@/utils/gamification';
import ProgressRing from './ProgressRing';
import StreakBadge from './StreakBadge';
import XPBar from './XPBar';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export default function Navbar() {
  const pathname = usePathname();
  const completed = useSyncExternalStore(subscribe, getCompletedCount, () => 0);
  const [menuOpen, setMenuOpen] = useState(false);

  const [gam, setGam] = useState({ xp: 0, streak: 0 });
  useEffect(() => {
    checkStreak();
    const g = getGamification();
    setGam({ xp: g.xp, streak: g.streak });
  }, []);
  const xp = gam.xp;
  const streak = gam.streak;

  const links = [
    { href: '/getting-started', label: 'Setup' },
    { href: '/case-studies', label: 'Case Studies' },
    { href: '/build', label: 'Build' },
    { href: '/community', label: 'Community' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg text-gray-900 dark:text-white tracking-tight">
          Claude Code Mastery
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <XPBar xp={xp} size="sm" />
            <StreakBadge streak={streak} />
          </div>
          <div className="flex items-center gap-2">
            <ProgressRing percentage={Math.round((completed / 12) * 100)} size={28} strokeWidth={3} />
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {completed}/12
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-200/50 dark:border-gray-800/50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl">
          <div className="px-6 py-4 space-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block text-sm font-medium ${
                  pathname === link.href ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
