'use client';

import { use, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { capstoneProjects } from '@/data/capstones';
import { saveCapstoneResult } from '@/src/lib/progress';

const VALID_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
type Level = (typeof VALID_LEVELS)[number];

interface ChecklistResult {
  item: string;
  passed: boolean;
  feedback: string;
}

interface EvaluationResult {
  score: number;
  checklistResults: ChecklistResult[];
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
}

// Module-level cache so useSyncExternalStore returns a stable reference.
const resultCache: Record<string, EvaluationResult | null> = {};

function readResult(level: string | null): EvaluationResult | null {
  if (!level || typeof window === 'undefined') return null;
  if (level in resultCache) return resultCache[level];
  try {
    const raw = sessionStorage.getItem(`capstone-result-${level}`);
    resultCache[level] = raw ? (JSON.parse(raw) as EvaluationResult) : null;
  } catch {
    resultCache[level] = null;
  }
  return resultCache[level];
}

// No-op subscriber: results are written before this page mounts and never change.
function subscribe(): () => void {
  return () => {};
}

export default function Page({ params }: { params: Promise<{ level: string }> }) {
  const { level: levelParam } = use(params);
  const level = VALID_LEVELS.includes(levelParam as Level) ? (levelParam as Level) : null;
  const capstone = level ? capstoneProjects.find((c) => c.tier === level) : undefined;
  const passScore = capstone?.passScore ?? 80;

  const result = useSyncExternalStore(
    subscribe,
    () => readResult(level),
    () => null,
  );

  // Persist the result to long-term progress (side effect only; no state update).
  useEffect(() => {
    if (!level || !result) return;
    saveCapstoneResult(level, {
      passed: result.score >= passScore,
      score: result.score,
      completedAt: new Date().toISOString(),
    });
  }, [level, result, passScore]);

  if (!level || !capstone) {
    return (
      <NotFound message={`Unknown capstone level: ${levelParam}`} />
    );
  }

  if (!result) {
    return (
      <NotFound
        message="No evaluation results found for this capstone yet."
        backHref={`/capstone/${level}`}
      />
    );
  }

  const passed = result.score >= passScore;
  const scoreColor = passed ? '#16a34a' : '#d97706';
  const scoreBg = passed ? '#dcfce7' : '#fef3c7';
  const pointsToPass = Math.max(0, passScore - result.score);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-cream)' }}>
      {/* Top bar */}
      <nav
        style={{
          backgroundColor: '#fff',
          borderBottom: 'var(--border)',
          padding: '0 24px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <Link
          href={`/capstone/${level}`}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--color-secondary)',
            textDecoration: 'none',
          }}
        >
          ← Back to capstone
        </Link>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--color-hint)',
          }}
        >
          {capstone.title}
        </span>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px 24px' }}>
        {/* Score header */}
        <div
          style={{
            backgroundColor: '#fff',
            border: `1.5px solid ${scoreColor}`,
            borderRadius: 'var(--radius-lg)',
            padding: 32,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 32,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              flexShrink: 0,
              borderRadius: '50%',
              backgroundColor: scoreBg,
              border: `4px solid ${scoreColor}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 40,
                fontWeight: 700,
                color: scoreColor,
                lineHeight: 1,
              }}
            >
              {result.score}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: scoreColor,
                marginTop: 4,
              }}
            >
              / 100
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 700,
                color: scoreColor,
                marginBottom: 6,
              }}
            >
              {passed ? 'You passed' : 'Keep going'}
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 26,
                fontWeight: 700,
                color: 'var(--color-ink)',
                margin: '0 0 8px 0',
              }}
            >
              {passed
                ? 'Capstone complete'
                : `${pointsToPass} more point${pointsToPass === 1 ? '' : 's'} to pass`}
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--color-body)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {result.overallFeedback}
            </p>
          </div>
        </div>

        {/* Checklist results */}
        {result.checklistResults && result.checklistResults.length > 0 && (
          <Section title="Deliverables review">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {result.checklistResults.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '12px 14px',
                    border: 'var(--border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: item.passed ? '#f0fdf4' : '#fef2f2',
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      flexShrink: 0,
                      borderRadius: '50%',
                      backgroundColor: item.passed ? '#22c55e' : '#dc2626',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      marginTop: 1,
                    }}
                  >
                    {item.passed ? '✓' : '✗'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--color-ink)',
                        marginBottom: 4,
                      }}
                    >
                      {item.item}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 12,
                        color: 'var(--color-secondary)',
                        lineHeight: 1.5,
                      }}
                    >
                      {item.feedback}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Strengths */}
        {result.strengths && result.strengths.length > 0 && (
          <Section title="Strengths">
            <ul
              style={{
                margin: 0,
                padding: '12px 16px 12px 32px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 'var(--radius-md)',
                listStyle: 'disc',
              }}
            >
              {result.strengths.map((s, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: '#166534',
                    lineHeight: 1.6,
                    marginBottom: 4,
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Improvements */}
        {result.improvements && result.improvements.length > 0 && (
          <Section title="Improvements">
            <ul
              style={{
                margin: 0,
                padding: '12px 16px 12px 32px',
                backgroundColor: '#fef3c7',
                border: '1px solid #fde68a',
                borderRadius: 'var(--radius-md)',
                listStyle: 'disc',
              }}
            >
              {result.improvements.map((s, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: '#92400e',
                    lineHeight: 1.6,
                    marginBottom: 4,
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          <Link
            href={`/capstone/${level}`}
            style={{
              flex: 1,
              padding: '12px 20px',
              textAlign: 'center',
              border: '1.5px solid var(--color-coral)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-coral)',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Try again
          </Link>
          <Link
            href="/capstones"
            style={{
              flex: 1,
              padding: '12px 20px',
              textAlign: 'center',
              backgroundColor: 'var(--color-coral)',
              borderRadius: 'var(--radius-md)',
              color: '#fff',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Back to all capstones →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--color-ink)',
          margin: '0 0 10px 0',
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function NotFound({ message, backHref }: { message: string; backHref?: string }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-cream)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-ink)',
            fontSize: 24,
            marginBottom: 12,
          }}
        >
          {message}
        </h1>
        <Link
          href={backHref ?? '/capstones'}
          style={{
            color: 'var(--color-coral)',
            fontFamily: 'var(--font-body)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          ← Back
        </Link>
      </div>
    </div>
  );
}
