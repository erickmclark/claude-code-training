'use client';

import { useEffect, useState } from 'react';
import { getCompletedCount, getProgress } from '@/utils/progress';

export default function Certificate() {
  const [completed, setCompleted] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCompleted(getCompletedCount());
  }, []);

  if (!mounted || completed < 12) {
    return (
      <div className="bg-slate-800/30 rounded-xl border border-dashed border-slate-600 p-8 text-center">
        <div className="text-4xl mb-4">🏅</div>
        <h3 className="text-xl font-bold text-slate-400 mb-2">Certificate of Mastery</h3>
        <p className="text-slate-500">
          Complete all 12 lessons to unlock your certificate.
        </p>
        <p className="text-slate-500 mt-2">
          {completed}/12 lessons completed
        </p>
      </div>
    );
  }

  const progress = getProgress();
  const avgScore = Math.round(
    Object.values(progress.lessons).reduce((sum, l) => sum + (l.quizScore || 0), 0) / 12
  );

  return (
    <div className="bg-gradient-to-br from-yellow-500/10 via-amber-500/10 to-orange-500/10 rounded-xl border-2 border-yellow-500/30 p-8 text-center">
      <div className="text-6xl mb-4">🏆</div>
      <h3 className="text-2xl font-bold text-yellow-300 mb-2">Certificate of Mastery</h3>
      <div className="w-24 h-0.5 bg-yellow-500/50 mx-auto mb-4" />
      <p className="text-white text-lg mb-1">Claude Code Mastery Program</p>
      <p className="text-slate-300 mb-4">All 12 Lessons Completed</p>
      <div className="flex justify-center gap-8 mb-6">
        <div>
          <div className="text-2xl font-bold text-yellow-300">12/12</div>
          <div className="text-xs text-slate-400">Lessons</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-yellow-300">{avgScore}%</div>
          <div className="text-xs text-slate-400">Avg Score</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-yellow-300">10x</div>
          <div className="text-xs text-slate-400">Faster</div>
        </div>
      </div>
      <p className="text-sm text-slate-400">
        Completed on {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
