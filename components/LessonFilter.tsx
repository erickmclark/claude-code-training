'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { LessonSummary } from '@/types/lesson';
import DifficultyBadge from './DifficultyBadge';
import { getCompletedLessonIds } from '@/utils/progress';

interface LessonFilterProps {
  lessons: LessonSummary[];
}

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;

export default function LessonFilter({ lessons }: LessonFilterProps) {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<string>('All');
  const [completedIds] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    return getCompletedLessonIds();
  });

  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      const matchSearch =
        !search ||
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.description.toLowerCase().includes(search.toLowerCase());
      const matchDifficulty = difficulty === 'All' || l.difficulty === difficulty;
      return matchSearch && matchDifficulty;
    });
  }, [lessons, search, difficulty]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search lessons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        <div className="flex gap-2 flex-wrap">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                difficulty === d
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((lesson) => {
          const isCompleted = completedIds.includes(lesson.id);
          return (
            <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
              <div className="group relative bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200 dark:hover:border-blue-800 hover:-translate-y-1 transition-all duration-300">
                {isCompleted && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <div className="text-4xl mb-4">{lesson.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                  {lesson.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                  {lesson.description}
                </p>
                <div className="flex items-center justify-between">
                  <DifficultyBadge difficulty={lesson.difficulty} />
                  <span className="text-xs text-gray-400">{lesson.duration}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No lessons match your filters.</p>
          <button
            onClick={() => { setSearch(''); setDifficulty('All'); }}
            className="mt-2 text-blue-600 text-sm hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
