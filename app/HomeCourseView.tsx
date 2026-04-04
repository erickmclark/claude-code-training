'use client';

import { useState } from 'react';
import Link from 'next/link';
import { modules, isModuleUnlocked } from '@/data/modules';
import { getProgress, getCompletedLessonIds } from '@/utils/progress';
import { getGamification } from '@/utils/gamification';
import ModuleCard from '@/components/ModuleCard';
import XPBar from '@/components/XPBar';
import StreakBadge from '@/components/StreakBadge';

export default function HomeCourseView() {
  const [data] = useState(() => {
    if (typeof window === 'undefined') return null;
    const progress = getProgress();
    const gam = getGamification();
    const completedLessons = getCompletedLessonIds();
    return { progress, gam, completedLessons };
  });

  if (!data) return null;

  const { gam, completedLessons } = data;

  const activeModuleId = modules.find((m) => {
    const done = m.lessons.filter((id) => completedLessons.includes(id)).length;
    return done < m.lessons.length && isModuleUnlocked(m.id, completedLessons);
  })?.id ?? 1;

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <XPBar xp={gam.xp} size="sm" />
            <StreakBadge streak={gam.streak} />
          </div>
          <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
            View Dashboard →
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Your Course Progress
        </h2>

        <div className="space-y-4">
          {modules.map((mod) => {
            const completedTasks = mod.lessons.filter((id) => completedLessons.includes(id)).length;
            const unlocked = isModuleUnlocked(mod.id, completedLessons);
            return (
              <ModuleCard
                key={mod.id}
                module={mod}
                completedTasks={completedTasks}
                isUnlocked={unlocked}
                isActive={mod.id === activeModuleId}
              />
            );
          })}

          <div className={`rounded-2xl p-6 border ${
            completedLessons.length >= 12
              ? 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800'
              : 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 opacity-50'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{completedLessons.length >= 12 ? '📝' : '🔒'}</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Final Exam</h3>
                <p className="text-xs text-gray-500">
                  {completedLessons.length >= 12
                    ? '30 questions — score 80%+ for certification'
                    : 'Complete all 4 modules to unlock'}
                </p>
              </div>
              {completedLessons.length >= 12 && (
                <Link href="/test" className="ml-auto px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors">
                  Take Exam
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
