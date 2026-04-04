'use client';

import { useState, useEffect } from 'react';
import type { CoachResponse } from '@/src/agents/progressCoach';

interface LessonCompleteProps {
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  exerciseDescription?: string;
}

type LoadState = 'loading' | 'success' | 'error';

export default function LessonComplete({
  lessonId,
  lessonTitle,
  moduleTitle,
  exerciseDescription,
}: LessonCompleteProps) {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [coaching, setCoaching] = useState<CoachResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCoaching() {
      try {
        const res = await fetch('/api/agents/coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonId,
            lessonTitle,
            moduleTitle,
            exerciseDescription,
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = (await res.json()) as CoachResponse;
        if (!cancelled) {
          setCoaching(data);
          setLoadState('success');
        }
      } catch (err) {
        console.error('LessonComplete fetch error:', err);
        if (!cancelled) setLoadState('error');
      }
    }

    void fetchCoaching();
    return () => {
      cancelled = true;
    };
  }, [lessonId, lessonTitle, moduleTitle, exerciseDescription]);

  return (
    <div
      style={{
        marginTop: '2rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: '#ffffff',
        border: 'var(--border)',
        overflow: 'hidden',
      }}
    >
      {/* Coral accent strip */}
      <div
        style={{
          height: '4px',
          backgroundColor: 'var(--color-coral)',
        }}
      />

      <div style={{ padding: '1.75rem 2rem' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.25rem',
          }}
        >
          {/* Checkmark icon */}
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2rem',
              height: '2rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-coral)',
              flexShrink: 0,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-ink)',
              fontSize: '1.25rem',
              fontWeight: 600,
              margin: 0,
            }}
          >
            Lesson Complete
          </h3>
        </div>

        {/* Loading state */}
        {loadState === 'loading' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              color: 'var(--color-secondary)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '0.875rem',
                height: '0.875rem',
                border: '2px solid var(--color-border)',
                borderTopColor: 'var(--color-coral)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            Getting your coaching insight&hellip;
          </div>
        )}

        {/* Success state */}
        {loadState === 'success' && coaching && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Main insight */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-body)',
                fontSize: '0.9375rem',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {coaching.insight}
            </p>

            {/* Divider */}
            <div
              style={{
                height: '1px',
                backgroundColor: 'var(--color-border)',
              }}
            />

            {/* Strength */}
            <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
              <span
                style={{
                  color: 'var(--color-coral)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  flexShrink: 0,
                  marginTop: '0.0625rem',
                }}
              >
                Your strength:
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-body)',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                }}
              >
                {coaching.strength}
              </span>
            </div>

            {/* Focus next */}
            <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
              <span
                style={{
                  color: 'var(--color-coral)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  flexShrink: 0,
                  marginTop: '0.0625rem',
                }}
              >
                Focus next:
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-body)',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                }}
              >
                {coaching.focus_for_next}
              </span>
            </div>
          </div>
        )}

        {/* Error state */}
        {loadState === 'error' && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-body)',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Great work completing this exercise. Keep the momentum going — each lesson builds on the last.
          </p>
        )}
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
