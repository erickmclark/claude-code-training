'use client';

import Link from 'next/link';
import type { Step } from '@/types/lesson';
import BashBlock from '@/src/components/ui/BashBlock';
import TerminalReplay from '@/src/components/ui/TerminalReplay';
import ContentCard from '@/src/components/ui/ContentCard';

interface Enrichment {
  why: string;
  when: string;
  commonMistakes: string;
  useCase?: string;
  useCaseName?: string;
  useCaseRole?: string;
  useCaseIndustry?: string;
  useCaseTechniques?: string[];
  howTo?: string;
}

// ─── Shared props ─────────────────────────────────────────────

interface StepLeadProps {
  step: Step;
  stepNumber: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  /** Link shown on Step 1 when hasPrev is false (back to intro or previous lesson). */
  backHref?: string;
  /** Label for the back link, e.g. "← Back to intro" or "← Previous lesson". */
  backLabel?: string;
}

interface StepRailProps {
  step: Step;
}

interface StepInsightsProps {
  enrichment?: Enrichment | null;
}

interface StepContentProps extends StepLeadProps {
  enrichment?: Enrichment | null;
}

// ─── StepLead ──────────────────────────────────────────────────

/**
 * Left-column narrative half of a lesson step: chapter mark, title, lead
 * paragraph, technique byline, and Prev/Next navigation at the bottom.
 */
