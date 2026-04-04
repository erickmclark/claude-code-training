'use client';

import { useState } from 'react';

interface PracticeExerciseProps {
  exercise: {
    title: string;
    instructions: string[];
  };
  onComplete: () => void;
}

export default function PracticeExercise({ exercise, onComplete }: PracticeExerciseProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const allChecked = checked.size === exercise.instructions.length;

  return (
    <div className="max-w-2xl">
      {/* Scenario tip */}
      <div
        className="p-4 mb-8"
        style={{
          border: '1.5px solid var(--color-coral)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-coral-light)',
        }}
      >
        <h3
          className="text-base font-semibold mb-1"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-coral-dark)' }}
        >
          🧪 {exercise.title}
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-coral-dark)', fontFamily: 'var(--font-body)' }}>
          Complete all tasks below to finish the exercise.
        </p>
      </div>

      {/* Checklist */}
      <div className="space-y-3 mb-8">
        {exercise.instructions.map((instruction, i) => {
          const isChecked = checked.has(i);
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className="w-full flex items-start gap-3 p-4 text-left transition-all"
              style={{
                border: 'var(--border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isChecked ? 'var(--color-sand)' : 'transparent',
              }}
            >
              {/* Checkbox circle */}
              <span
                className="shrink-0 w-5 h-5 mt-0.5 flex items-center justify-center"
                style={{
                  borderRadius: 'var(--radius-full)',
                  ...(isChecked
                    ? { backgroundColor: 'var(--color-coral)' }
                    : { border: '1.5px solid var(--color-muted)' }),
                }}
              >
                {isChecked && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>

              {/* Text */}
              <span
                className="text-sm"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: isChecked ? 'var(--color-hint)' : 'var(--color-body)',
                  textDecoration: isChecked ? 'line-through' : 'none',
                  lineHeight: 1.5,
                }}
              >
                {instruction}
              </span>
            </button>
          );
        })}
      </div>

      {/* Complete button */}
      {allChecked && (
        <button
          onClick={onComplete}
          className="w-full py-3.5 text-sm font-semibold transition-all"
          style={{
            backgroundColor: 'var(--color-coral)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Complete Lesson ✓
        </button>
      )}
    </div>
  );
}
