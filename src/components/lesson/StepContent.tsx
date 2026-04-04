'use client';

import type { Step } from '@/types/lesson';

interface StepContentProps {
  step: Step;
  stepNumber: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function StepContent({
  step,
  stepNumber,
  totalSteps,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: StepContentProps) {
  const firstSentence = step.description.split(/(?<=[.!?])\s/)[0];
  const restOfDescription = step.description.slice(firstSentence.length).trim();

  return (
    <article className="max-w-2xl">
      {/* Eyebrow badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span
          className="text-xs font-semibold px-2.5 py-1"
          style={{
            backgroundColor: 'var(--color-coral-light)',
            color: 'var(--color-coral)',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Step {stepNumber} of {totalSteps}
        </span>
        {step.techniques?.map((t) => (
          <span
            key={t}
            className="text-xs px-2.5 py-1"
            style={{
              backgroundColor: 'var(--color-sand)',
              color: 'var(--color-secondary)',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Title — Lora serif */}
      <h2
        className="text-2xl font-semibold mb-3"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-ink)',
        }}
      >
        {step.title}
      </h2>

      {/* Subtitle — italic first sentence */}
      <p
        className="text-base mb-6"
        style={{
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
          color: 'var(--color-secondary)',
          lineHeight: 1.6,
        }}
      >
        {firstSentence}
      </p>

      {/* Body text */}
      {restOfDescription && (
        <p
          className="text-base mb-6"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-body)',
            lineHeight: 1.7,
          }}
        >
          {restOfDescription}
        </p>
      )}

      {/* Code block */}
      {step.code && (
        <div
          className="mb-6 overflow-x-auto"
          style={{ borderRadius: 'var(--radius-md)' }}
        >
          {step.language && (
            <div
              className="px-4 py-2 text-xs font-mono"
              style={{
                backgroundColor: 'var(--color-ink)',
                color: 'var(--color-muted)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              }}
            >
              {step.language}
            </div>
          )}
          <pre
            className="p-4 text-sm leading-relaxed overflow-x-auto"
            style={{
              backgroundColor: 'var(--color-ink)',
              color: '#e8e4de',
              borderRadius: step.language ? '0 0 var(--radius-md) var(--radius-md)' : 'var(--radius-md)',
              fontFamily: "'DM Mono', 'Fira Code', monospace",
            }}
          >
            <code>{step.code}</code>
          </pre>
        </div>
      )}

      {/* Tip block */}
      {step.tip && (
        <div
          className="mb-6 p-4"
          style={{
            borderLeft: '3px solid var(--color-coral)',
            backgroundColor: 'var(--color-coral-light)',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          }}
        >
          <p
            className="text-sm"
            style={{ color: 'var(--color-coral-dark)', fontFamily: 'var(--font-body)' }}
          >
            <span className="font-semibold">Tip: </span>
            {step.tip}
          </p>
        </div>
      )}

      {/* Boris tip */}
      {step.borisTip && (
        <div
          className="mb-6 p-4"
          style={{
            borderLeft: '3px solid var(--color-coral)',
            backgroundColor: 'var(--color-coral-light)',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          }}
        >
          <p
            className="text-sm"
            style={{ color: 'var(--color-coral-dark)', fontFamily: 'var(--font-body)' }}
          >
            <span className="font-semibold">💡 Boris Tip: </span>
            {step.borisTip}
          </p>
        </div>
      )}

      {/* Official doc tip */}
      {step.officialTip && (
        <div
          className="mb-6 p-4"
          style={{
            borderLeft: '3px solid var(--color-ink)',
            backgroundColor: 'var(--color-sand)',
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          }}
        >
          <p
            className="text-sm"
            style={{ color: 'var(--color-body)', fontFamily: 'var(--font-body)' }}
          >
            <span className="font-semibold" style={{ color: 'var(--color-ink)' }}>📖 Official Docs: </span>
            {step.officialTip}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 mt-8" style={{ borderTop: 'var(--border)' }}>
        {hasPrev ? (
          <button
            onClick={onPrev}
            className="px-5 py-2.5 text-sm font-medium transition-all"
            style={{
              border: 'var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-secondary)',
              fontFamily: 'var(--font-body)',
            }}
          >
            ← Previous
          </button>
        ) : (
          <div />
        )}
        {hasNext ? (
          <button
            onClick={onNext}
            className="px-5 py-2.5 text-sm font-medium transition-all"
            style={{
              backgroundColor: 'var(--color-coral)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Next →
          </button>
        ) : (
          <div />
        )}
      </div>
    </article>
  );
}
