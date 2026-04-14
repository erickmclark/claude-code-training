'use client';

import { useState, useSyncExternalStore } from 'react';
import type { ModuleCapstoneScenario } from '@/types/lesson';
import { completeModuleCapstone, isModuleCapstoneComplete } from '@/src/lib/progress';

interface ModuleCapstoneProps {
  scenario: ModuleCapstoneScenario;
  onComplete?: () => void;
}

// Subscribes to localStorage changes for the progress key
function subscribeProgress(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === 'claude-training-progress') callback();
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

export default function ModuleCapstone({ scenario, onComplete }: ModuleCapstoneProps) {
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());
  const [checkedQuestions, setCheckedQuestions] = useState<Set<number>>(new Set());
  const [localCompleted, setLocalCompleted] = useState(false);

  // Hydration-safe read: server returns false, client returns actual value
  const persistedCompleted = useSyncExternalStore(
    subscribeProgress,
    () => isModuleCapstoneComplete(scenario.moduleId),
    () => false,
  );

  const completed = localCompleted || persistedCompleted;

  const toggleTask = (id: string) => {
    setCheckedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleQuestion = (i: number) => {
    setCheckedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const allTasksDone = checkedTasks.size === scenario.tasks.length;
  const allQuestionsConfirmed = checkedQuestions.size === scenario.selfCheckQuestions.length;
  const canComplete = allTasksDone && allQuestionsConfirmed && !completed;

  const handleComplete = () => {
    if (!canComplete) return;
    completeModuleCapstone(scenario.moduleId);
    setLocalCompleted(true);
    onComplete?.();
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div
        className="p-5 mb-6"
        style={{
          border: '1.5px solid var(--color-coral)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-coral-light)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span style={{ fontSize: '20px' }}>🏆</span>
          <span
            className="text-xs uppercase tracking-wider font-semibold"
            style={{ color: 'var(--color-coral-dark)', fontFamily: 'var(--font-body)' }}
          >
            Module Capstone · {scenario.estimatedMinutes} min
          </span>
        </div>
        <h2
          className="text-2xl font-semibold mb-3"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
        >
          {scenario.title}
        </h2>
        <p
          className="text-base leading-relaxed"
          style={{ color: 'var(--color-body)', fontFamily: 'var(--font-body)' }}
        >
          {scenario.situation}
        </p>
      </div>

      {/* Techniques */}
      <div className="mb-6">
        <h3
          className="text-xs uppercase tracking-wider mb-2 font-semibold"
          style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }}
        >
          Techniques you&apos;ll synthesize
        </h3>
        <div className="flex flex-wrap gap-2">
          {scenario.techniques.map((t) => (
            <span
              key={t}
              className="text-xs px-3 py-1.5"
              style={{
                border: 'var(--border)',
                borderColor: 'var(--color-coral)',
                color: 'var(--color-coral-dark)',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="mb-6">
        <h3
          className="text-base font-semibold mb-3"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
        >
          Your tasks
        </h3>
        <div className="space-y-3">
          {scenario.tasks.map((task, i) => {
            const isChecked = checkedTasks.has(task.id);
            return (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="w-full text-left p-4 transition-colors"
                style={{
                  border: 'var(--border)',
                  borderColor: isChecked ? 'var(--color-coral)' : 'var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isChecked ? 'var(--color-coral-light)' : '#fff',
                  cursor: 'pointer',
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-xs font-semibold"
                    style={{
                      border: '1.5px solid var(--color-coral)',
                      borderRadius: '50%',
                      backgroundColor: isChecked ? 'var(--color-coral)' : 'transparent',
                      color: isChecked ? '#fff' : 'var(--color-coral)',
                      marginTop: '2px',
                    }}
                  >
                    {isChecked ? '✓' : i + 1}
                  </span>
                  <div className="flex-1">
                    <p
                      className="text-sm mb-1.5"
                      style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-body)' }}
                    >
                      {task.description}
                    </p>
                    <p
                      className="text-xs italic"
                      style={{ color: 'var(--color-hint)', fontFamily: 'var(--font-body)' }}
                    >
                      Success: {task.successCriteria}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Deliverable */}
      <div
        className="p-4 mb-6"
        style={{
          border: 'var(--border)',
          borderColor: 'var(--color-border)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-sand)',
        }}
      >
        <p
          className="text-xs uppercase tracking-wider mb-1 font-semibold"
          style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }}
        >
          Deliverable
        </p>
        <p className="text-sm" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-body)' }}>
          {scenario.deliverable}
        </p>
      </div>

      {/* Self-check */}
      <div className="mb-6">
        <h3
          className="text-base font-semibold mb-3"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
        >
          Self-check
        </h3>
        <div className="space-y-2">
          {scenario.selfCheckQuestions.map((q, i) => {
            const isChecked = checkedQuestions.has(i);
            return (
              <button
                key={i}
                onClick={() => toggleQuestion(i)}
                className="w-full text-left p-3 flex items-start gap-3 transition-colors"
                style={{
                  border: 'var(--border)',
                  borderColor: isChecked ? 'var(--color-coral)' : 'var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isChecked ? 'var(--color-coral-light)' : '#fff',
                  cursor: 'pointer',
                }}
              >
                <span
                  className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-xs"
                  style={{
                    border: '1.5px solid var(--color-coral)',
                    borderRadius: '4px',
                    backgroundColor: isChecked ? 'var(--color-coral)' : 'transparent',
                    color: '#fff',
                    marginTop: '1px',
                  }}
                >
                  {isChecked ? '✓' : ''}
                </span>
                <span
                  className="text-sm"
                  style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-body)' }}
                >
                  {q}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Complete button */}
      <button
        onClick={handleComplete}
        disabled={!canComplete}
        className="w-full py-3 text-sm font-semibold transition-opacity"
        style={{
          backgroundColor: completed ? 'var(--color-sand)' : 'var(--color-coral)',
          color: completed ? 'var(--color-secondary)' : '#fff',
          borderRadius: 'var(--radius-md)',
          border: 'none',
          cursor: canComplete ? 'pointer' : 'not-allowed',
          opacity: canComplete || completed ? 1 : 0.5,
          fontFamily: 'var(--font-body)',
        }}
      >
        {completed
          ? '✓ Capstone Complete'
          : canComplete
            ? 'Mark Capstone Complete'
            : `Check off ${scenario.tasks.length - checkedTasks.size + scenario.selfCheckQuestions.length - checkedQuestions.size} more item${scenario.tasks.length - checkedTasks.size + scenario.selfCheckQuestions.length - checkedQuestions.size === 1 ? '' : 's'}`}
      </button>
    </div>
  );
}
