'use client';

import { useState } from 'react';
import Link from 'next/link';
import AssessmentDashboard from '@/components/AssessmentDashboard';
import ModuleExam from '@/components/ModuleExam';
import FinalExam from '@/components/FinalExam';
import { moduleExams } from '@/data/exams';
import { ExamResult } from '@/types/assessment';
import { saveExamResult, isModule1Ready, isModule2Ready, isFinalExamReady } from '@/utils/assessment';

type ExamView = 'dashboard' | 'module-1' | 'module-2' | 'final';

export default function AssessmentsPage() {
  const [view, setView] = useState<ExamView>('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleExamComplete = (examId: string) => (result: ExamResult) => {
    saveExamResult(examId, result);
    setRefreshKey(prev => prev + 1);
    setView('dashboard');
  };

  const module1 = moduleExams.find(e => e.id === 'module-1')!;
  const module2 = moduleExams.find(e => e.id === 'module-2')!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-slate-700 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-white hover:text-blue-400 transition-colors flex items-center gap-2">
              <span>&larr;</span>
              <span className="font-semibold">Claude Code Mastery</span>
            </Link>
            <h1 className="text-lg font-bold text-white">Assessments</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Assessment Center</h2>
              <p className="text-slate-300">Track your progress, take exams, and earn your certificate.</p>
            </div>

            <AssessmentDashboard key={refreshKey} />

            {/* Exam Action Cards */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-white mb-6">Available Exams</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Module 1 */}
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                  <div className="text-3xl mb-3">📘</div>
                  <h4 className="text-lg font-bold text-white mb-1">{module1.title}</h4>
                  <p className="text-sm text-slate-400 mb-2">{module1.questions.length} questions &middot; {module1.duration} min &middot; {module1.passingScore}% to pass</p>
                  <p className="text-slate-300 text-sm mb-4">{module1.description}</p>
                  {isModule1Ready() ? (
                    <button
                      onClick={() => setView('module-1')}
                      className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors cursor-pointer"
                    >
                      Take Module 1 Exam
                    </button>
                  ) : (
                    <p className="text-sm text-slate-500 italic">Complete Lessons 1-3 first</p>
                  )}
                </div>

                {/* Module 2 */}
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                  <div className="text-3xl mb-3">📗</div>
                  <h4 className="text-lg font-bold text-white mb-1">{module2.title}</h4>
                  <p className="text-sm text-slate-400 mb-2">{module2.questions.length} questions &middot; {module2.duration} min &middot; {module2.passingScore}% to pass</p>
                  <p className="text-slate-300 text-sm mb-4">{module2.description}</p>
                  {isModule2Ready() ? (
                    <button
                      onClick={() => setView('module-2')}
                      className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors cursor-pointer"
                    >
                      Take Module 2 Exam
                    </button>
                  ) : (
                    <p className="text-sm text-slate-500 italic">Complete Lessons 4-12 first</p>
                  )}
                </div>

                {/* Final Exam */}
                <div className="bg-slate-800/50 rounded-xl border border-yellow-500/30 p-6">
                  <div className="text-3xl mb-3">🏆</div>
                  <h4 className="text-lg font-bold text-yellow-300 mb-1">Final Certification</h4>
                  <p className="text-sm text-slate-400 mb-2">20 questions &middot; 30 min &middot; 80% to pass</p>
                  <p className="text-slate-300 text-sm mb-4">Scenario-based questions testing real-world mastery of all 12 techniques.</p>
                  {isFinalExamReady() ? (
                    <button
                      onClick={() => setView('final')}
                      className="w-full py-2.5 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white font-semibold transition-colors cursor-pointer"
                    >
                      Take Final Exam
                    </button>
                  ) : (
                    <p className="text-sm text-slate-500 italic">Pass both module exams first</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {view === 'module-1' && (
          <div>
            <button
              onClick={() => setView('dashboard')}
              className="text-slate-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"
            >
              <span>&larr;</span> Back to Dashboard
            </button>
            <ModuleExam exam={module1} onComplete={handleExamComplete('module-1')} />
          </div>
        )}

        {view === 'module-2' && (
          <div>
            <button
              onClick={() => setView('dashboard')}
              className="text-slate-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"
            >
              <span>&larr;</span> Back to Dashboard
            </button>
            <ModuleExam exam={module2} onComplete={handleExamComplete('module-2')} />
          </div>
        )}

        {view === 'final' && (
          <div>
            <button
              onClick={() => setView('dashboard')}
              className="text-slate-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"
            >
              <span>&larr;</span> Back to Dashboard
            </button>
            <FinalExam onComplete={handleExamComplete('final')} />
          </div>
        )}
      </main>
    </div>
  );
}
