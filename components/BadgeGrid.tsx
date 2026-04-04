'use client';

import { ALL_BADGES } from '@/utils/gamification';

interface BadgeGridProps {
  earned: string[];
}

export default function BadgeGrid({ earned }: BadgeGridProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {ALL_BADGES.map((badge) => {
        const isEarned = earned.includes(badge.id);
        return (
          <div
            key={badge.id}
            className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
              isEarned
                ? 'bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-800'
                : 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 opacity-40'
            }`}
            title={badge.criteria}
          >
            <span className="text-2xl mb-1">{badge.icon}</span>
            <span className="text-xs font-medium text-gray-900 dark:text-white leading-tight">
              {badge.name}
            </span>
            {!isEarned && (
              <span className="text-[10px] text-gray-400 mt-0.5">🔒</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
