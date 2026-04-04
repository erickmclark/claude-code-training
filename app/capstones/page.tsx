'use client';

import { useState } from 'react';
import Link from 'next/link';
import { capstoneProjects } from '@/data/capstones';
import type { CapstoneProject } from '@/types/assessment';
import type { EvaluationResult } from '@/src/agents/capstoneEvaluator';

type EvaluationState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; result: EvaluationResult }
  | { status: 'error'; message: string };

interface ProjectFormState {
  submissionText: string;
  checkedItems: Record<number, boolean>;
}

function getCheckedList(project: CapstoneProject, checked: Record<number, boolean>): string[] {
  return project.requirements.filter((_, i) => checked[i]);
}

function ScoreCircle({ score }: { score: number }) {
  const color =
    score >= 90
      ? 'var(--color-coral)'
      : score >= 75
      ? '#2a7a4b'
      : score >= 60
      ? '#b07d2a'
      : 'var(--color-secondary)';

  return (
    <div
      style={{
        width: 96,
        height: 96,
        borderRadius: '50%',
        border: `4px solid ${color}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-sand)',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          fontWeight: 700,
          color,
          lineHeight: 1,
        }}
      >
        {score}
      </span>
      <span style={{ fontSize: 11, color: 'var(--color-hint)', marginTop: 2 }}>/ 100</span>
    </div>
  );
}

function EvaluationDisplay({ result, onRetry }: { result: EvaluationResult; onRetry: () => void }) {
  const passed = result.score >= 60;

  return (
    <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Score header */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-md)',
          border: 'var(--border)',
          padding: 24,
          display: 'flex',
          gap: 20,
          alignItems: 'center',
        }}
      >
        <ScoreCircle score={result.score} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--color-ink)',
              }}
            >
              {passed ? 'Project Passed' : 'Keep Improving'}
            </span>
            <span
              style={{
                fontSize: 12,
                padding: '2px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: passed ? '#dcfce7' : '#fef9c3',
                color: passed ? '#166534' : '#854d0e',
                fontWeight: 600,
              }}
            >
              {passed ? 'PASSED' : 'NEEDS WORK'}
            </span>
          </div>
          <p style={{ color: 'var(--color-body)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            {result.overallFeedback}
          </p>
        </div>
      </div>

      {/* Checklist results */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-md)',
          border: 'var(--border)',
          padding: 24,
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--color-ink)',
            marginBottom: 16,
            marginTop: 0,
          }}
        >
          Requirement Breakdown
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {result.checklistResults.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: item.passed ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${item.passed ? '#bbf7d0' : '#fecaca'}`,
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>
                {item.passed ? '✓' : '✗'}
              </span>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--color-ink)',
                    marginBottom: 4,
                  }}
                >
                  {item.item}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: 'var(--color-body)',
                    lineHeight: 1.5,
                  }}
                >
                  {item.feedback}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths and improvements */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-md)',
            border: 'var(--border)',
            padding: 20,
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 15,
              fontWeight: 600,
              color: '#166534',
              marginBottom: 12,
              marginTop: 0,
            }}
          >
            Strengths
          </h3>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {result.strengths.map((s, i) => (
              <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: 'var(--color-body)' }}>
                <span style={{ color: 'var(--color-coral)', fontWeight: 700, flexShrink: 0 }}>•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-md)',
            border: 'var(--border)',
            padding: 20,
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 15,
              fontWeight: 600,
              color: '#854d0e',
              marginBottom: 12,
              marginTop: 0,
            }}
          >
            To Improve
          </h3>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {result.improvements.map((s, i) => (
              <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: 'var(--color-body)' }}>
                <span style={{ color: 'var(--color-coral)', fontWeight: 700, flexShrink: 0 }}>•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={onRetry}
        style={{
          alignSelf: 'flex-start',
          padding: '10px 20px',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--color-border)',
          backgroundColor: 'white',
          color: 'var(--color-body)',
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Submit Again
      </button>
    </div>
  );
}