export function StepLead({
  step,
  stepNumber,
  totalSteps,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  backHref,
  backLabel,
}: StepLeadProps) {
  const pad2 = (n: number) => String(n).padStart(2, '0');

  return (
    <article key={stepNumber} className="animate-fade-in">
      {/* ─────────────────────────  HEADER  ───────────────────────── */}
      <header style={{ marginBottom: 36 }}>
        {/* Chapter mark */}
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-hint)',
            marginBottom: 14,
          }}
        >
          Chapter {pad2(stepNumber)}{' '}
          <span style={{ opacity: 0.5 }}>/ {pad2(totalSteps)}</span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 40px)',
            lineHeight: 1.15,
            fontWeight: 600,
            color: 'var(--color-ink)',
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          {step.title}
        </h2>

        {/* Lead paragraph */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 18,
            lineHeight: 1.7,
            color: 'var(--color-body)',
            margin: '20px 0 0 0',
          }}
        >
          {step.description}
        </p>

        {/* Technique byline */}
        {step.techniques && step.techniques.length > 0 && (
          <div
            style={{
              marginTop: 24,
              paddingTop: 14,
              borderTop: 'var(--border)',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--color-hint)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Techniques —{' '}
            {step.techniques.map((t, i) => (
              <span key={t}>
                {i > 0 && <span style={{ margin: '0 8px', opacity: 0.4 }}>·</span>}
                <span style={{ color: 'var(--color-secondary)' }}>{t}</span>
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ─────────────────────────  FOOTER NAVIGATION  ─────────────────────────
          Both buttons left-aligned and grouped with a gap so the primary
          Continue button stays visually close to the lesson content it
          belongs to. "space-between" pushed Continue to the far right of
          the narrative column, which felt disconnected. */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 56,
          paddingTop: 24,
          borderTop: '1px dashed var(--color-border)',
        }}
      >
        {hasPrev ? (
          <button
            onClick={onPrev}
            className="transition-all"
            style={{
              padding: '10px 18px',
              border: 'var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-secondary)',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: 500,
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            ← Previous
          </button>
        ) : backHref ? (
          <Link
            href={backHref}
            className="transition-all"
            style={{
              padding: '10px 18px',
              border: 'var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-secondary)',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            {backLabel ?? '← Back'}
          </Link>
        ) : (
          <div />
        )}

        {hasNext ? (
          <button
            onClick={onNext}
            className="transition-all"
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--color-coral)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Continue →
          </button>
        ) : (
          <div />
        )}
      </nav>

      {/* Keyboard shortcut hint */}
      <div
        style={{
          marginTop: 12,
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          color: 'var(--color-muted)',
          display: 'flex',
          gap: 16,
        }}
      >
        <span>← → steps</span>
        <span>↑ ↓ lessons</span>
      </div>
    </article>
  );
}

// ─── StepRail ──────────────────────────────────────────────────

/**
 * Right-column rail: code block + tips only. The enrichment Insights card
 * and "In practice" scenario are rendered separately by StepInsights so they
 * can sit in the left narrative column instead of the right reference rail.
 *
 * Returns null when the step has no code and no tips — the right grid cell
 * will be empty for that step, which is acceptable (layout stays stable).
 */
export function StepRail({ step }: StepRailProps) {
  const hasCode = Boolean(step.code);
  const hasAnyTip = Boolean(step.tip || step.borisTip || step.officialTip);
  const hasRecording = Boolean(step.recording);
  const hasScreenshot = Boolean(step.screenshot);

  if (!hasCode && !hasAnyTip && !hasRecording && !hasScreenshot) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      {/* ─────────────────────────  CODE BLOCK  ───────────────────────── */}
      {step.code && (
        <section style={{ marginBottom: hasRecording || hasScreenshot || hasAnyTip ? 24 : 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-hint)',
              marginBottom: 8,
              paddingBottom: 8,
              borderBottom: '1px dashed var(--color-border)',
            }}
          >
            <span>{step.language?.toUpperCase() || 'TERMINAL'}</span>
            <span style={{ opacity: 0.6 }}>$ run</span>
          </div>
          <BashBlock code={step.code} language={step.language} />
        </section>
      )}

      {/* ─────────────────────────  TERMINAL RECORDING  ───────────────────────── */}
      {hasRecording && step.recording && (
        <section style={{ marginBottom: hasAnyTip ? 24 : 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-hint)',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ color: 'var(--color-coral)', fontSize: 10 }}>●</span>
            Live recording
          </div>
          <TerminalReplay src={step.recording} />
        </section>
      )}

      {/* ─────────────────────────  STATIC SCREENSHOT  ───────────────────────── */}
      {!hasRecording && hasScreenshot && step.screenshot && (
        <section style={{ marginBottom: hasAnyTip ? 24 : 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/${step.screenshot}`}
            alt="Claude Code terminal screenshot"
            style={{
              width: '100%',
              borderRadius: 12,
              border: '1px solid var(--color-border)',
            }}
          />
        </section>
      )}

      {/* ─────────────────────────  TIPS — annotation rail  ───────────────────────── */}
      {hasAnyTip && (
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {step.tip && <RailNote label="Tip" tone="coral">{step.tip}</RailNote>}
          {step.borisTip && <RailNote label="Boris" tone="coral">{step.borisTip}</RailNote>}
          {step.officialTip && <RailNote label="Docs" tone="ink">{step.officialTip}</RailNote>}
        </section>
      )}
    </div>
  );
}

// ─── StepInsights ──────────────────────────────────────────────

/**
 * Narrative-column insights half: the AI-generated Insights card (Why this
 * matters / When to use this / Common mistakes) plus the "In practice"
 * pull-quote scenario. Rendered below StepLead in the left column so the
 * insights sit with the explanatory prose instead of the code reference.
 *
 * Returns null when no enrichment is available.
 */
export function StepInsights({ enrichment }: StepInsightsProps) {
  if (!enrichment) return null;

  // Parse "howTo" string into numbered items: "1. Foo\n2. Bar" → ["Foo", "Bar"]
  const howToSteps = enrichment.howTo
    ? enrichment.howTo
        .split(/\n/)
        .map((line) => line.replace(/^\d+\.\s*/, '').trim())
        .filter(Boolean)
    : [];

  return (
    <div className="animate-fade-in" style={{ marginTop: 40 }}>
      {/* Action steps card */}
      {howToSteps.length > 0 && (
        <section
          style={{
            border: 'var(--border)',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: '#fff',
            padding: '28px 32px',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--color-coral)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--color-coral)',
              }}
            >
              Try it
            </span>
          </div>
          <ol
            style={{
              margin: 0,
              padding: '0 0 0 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {howToSteps.map((text, i) => (
              <li
                key={i}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: 'var(--color-body)',
                }}
              >
                {text}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Insights card */}
      <section
        style={{
          border: 'var(--border)',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-cream)',
          padding: '28px 32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 24,
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: 'var(--color-coral)',
              lineHeight: 1,
            }}
          >
            ✦
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--color-coral)',
            }}
          >
            Insights
          </span>
        </div>

        <InsightRow heading="Why this matters">{enrichment.why}</InsightRow>
        <InsightDivider />
        <InsightRow heading="When to use this">{enrichment.when}</InsightRow>
        <InsightDivider />
        <InsightRow heading="Common mistakes">{enrichment.commonMistakes}</InsightRow>
      </section>

      {/* Pull-quote scenario */}
      {enrichment.useCase && (
        <div style={{ marginTop: 40 }}>
          <ContentCard
            quote={enrichment.useCase}
            name={enrichment.useCaseName ?? 'Developer'}
            role={enrichment.useCaseRole}
            industry={enrichment.useCaseIndustry}
            techniques={enrichment.useCaseTechniques}
          />
        </div>
      )}
    </div>
  );
}

// ─── StepContent (backwards-compat wrapper) ───────────────────

/**
 * Legacy single-column renderer — stacks StepLead on top of StepRail.
 * Kept for any code path that still wants the old layout. LessonPage now
 * composes StepLead + StepRail into a 2-column grid itself.
 */
export default function StepContent({
  step,
  stepNumber,
  totalSteps,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  enrichment,
  backHref,
  backLabel,
}: StepContentProps) {
  return (
    <div style={{ maxWidth: '860px' }}>
      <StepLead
        step={step}
        stepNumber={stepNumber}
        totalSteps={totalSteps}
        onPrev={onPrev}
        onNext={onNext}
        hasPrev={hasPrev}
        hasNext={hasNext}
        backHref={backHref}
        backLabel={backLabel}
      />
      <StepRail step={step} />
      <StepInsights enrichment={enrichment} />
    </div>
  );
}

/* ─────────────────────────  internal subcomponents  ───────────────────────── */

function RailNote({
  label,
  tone,
  children,
}: {
  label: string;
  tone: 'coral' | 'ink';
  children: React.ReactNode;
}) {
  const accent = tone === 'coral' ? 'var(--color-coral)' : 'var(--color-ink)';
  return (
    <div
      style={{
        borderLeft: `3px solid ${accent}`,
        paddingLeft: 18,
        paddingTop: 2,
        paddingBottom: 2,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: accent,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 15,
          lineHeight: 1.65,
          color: 'var(--color-body)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function InsightRow({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--color-ink)',
          margin: '0 0 8px 0',
        }}
      >
        {heading}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--color-body)',
          margin: 0,
        }}
      >
        {children}
      </p>
    </div>
  );
}

function InsightDivider() {
  return (
    <div
      style={{
        height: 1,
        backgroundColor: 'var(--color-border)',
        margin: '18px 0',
      }}
    />
  );
}
