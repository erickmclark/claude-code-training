'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAssessmentProgress, getOverallProgress, isModule1Ready, isModule2Ready, isFinalExamReady, isCertificateReady } from '@/utils/assessment';
import { getProgress, getCompletionPercentage } from '@/utils/progress';
import { AssessmentProgress } from '@/types/assessment';
import { UserProgress } from '@/types/lesson';

const LESSON_TITLES: Record<number, string> = {
  1: 'Parallel Execution',
  2: 'Plan Mode Mastery',
  3: 'CLAUDE.md Files',
  4: 'Git Worktrees',
  5: 'Voice Dictation',
  6: 'Verification Loops',
  7: '/batch Parallelization',
  8: 'Custom Agents',
  9: 'Slash Commands',
  10: 'Hooks & Automation',
  11: 'Mobile Control',
  12: 'Advanced Mastery',
};

const CAPSTONE_TIERS = [
  { id: 'beginner-landing', tier: 'Beginner', label: 'Build a Landing Page' },
  { id: 'intermediate-saas', tier: 'Intermediate', label: 'Build a SaaS Feature' },
  { id: 'advanced-pipeline', tier: 'Advanced', label: 'Build a CI/CD Pipeline' },
];

export default function AssessmentDashboard() {
  const [mounted, setMounted] = useState(false);
  const [lessonProgress, setLessonProgress] = useState<UserProgress | null>(null);
  const [assessmentProgress, setAssessmentProgress] = useState<AssessmentProgress | null>(null);
  const [completionPct, setCompletionPct] = useState(0);

  useEffect(() => {
    setMounted(true);
    setLessonProgress(getProgress());
    setAssessmentProgress(getAssessmentProgress());
    setCompletionPct(getCompletionPercentage());
  }, []);

  if (!mounted || !lessonProgress || !assessmentProgress) {
    return null;
  }

  const overall = getOverallProgress();
  const mod1Ready = isModule1Ready();
  const mod2Ready = isModule2Ready();
  const finalReady = isFinalExamReady();
  const certReady = isCertificateReady();

  // Calculate total journey progress (weighted)
  const journeySteps = [
    { weight: 40, done: (overall.lessonsCompleted / 12) * 100 },
    { weight: 15, done: overall.module1Passed ? 100 : 0 },
    { weight: 15, done: overall.module2Passed ? 100 : 0 },
    { weight: 10, done: Math.min(overall.capstonesSubmitted / 3, 1) * 100 },
    { weight: 15, done: overall.finalExamPassed ? 100 : 0 },
    { weight: 5, done: overall.certificateEarned ? 100 : 0 },
  ];
  const totalProgress = Math.round(
    journeySteps.reduce((sum, s) => sum + (s.weight * s.done) / 100, 0)
  );

  return (
    <div className="space-y-8">
      {/* Overall Progress */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Program Progress</h2>
          <span className="text-3xl font-bold text-blue-400">{totalProgress}%</span>
        </div>
        <div className="bg-slate-700 rounded-full h-4 mb-4">
          <div
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500 h-4 rounded-full transition-all duration-700"
            style={{ width: `${totalProgress}%` }}
          />
        </div>

        {/* Journey Flow */}
        <div className="flex flex-wrap items-center justify-center gap-1 text-xs sm:text-sm mt-6">
          {[
            { label: 'Lessons', done: overall.lessonsCompleted >= 12 },
            { label: 'Quizzes', done: overall.quizzesPassed >= 12 },
            { label: 'Module Exams', done: overall.module1Passed && overall.module2Passed },
            { label: 'Capstones', done: overall.capstonesSubmitted >= 1 },
            { label: 'Final Exam', done: overall.finalExamPassed },
            { label: 'Certificate', done: overall.certificateEarned },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center gap-1">
              <div
                className={`px-3 py-1.5 rounded-full font-medium ${
                  step.done
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                }`}
              >
                {step.done ? '✓ ' : ''}{step.label}
              </div>
              {i < arr.length - 1 && (
                <span className="text-slate-600 mx-1">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lesson Quizzes */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Lesson Quizzes</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((id) => {
            const lesson = lessonProgress.lessons[id];
            const score = lesson?.quizScore;
            const passed = score !== null && score !== undefined && score >= 60;

            return (
              <Link
                key={id}
                href={`/lessons/${id}`}
                className={`bg-slate-800/50 rounded-lg p-4 border transition-colors hover:bg-slate-800/70 ${
                  passed
                    ? 'border-green-500/30'
                    : 'border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500">Lesson {id}</span>
                  {passed && <span className="text-green-400 text-xs">✓</span>}
                </div>
                <div className="text-sm font-medium text-white mb-2 leading-tight">
                  {LESSON_TITLES[id]}
                </div>
                {score !== null && score !== undefined ? (
                  <div className={`text-lg font-bold ${passed ? 'text-green-300' : 'text-red-300'}`}>
                    {score}%
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">Not taken</div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Module Exams */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Module Exams</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Module 1 */}
          <div className={`bg-slate-800/50 rounded-xl p-6 border ${
            overall.module1Passed ? 'border-green-500/30' : 'border-slate-700'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-white">Module 1: Fundamentals</h4>
              {overall.module1Passed && <span className="text-green-400">✓ Passed</span>}
            </div>
            <p className="text-sm text-slate-400 mb-4">Lessons 1-3: Parallel Execution, Plan Mode, CLAUDE.md</p>

            {assessmentProgress.moduleExams['module-1'] ? (
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white">
                  {assessmentProgress.moduleExams['module-1'].score}%
                </div>
                <div className={`text-sm ${overall.module1Passed ? 'text-green-300' : 'text-red-300'}`}>
                  {overall.module1Passed ? 'Passed' : 'Failed — retake available'}
                </div>
              </div>
            ) : mod1Ready ? (
              <Link
                href="/assessment/exams/module-1"
                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Take Exam
              </Link>
            ) : (
              <p className="text-sm text-slate-500">Complete Lessons 1-3 first</p>
            )}
          </div>

          {/* Module 2 */}
          <div className={`bg-slate-800/50 rounded-xl p-6 border ${
            overall.module2Passed ? 'border-green-500/30' : 'border-slate-700'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-white">Module 2: Advanced</h4>
              {overall.module2Passed && <span className="text-green-400">✓ Passed</span>}
            </div>
            <p className="text-sm text-slate-400 mb-4">Lessons 4-12: Worktrees, Verification, Agents, Hooks, and more</p>

            {assessmentProgress.moduleExams['module-2'] ? (
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white">
                  {assessmentProgress.moduleExams['module-2'].score}%
                </div>
                <div className={`text-sm ${overall.module2Passed ? 'text-green-300' : 'text-red-300'}`}>
                  {overall.module2Passed ? 'Passed' : 'Failed — retake available'}
                </div>
              </div>
            ) : mod2Ready ? (
              <Link
                href="/assessment/exams/module-2"
                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Take Exam
              </Link>
            ) : (
              <p className="text-sm text-slate-500">Complete Lessons 4-12 first</p>
            )}
          </div>
        </div>
      </div>

      {/* Capstone Projects */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Capstone Projects</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CAPSTONE_TIERS.map((cap) => {
            const submission = assessmentProgress.capstoneSubmissions[cap.id];
            const submitted = !!submission;

            return (
              <div
                key={cap.id}
                className={`bg-slate-800/50 rounded-xl p-6 border ${
                  submitted ? 'border-green-500/30' : 'border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    cap.tier === 'Beginner'
                      ? 'bg-green-500/10 text-green-300'
                      : cap.tier === 'Intermediate'
                      ? 'bg-yellow-500/10 text-yellow-300'
                      : 'bg-red-500/10 text-red-300'
                  }`}>
                    {cap.tier}
                  </span>
                  {submitted && <span className="text-green-400 text-xs">✓ Submitted</span>}
                </div>
                <h4 className="font-medium text-white text-sm mb-4">{cap.label}</h4>

                {submitted ? (
                  <div className="text-sm text-green-300">
                    Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                  </div>
                ) : (
                  <Link
                    href="/assessment/capstones"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View Project →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Exam */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Final Exam</h3>
        <div className={`bg-slate-800/50 rounded-xl p-6 border ${
          overall.finalExamPassed ? 'border-green-500/30' : 'border-slate-700'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-white">Comprehensive Final Exam</h4>
            {overall.finalExamPassed && <span className="text-green-400">✓ Passed</span>}
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Covers all 12 lessons. Passing score: 70%. Time limit: 60 minutes.
          </p>

          {assessmentProgress.finalExam ? (
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">
                {assessmentProgress.finalExam.score}%
              </div>
              <div className={`text-sm ${overall.finalExamPassed ? 'text-green-300' : 'text-red-300'}`}>
                {overall.finalExamPassed ? 'Passed' : 'Failed — retake available'}
              </div>
            </div>
          ) : finalReady ? (
            <Link
              href="/assessment/exams/final"
              className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Take Final Exam
            </Link>
          ) : (
            <p className="text-sm text-slate-500">Pass both module exams first</p>
          )}
        </div>
      </div>

      {/* Certificate */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Certificate</h3>
        <div className={`bg-slate-800/50 rounded-xl p-6 border ${
          overall.certificateEarned
            ? 'border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 via-amber-500/5 to-orange-500/5'
            : 'border-slate-700'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-white">Certificate of Mastery</h4>
            {overall.certificateEarned ? (
              <span className="text-yellow-300">🏆 Earned</span>
            ) : (
              <span className="text-slate-500">🔒 Locked</span>
            )}
          </div>

          {overall.certificateEarned ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-300">
                Your certificate has been generated. View and share it anytime.
              </p>
              <Link
                href="/assessment/certificate"
                className="inline-block px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-bold rounded-lg transition-colors"
              >
                View Certificate
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-slate-400 mb-3">Requirements:</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2">
                  <span className={overall.lessonsCompleted >= 12 ? 'text-green-400' : 'text-slate-500'}>
                    {overall.lessonsCompleted >= 12 ? '✓' : '○'}
                  </span>
                  <span className={overall.lessonsCompleted >= 12 ? 'text-green-300' : 'text-slate-400'}>
                    All 12 lessons completed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={overall.module1Passed ? 'text-green-400' : 'text-slate-500'}>
                    {overall.module1Passed ? '✓' : '○'}
                  </span>
                  <span className={overall.module1Passed ? 'text-green-300' : 'text-slate-400'}>
                    Module 1 exam passed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={overall.module2Passed ? 'text-green-400' : 'text-slate-500'}>
                    {overall.module2Passed ? '✓' : '○'}
                  </span>
                  <span className={overall.module2Passed ? 'text-green-300' : 'text-slate-400'}>
                    Module 2 exam passed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={overall.finalExamPassed ? 'text-green-400' : 'text-slate-500'}>
                    {overall.finalExamPassed ? '✓' : '○'}
                  </span>
                  <span className={overall.finalExamPassed ? 'text-green-300' : 'text-slate-400'}>
                    Final exam passed
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
