'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { capstoneProjects } from '@/data/capstones';
import {
  getCapstoneChecklist,
  toggleCapstoneChecklistItem,
  getCapstoneDraft,
  saveCapstoneDraft,
} from '@/src/lib/progress';
import type { CapstoneProject } from '@/types/assessment';

const VALID_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
type Level = (typeof VALID_LEVELS)[number];

/**
 * Tiny inline parser for **bold** segments. Returns a React fragment.
 * Keeps the data file as plain strings while allowing emphasis in the scenario.
 */
function renderWithBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} style={{ color: 'var(--color-ink)', fontWeight: 700 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function getCapstoneForLevel(level: Level): CapstoneProject | undefined {
  return capstoneProjects.find((c) => c.tier === level);
}

export default function Page({ params }: { params: Promise<{ level: string }> }) {
  const { level: levelParam } = use(params);
  const router = useRouter();

  const level = VALID_LEVELS.includes(levelParam as Level) ? (levelParam as Level) : null;
  const capstone = level ? getCapstoneForLevel(level) : undefined;

  // Section state
  const [deliverablesOpen, setDeliverablesOpen] = useState(true);
  const [mistakesOpen, setMistakesOpen] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);

  // Checklist + draft state (loaded from localStorage on mount)
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [draft, setDraft] = useState('');
  const [hydrated, setHydrated] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!level) return;
    setChecked(new Set(getCapstoneChecklist(level)));
    setDraft(getCapstoneDraft(level));
    setHydrated(true);
  }, [level]);

  if (!level || !capstone) {
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
              fontSize: 28,
              marginBottom: 12,
            }}
          >
            Capstone not found
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-body)',
              marginBottom: 16,
            }}
          >
            Expected one of: {VALID_LEVELS.join(', ')}
          </p>
          <Link
            href="/capstones"
            style={{
              color: 'var(--color-coral)',
              fontFamily: 'var(--font-body)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            ← Back to all capstones
          </Link>
        </div>
      </div>
    );
  }

  const requirements = capstone.requirements;
  const passScore = capstone.passScore ?? 80;
  const timeLimit = capstone.timeLimit ?? `${capstone.estimatedHours}h`;
  const maxLength = capstone.submissionMaxLength ?? 2000;

  const toggleChecklistItem = (index: number) => {
    if (!level) return;
    toggleCapstoneChecklistItem(level, index);
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleDraftChange = (value: string) => {
    if (value.length > maxLength) return;
    setDraft(value);
    saveCapstoneDraft(level, value);
  };

  const canSubmit = checked.size > 0 && draft.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const checkedItems = requirements.filter((_, i) => checked.has(i));
      const res = await fetch('/api/agents/evaluate-capstone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          projectDescription: capstone.description,
          submissionText: draft,
          checklist: checkedItems,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Evaluation failed' }));
        throw new Error(err.error || 'Evaluation failed');
      }
      const result = await res.json();
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`capstone-result-${level}`, JSON.stringify(result));
      }
      router.push(`/capstone/${level}/results`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Evaluation failed');
      setSubmitting(false);
    }
  };

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
          href="/capstones"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--color-secondary)',
            textDecoration: 'none',
          }}
        >
          ← All capstones
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

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 120px 24px' }}>
        {/* 1. Scenario card */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            backgroundColor: '#fff',
            border: 'var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 24,
            marginBottom: 20,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-coral)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: 700,
                  color: 'var(--color-coral)',
                }}
              >
                Your scenario
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                color: 'var(--color-body)',
                lineHeight: 1.7,
                margin: 0,
                fontStyle: 'italic',
              }}
            >
              {capstone.scenario ? renderWithBold(capstone.scenario) : capstone.goal}
            </p>
          </div>
          {capstone.persona && (
            <div
              style={{
                width: 130,
                flexShrink: 0,
                backgroundColor: 'var(--color-sand)',
                border: 'var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  border: `2px solid var(--color-coral)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'var(--color-coral)',
                }}
              >
                {capstone.persona.initials}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--color-ink)',
                  marginBottom: 2,
                }}
              >
                You
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  color: 'var(--color-secondary)',
                  lineHeight: 1.4,
                }}
              >
                {capstone.persona.role}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  color: 'var(--color-hint)',
                  lineHeight: 1.4,
                }}
              >
                {capstone.persona.context}
              </div>
            </div>
          )}
        </div>

        {/* 2. 3 stat tiles */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
            marginBottom: 20,
          }}
        >
          {[
            { value: timeLimit, label: 'Time limit' },
            { value: String(requirements.length), label: 'Deliverables' },
            { value: String(passScore), label: 'Pass score' },
          ].map((tile) => (
            <div
              key={tile.label}
              style={{
                backgroundColor: '#fff',
                border: 'var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '18px 16px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'var(--color-coral)',
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {tile.value}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--color-hint)',
                }}
              >
                {tile.label}
              </div>
            </div>
          ))}
        </div>

        {/* 3. Deliverables (default open) */}
        <CollapsibleCard
          iconBg="#dbeafe"
          iconColor="#2563eb"
          icon="→"
          title="Deliverables — check each off as you complete it"
          open={deliverablesOpen}
          onToggle={() => setDeliverablesOpen((v) => !v)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {requirements.map((req, i) => {
              const isChecked = hydrated && checked.has(i);
              return (
                <button
                  key={i}
                  onClick={() => toggleChecklistItem(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '12px 14px',
                    textAlign: 'left',
                    width: '100%',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isChecked ? 'var(--color-coral-light)' : '#fff',
                    border: `1px solid ${isChecked ? 'var(--color-coral)' : 'var(--color-border)'}`,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    transition: 'all 0.15s',
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      flexShrink: 0,
                      borderRadius: 4,
                      border: `1.5px solid ${isChecked ? 'var(--color-coral)' : 'var(--color-muted)'}`,
                      backgroundColor: isChecked ? 'var(--color-coral)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 12,
                      marginTop: 1,
                    }}
                  >
                    {isChecked ? '✓' : ''}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: 'var(--color-body)',
                      lineHeight: 1.5,
                    }}
                  >
                    {req}
                  </span>
                </button>
              );
            })}
          </div>
        </CollapsibleCard>

        {/* 4. Common mistakes */}
        {capstone.commonMistakes && capstone.commonMistakes.length > 0 && (
          <CollapsibleCard
            iconBg="#fef3c7"
            iconColor="#d97706"
            icon="⚠"
            title="Common mistakes to avoid"
            open={mistakesOpen}
            onToggle={() => setMistakesOpen((v) => !v)}
          >
            <ul style={{ margin: 0, padding: '0 0 0 20px', listStyle: 'disc' }}>
              {capstone.commonMistakes.map((m, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: 'var(--color-body)',
                    lineHeight: 1.6,
                    marginBottom: 6,
                  }}
                >
                  {m}
                </li>
              ))}
            </ul>
          </CollapsibleCard>
        )}

        {/* 5. Verification checklist */}
        {capstone.verificationChecklist && capstone.verificationChecklist.length > 0 && (
          <CollapsibleCard
            iconBg="#dcfce7"
            iconColor="#16a34a"
            icon="✓"
            title="Verification checklist"
            open={verificationOpen}
            onToggle={() => setVerificationOpen((v) => !v)}
          >
            <ul style={{ margin: 0, padding: '0 0 0 20px', listStyle: 'disc' }}>
              {capstone.verificationChecklist.map((v, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: 'var(--color-body)',
                    lineHeight: 1.6,
                    marginBottom: 6,
                  }}
                >
                  {v}
                </li>
              ))}
            </ul>
          </CollapsibleCard>
        )}

        {/* 6. Submission textarea */}
        <div
          style={{
            backgroundColor: '#fff',
            border: 'var(--border)',
            borderRadius: 'var(--radius-lg)',
            marginTop: 20,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderBottom: 'var(--border)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--color-ink)',
              }}
            >
              Walk through your approach
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--color-hint)',
              }}
            >
              {draft.length} / {maxLength}
            </span>
          </div>
          <textarea
            value={draft}
            onChange={(e) => handleDraftChange(e.target.value)}
            placeholder={capstone.submissionPlaceholder ?? 'Describe what you built and how.'}
            style={{
              width: '100%',
              minHeight: 180,
              padding: '16px 18px',
              border: 'none',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              color: 'var(--color-body)',
              lineHeight: 1.6,
              resize: 'vertical',
              backgroundColor: '#fff',
            }}
          />
        </div>

        {/* 7. Submit button */}
        <div style={{ marginTop: 20 }}>
          {submitError && (
            <div
              style={{
                padding: '10px 14px',
                marginBottom: 12,
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: '#b91c1c',
              }}
            >
              {submitError}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              width: '100%',
              padding: '14px 24px',
              backgroundColor: canSubmit ? 'var(--color-coral)' : 'var(--color-sand)',
              color: canSubmit ? '#fff' : 'var(--color-hint)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              fontWeight: 600,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
            }}
          >
            {submitting
              ? 'Evaluating…'
              : checked.size === 0
                ? 'Check off at least one deliverable'
                : draft.trim().length === 0
                  ? 'Write your approach'
                  : 'Submit for evaluation'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Collapsible card subcomponent ─────────────────────────

interface CollapsibleCardProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleCard({
  icon,
  iconBg,
  iconColor,
  title,
  open,
  onToggle,
  children,
}: CollapsibleCardProps) {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: 'var(--border)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: 12,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          padding: '16px 20px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            width: 32,
            height: 32,
            flexShrink: 0,
            borderRadius: '50%',
            backgroundColor: iconBg,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {icon}
        </span>
        <span
          style={{
            flex: 1,
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--color-ink)',
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontSize: 11,
            color: 'var(--color-hint)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s',
          }}
        >
          ▼
        </span>
      </button>
      {open && <div style={{ padding: '0 20px 20px 20px' }}>{children}</div>}
    </div>
  );
}
