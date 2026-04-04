import Link from 'next/link';
import { Module } from '@/types/lesson';
import ProgressBar from './ProgressBar';

interface ModuleCardProps {
  module: Module;
  completedTasks: number;
  isUnlocked: boolean;
  isActive: boolean;
}

export default function ModuleCard({
  module: mod,
  completedTasks,
  isUnlocked,
  isActive,
}: ModuleCardProps) {
  const totalTasks = mod.lessons.length;
  const progressPct = Math.round((completedTasks / totalTasks) * 100);
  const isComplete = completedTasks === totalTasks;

  if (!isUnlocked) {
    return (
      <div className="rounded-2xl p-6 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 opacity-50">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🔒</span>
          <div>
            <h3 className="font-semibold text-gray-500 dark:text-gray-500">
              Module {mod.id}: {mod.title}
            </h3>
            <p className="text-xs text-gray-400">Complete previous module to unlock</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/modules/${mod.id}`}>
      <div
        className={`rounded-2xl p-6 border transition-all hover:shadow-lg hover:-translate-y-0.5 ${
          isComplete
            ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
            : isActive
            ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{mod.icon}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Module {mod.id}: {mod.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{mod.description}</p>
          </div>
          {isComplete && (
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
        <ProgressBar percentage={progressPct} />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">
            {completedTasks}/{totalTasks} tasks
          </span>
          <span className="text-xs text-blue-600 font-medium">
            150 XP
          </span>
        </div>
        {isActive && !isComplete && (
          <div className="mt-3 text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-medium">
              Continue →
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