function ProjectCard({ project }: { project: CapstoneProject }) {
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState<ProjectFormState>({ submissionText: '', checkedItems: {} });
  const [evalState, setEvalState] = useState<EvaluationState>({ status: 'idle' });

  const tierLabel =
    project.tier === 'beginner'
      ? 'Beginner'
      : project.tier === 'intermediate'
      ? 'Intermediate'
      : 'Advanced';

  const tierAccent =
    project.tier === 'beginner'
      ? '#166534'
      : project.tier === 'intermediate'
      ? '#854d0e'
      : 'var(--color-coral)';

  const tierBg =
    project.tier === 'beginner'
      ? '#dcfce7'
      : project.tier === 'intermediate'
      ? '#fef9c3'
      : 'var(--color-coral-light)';

  const totalPoints = project.rubric.reduce((s, r) => s + r.points, 0);

  const handleToggleItem = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      checkedItems: { ...prev.checkedItems, [idx]: !prev.checkedItems[idx] },
    }));
  };

  const handleSubmit = async () => {
    const checkedList = getCheckedList(project, form.checkedItems);

    if (!form.submissionText.trim()) {
      setEvalState({ status: 'error', message: 'Please describe your project before submitting.' });
      return;
    }

    setEvalState({ status: 'submitting' });

    try {
      const res = await fetch('/api/agents/evaluate-capstone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: project.tier,
          projectDescription: project.description,
          submissionText: form.submissionText,
          checklist: checkedList.length > 0 ? checkedList : project.requirements,
        }),
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? 'Evaluation request failed');
      }

      const result = (await res.json()) as EvaluationResult;
      setEvalState({ status: 'success', result });
    } catch (err) {
      setEvalState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      });
    }
  };

  const handleRetry = () => {
    setEvalState({ status: 'idle' });
    setForm({ submissionText: '', checkedItems: {} });
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: 'var(--radius-lg)',
        border: 'var(--border)',
        overflow: 'hidden',
        marginBottom: 24,
      }}
    >
      {/* Card header — always visible */}
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '20px 24px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: tierBg,
                color: tierAccent,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {tierLabel}
            </span>
            <span
              style={{
                fontSize: 12,
                color: 'var(--color-hint)',
              }}
            >
              ~{project.estimatedHours}h &middot; {project.techniques.length} techniques
            </span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--color-ink)',
              margin: 0,
              marginBottom: 4,
            }}
          >
            {project.title}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--color-secondary)', margin: 0 }}>
            {project.description}
          </p>
        </div>
        <span
          style={{
            fontSize: 18,
            color: 'var(--color-hint)',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
            flexShrink: 0,
          }}
        >
          &#x25BC;
        </span>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div style={{ borderTop: 'var(--border)', padding: '24px' }}>
          {/* Goal */}
          <div
            style={{
              backgroundColor: 'var(--color-sand)',
              borderRadius: 'var(--radius-sm)',
              padding: 16,
              marginBottom: 20,
            }}
          >
            <p style={{ margin: 0, fontSize: 14, color: 'var(--color-body)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--color-ink)' }}>Goal: </strong>
              {project.goal}
            </p>
          </div>

          {/* Requirements checklist */}
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--color-ink)',
              marginBottom: 12,
              marginTop: 0,
            }}
          >
            Requirements
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {project.requirements.map((req, idx) => (
              <label
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: form.checkedItems[idx] ? 'var(--color-sand)' : 'transparent',
                  transition: 'background-color 0.15s',
                }}
              >
                <input
                  type="checkbox"
                  checked={!!form.checkedItems[idx]}
                  onChange={() => handleToggleItem(idx)}
                  style={{ marginTop: 2, accentColor: 'var(--color-coral)', cursor: 'pointer' }}
                />
                <span
                  style={{
                    fontSize: 14,
                    color: form.checkedItems[idx] ? 'var(--color-secondary)' : 'var(--color-body)',
                    textDecoration: form.checkedItems[idx] ? 'line-through' : 'none',
                    lineHeight: 1.5,
                  }}
                >
                  {req}
                </span>
              </label>
            ))}
          </div>

          {/* Techniques */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {project.techniques.map((tech, i) => (
              <span
                key={i}
                style={{
                  fontSize: 12,
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-coral-light)',
                  color: 'var(--color-coral)',
                  fontWeight: 500,
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Rubric summary */}
          <div
            style={{
              backgroundColor: 'var(--color-sand)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 13, color: 'var(--color-secondary)' }}>
              {project.rubric.length} rubric criteria &middot; {totalPoints} total points
            </span>
          </div>

          {/* Submission form */}
          {evalState.status !== 'success' && (
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  fontWeight: 600,
                  color: 'var(--color-ink)',
                  marginBottom: 8,
                  marginTop: 0,
                }}
              >
                Submit Your Project
              </h3>
              <p style={{ fontSize: 13, color: 'var(--color-hint)', marginBottom: 12, marginTop: 0 }}>
                Describe what you built, what Claude Code techniques you used, and any challenges you overcame. The more detail you provide, the better your evaluation.
              </p>
              <textarea
                value={form.submissionText}
                onChange={(e) => setForm((prev) => ({ ...prev, submissionText: e.target.value }))}
                placeholder="Describe your project: what you built, which Claude Code techniques you used, how you used parallel sessions, what your CLAUDE.md contains, links to your repo/demo, challenges you faced..."
                rows={7}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--color-border)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: 'var(--color-body)',
                  backgroundColor: 'white',
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box',
                  lineHeight: 1.6,
                }}
              />

              {evalState.status === 'error' && (
                <p
                  style={{
                    fontSize: 13,
                    color: '#b91c1c',
                    marginTop: 8,
                    marginBottom: 0,
                    padding: '8px 12px',
                    backgroundColor: '#fef2f2',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {evalState.message}
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={evalState.status === 'submitting'}
                style={{
                  marginTop: 14,
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor:
                    evalState.status === 'submitting' ? 'var(--color-muted)' : 'var(--color-coral)',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: evalState.status === 'submitting' ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'background-color 0.15s',
                }}
              >
                {evalState.status === 'submitting' ? (
                  <>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 14,
                        height: 14,
                        border: '2px solid rgba(255,255,255,0.4)',
                        borderTopColor: 'white',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }}
                    />
                    Evaluating...
                  </>
                ) : (
                  'Submit for Evaluation'
                )}
              </button>
            </div>
          )}

          {/* Results display */}
          {evalState.status === 'success' && (
            <EvaluationDisplay result={evalState.result} onRetry={handleRetry} />
          )}
        </div>
      )}
    </div>
  );
}

export default function CapstonesPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-cream)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Nav */}
      <nav
        style={{
          borderBottom: 'var(--border)',
          backgroundColor: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          padding: '0 24px',
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: '0 auto',
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--color-coral)',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            &larr; Back to Home
          </Link>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--color-ink)',
            }}
          >
            Capstone Projects
          </span>
        </div>
      </nav>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              fontWeight: 700,
              color: 'var(--color-ink)',
              marginBottom: 12,
              marginTop: 0,
            }}
          >
            Capstone Projects
          </h1>
          <p
            style={{
              fontSize: 16,
              color: 'var(--color-secondary)',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 600,
            }}
          >
            Put your skills to the test. Build real projects, check off requirements as you go, then submit for AI-powered evaluation and feedback.
          </p>
        </div>

        {/* Project cards */}
        {capstoneProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}

        {/* Footer links */}
        <div
          style={{
            marginTop: 40,
            paddingTop: 24,
            borderTop: 'var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Link
            href="/dashboard"
            style={{
              color: 'var(--color-secondary)',
              textDecoration: 'none',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            &larr; Dashboard
          </Link>
          <Link
            href="/certificate"
            style={{
              color: 'var(--color-coral)',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            View Certificate &rarr;
          </Link>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
