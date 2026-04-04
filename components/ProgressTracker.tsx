'use client';

import { useEffect, useState } from 'react';
import { getProgress, getCompletionPercentage, getCompletedCount } from '@/utils/progress';

interface ProgressTrackerProps {
  variant?: 'compact' | 'full';
}

export default function ProgressTracker({ variant = 'full' }: ProgressTrackerProps) {
  const [percentage, setPercentage] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPercentage(getCompletionPercentage());
    setCompleted(getCompletedCount());
  }, []);

  if (!mounted) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-slate-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-slate-400 whitespace-nowrap">
          {completed}/12 lessons
        </span>
      </div>
    );
  }

  const progress = getProgress();

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Your Progress</h3>
        <span className="text-2xl font-bold text-blue-400">{percentage}%</span>
      </div>

      <div className="bg-slate-700 rounded-full h-3 mb-4">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((id) => {
          const lessonProgress = progress.lessons[id];
          const isComplete = lessonProgress?.completed;
          return (
            <div
              key={id}
              className={`text-center p-2 rounded-lg text-sm font-medium ${
                isComplete
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'bg-slate-700/50 text-slate-400 border border-slate-600'
              }`}
            >
              {isComplete ? '✓' : ''} L{id}
            </div>
          );
        })}
      </div>

      <p className="text-sm text-slate-400 mt-4">
        {completed === 0
          ? 'Start your first lesson to begin tracking progress!'
          : completed === 12
          ? 'Congratulations! You\'ve completed all lessons!'
          : `${completed} of 12 lessons completed. Keep going!`}
      </p>
    </div>
  );
}
