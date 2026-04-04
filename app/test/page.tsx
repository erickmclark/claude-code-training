'use client';

import { useState } from 'react';
import { finalTest } from '@/data/quizzes';
import { TestResult } from '@/types/lesson';
import { saveTestResult } from '@/utils/progress';
import TestCard from '@/components/TestCard';

export default function TestPage() {
  const [started, setStarted] = useState(false);

  const handleComplete = (result: TestResult) => {
    saveTestResult(result);
  };

  if (!started) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="text-6xl mb-6">📝</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Comprehensive Test
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">
          30 questions covering all 12 lessons.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Score 80% or higher to achieve Claude Code Mastery certification.
        </p>
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-10">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">30</div>
            <div className="text-xs text-gray-500">Questions</div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">12</div>
            <div className="text-xs text-gray-500">Topics</div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">80%</div>
            <div className="text-xs text-gray-500">To Pass</div>
          </div>
        </div>
        <button
          onClick={() => setStarted(true)}
          className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg transition-all hover:shadow-lg hover:shadow-blue-500/25"
        >
          Start Test
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Comprehensive Test
      </h1>
      <TestCard questions={finalTest} onComplete={handleComplete} />
    </div>
  );
}
