'use client';

import { getLevel, getLevelProgress } from '@/utils/gamification';

interface XPBarProps {
  xp: number;
  size?: 'sm' | 'lg';
}

export default function XPBar({ xp, size = 'lg' }: XPBarProps) {
  const level = getLevel(xp);
  const progress = getLevelProgress(xp);

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">
          Lv.{level.level}
        </span>
        <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progress.progressPercent}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-2xl font-bold text-blue-600">Level {level.level}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">{level.title}</span>
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-white">{xp} XP</span>
      </div>
      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-700"
          style={{ width: `${progress.progressPercent}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-2">
        {progress.nextLevel
          ? `${progress.xpToNext} XP to Level ${progress.nextLevel}`
          : 'Max level reached!'}
      </p>
    </div>
  );
}
