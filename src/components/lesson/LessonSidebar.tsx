'use client';

import type { Step } from '@/types/lesson';

interface LessonSidebarProps {
  steps: Step[];
  stepsCompleted: number[];
  activeStepIndex: number;
  onStepClick: (index: number) => void;
  hasQuiz: boolean;
  hasExercise: boolean;
  activeSection: 'step' | 'quiz' | 'exercise';
  onSectionClick: (section: 'step' | 'quiz' | 'exercise') => void;
}

export default function LessonSidebar({
  steps,
  stepsCompleted,
  activeStepIndex,
  onStepClick,
  hasQuiz,
  hasExercise,
  activeSection,
  onSectionClick,
}: LessonSidebarProps) {
  return (
    <nav className="w-full md:w-64 shrink-0">
      <div className="space-y-1">
        {steps.map((step, i) => {
          const isDone = stepsCompleted.includes(i);
          const isActive = activeSection === 'step' && activeStepIndex === i;

          return (
            <button
              key={i}
              onClick={() => { onSectionClick('step'); onStepClick(i); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all"
              style={{
                backgroundColor: isActive ? 'var(--color-coral-light)' : 'transparent',
              }}
            >
              {/* State circle */}
              <span
                className="shrink-0 w-6 h-6 flex items-center justify-center text-xs font-semibold"
                style={{
                  borderRadius: 'var(--radius-full)',
                  ...(isDone
                    ? { backgroundColor: 'var(--color-coral)', color: '#fff' }
                    : isActive
                    ? { border: '2px solid var(--color-coral)', color: 'var(--color-coral)' }
                    : { border: '1.5px solid var(--color-muted)', color: 'var(--color-muted)' }),
                }}
              >
                {isDone ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>

              {/* Step title */}
              <span
                className="text-sm leading-tight truncate"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: isActive ? 600 : 400,
                  color: isDone
                    ? 'var(--color-hint)'
                    : isActive
                    ? 'var(--color-ink)'
                    : 'var(--color-secondary)',
                }}
              >
                {step.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      {(hasQuiz || hasExercise) && (
        <div className="my-4" style={{ borderTop: 'var(--border)' }} />
      )}

      {/* Quiz & Exercise items */}
      <div className="space-y-1">
        {hasQuiz && (
          <button
            onClick={() => onSectionClick('quiz')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all"
            style={{
              backgroundColor: activeSection === 'quiz' ? 'var(--color-coral-light)' : 'transparent',
            }}
          >
            <span
              className="shrink-0 w-6 h-6 flex items-center justify-center text-xs"
              style={{
                borderRadius: 'var(--radius-full)',
                border: activeSection === 'quiz' ? '2px solid var(--color-coral)' : '1.5px solid var(--color-muted)',
                color: activeSection === 'quiz' ? 'var(--color-coral)' : 'var(--color-muted)',
              }}
            >
              ?
            </span>
            <span
              className="text-sm"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: activeSection === 'quiz' ? 600 : 400,
                color: activeSection === 'quiz' ? 'var(--color-ink)' : 'var(--color-secondary)',
              }}
            >
              Quiz
            </span>
          </button>
        )}

        {hasExercise && (
          <button
            onClick={() => onSectionClick('exercise')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all"
            style={{
              backgroundColor: activeSection === 'exercise' ? 'var(--color-coral-light)' : 'transparent',
            }}
          >
            <span
              className="shrink-0 w-6 h-6 flex items-center justify-center text-xs"
              style={{
                borderRadius: 'var(--radius-full)',
                border: activeSection === 'exercise' ? '2px solid var(--color-coral)' : '1.5px solid var(--color-muted)',
                color: activeSection === 'exercise' ? 'var(--color-coral)' : 'var(--color-muted)',
              }}
            >
              ✎
            </span>
            <span
              className="text-sm"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: activeSection === 'exercise' ? 600 : 400,
                color: activeSection === 'exercise' ? 'var(--color-ink)' : 'var(--color-secondary)',
              }}
            >
              Exercise
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}
