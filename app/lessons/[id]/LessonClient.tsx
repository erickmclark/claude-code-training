'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LessonContent, QuizQuestion } from '@/types/lesson';
import CodeBlock from '@/components/CodeBlock';
import QuizCard from '@/components/QuizCard';
import AskClaude from '@/components/AskClaude';
import { toggleStepComplete, getLessonProgress, markLessonComplete } from '@/utils/progress';

interface LessonClientProps {
  lesson: LessonContent;
  quiz: QuizQuestion[];
  prevId: number | null;
  nextId: number | null;
}

export default function LessonClient({ lesson, quiz, prevId, nextId }: LessonClientProps) {
  const router = useRouter();
  const [stepsCompleted, setStepsCompleted] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    return getLessonProgress(lesson.id).stepsCompleted;
  });
  const [quizCompleted, setQuizCompleted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return getLessonProgress(lesson.id).completed;
  });

  const handleToggleStep = (index: number) => {
    toggleStepComplete(lesson.id, index);
    setStepsCompleted((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleQuizComplete = (score: number) => {
    markLessonComplete(lesson.id, score);
    setQuizCompleted(true);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prevId) router.push(`/lessons/${prevId}`);
      if (e.key === 'ArrowRight' && nextId) router.push(`/lessons/${nextId}`);
      if (e.key === 'Escape') router.push('/');
    },
    [prevId, nextId, router]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div>
      {/* Steps */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Step-by-step guide
        </h2>
        <div className="space-y-6">
          {lesson.steps.map((step, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleToggleStep(i)}
                  className={`mt-1 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    stepsCompleted.includes(i)
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400'
                  }`}
                >
                  {stepsCompleted.includes(i) && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                  {step.code && (
                    <CodeBlock code={step.code} language={step.language} />
                  )}
                  {step.tip && (
                    <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30">
                      <p className="text-sm text-amber-800 dark:text-amber-300">
                        <span className="font-semibold">Pro tip:</span> {step.tip}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Terminal Commands */}
      {lesson.terminalCommands.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Key commands
          </h2>
          <CodeBlock
            code={lesson.terminalCommands.join('\n')}
            language="bash"
          />
        </section>
      )}

      {/* Real Example */}
      {lesson.realExample && <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Real-world example
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            {lesson.realExample.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {lesson.realExample.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30">
              <p className="text-xs font-semibold text-red-600 mb-2">BEFORE</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {lesson.realExample.before}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
              <p className="text-xs font-semibold text-emerald-600 mb-2">AFTER</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {lesson.realExample.after}
              </p>
            </div>
          </div>
        </div>
      </section>}

      {/* Exercise */}
      {lesson.exercise && <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Hands-on exercise
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            {lesson.exercise.title}
          </h3>
          <ol className="space-y-2">
            {lesson.exercise.instructions.map((inst, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs font-medium flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{inst}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>}

      {/* Quiz */}
      {quiz.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {quizCompleted ? 'Quiz (Completed)' : 'Quiz — Test your knowledge'}
          </h2>
          <QuizCard questions={quiz} onComplete={handleQuizComplete} />
        </section>
      )}

      {/* Navigation */}
      <nav className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-800">
        {prevId ? (
          <Link
            href={`/lessons/${prevId}`}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Previous Lesson
          </Link>
        ) : (
          <div />
        )}
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          All Lessons
        </Link>
        {nextId ? (
          <Link
            href={`/lessons/${nextId}`}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            Next Lesson
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <div />
        )}
      </nav>

      <p className="text-center text-xs text-gray-400 mt-4">
        Use ← → arrow keys to navigate, Escape to go home
      </p>

      <AskClaude lessonContext={lesson.title} />
    </div>
  );
}
