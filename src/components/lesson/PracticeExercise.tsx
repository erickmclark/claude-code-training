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
  const [submission, setSubmission] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const allChecked = checked.size === exercise.instructions.length;

  const handleSubmitApproach = async () => {
    if (!submission.trim()) return;
    setLoadingFeedback(true);
    setFeedback('');
    try {
      const context = `Exercise: ${exercise.title}\n\nTasks:\n${exercise.instructions.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\nStudent's approach:\n${submission}`;
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'review-exercise', context }),
      });
      const data = (await res.json()) as { result: string };
      setFeedback(data.result);
      setSubmitted(true);
    } catch {
      setFeedback('Unable to get feedback right now. Check that ANTHROPIC_API_KEY is set.');
    }
    setLoadingFeedback(false);
  };

  return (
    <div className="max-w-4xl">
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

      {/* AI Review section */}
      <div
        className="mb-6 p-5"
        style={{
          border: 'var(--border)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#fff',
        }}
      >
        <h4
          className="text-sm font-semibold mb-1"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
        >
          ✦ Get AI Feedback on Your Approach
        </h4>
        <p
          className="text-xs mb-3"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-secondary)' }}
        >
          Describe how you completed this exercise — what commands you ran, what you built, or what you learned. Claude will review your approach.
        </p>
        <textarea
          value={submission}
          onChange={(e) => setSubmission(e.target.value)}
          placeholder="I opened my terminal and ran... I created a file at... I noticed that..."
          rows={4}
          className="w-full text-sm resize-none focus:outline-none"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-ink)',
            backgroundColor: 'var(--color-cream)',
            border: 'var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            lineHeight: 1.6,
          }}
        />
        <button
          onClick={handleSubmitApproach}
          disabled={loadingFeedback || !submission.trim()}
          className="mt-3 px-5 py-2 text-sm font-semibold transition-all"
          style={{
            backgroundColor: submission.trim() && !loadingFeedback ? 'var(--color-coral)' : 'var(--color-sand)',
            color: submission.trim() && !loadingFeedback ? '#fff' : 'var(--color-hint)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-body)',
            cursor: submission.trim() && !loadingFeedback ? 'pointer' : 'not-allowed',
            border: 'none',
          }}
        >
          {loadingFeedback ? 'Reviewing...' : submitted ? 'Submit Again' : 'Submit for AI Review'}
        </button>

        {/* Loading skeleton */}
        {loadingFeedback && (
          <div className="mt-4 space-y-2">
            {[80, 60, 90].map((w, i) => (
              <div
                key={i}
                style={{
                  height: 12,
                  width: `${w}%`,
                  borderRadius: 6,
                  backgroundColor: 'var(--color-sand)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>
        )}

        {/* AI Feedback */}
        {feedback && !loadingFeedback && (
          <div
            className="mt-4 p-4"
            style={{
              backgroundColor: 'var(--color-cream)',
              border: '1.5px solid var(--color-coral)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <p
              className="text-xs font-semibold mb-2"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-coral)' }}
            >
              ✦ Claude&apos;s Feedback
            </p>
            <p
              className="text-sm"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-body)',
                lineHeight: 1.65,
                whiteSpace: 'pre-wrap',
              }}
            >
              {feedback}
            </p>
          </div>
        )}
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
