import type { ReactNode } from 'react';
import BashBlock from '@/src/components/ui/BashBlock';

interface StepCardProps {
  stepNumber: number;
  title: string;
  children?: ReactNode;
  code?: string;
  language?: string;
  tip?: ReactNode;
}

export default function StepCard({ stepNumber, title, children, code, language, tip }: StepCardProps) {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: 'var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        {/* Step number circle */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: 'var(--color-coral)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: 'var(--font-body)',
            flexShrink: 0,
          }}
        >
          {stepNumber}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--color-ink)',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {title}
          </h3>
          {children && (
            <div style={{ marginTop: '8px', fontSize: '14px', color: 'var(--color-body)', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
              {children}
            </div>
          )}
        </div>
      </div>

      {/* Code block — flush inside card */}
      {code && (
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <BashBlock code={code} language={language} />
        </div>
      )}

      {/* Tip — attaches below */}
      {tip && (
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', padding: '0' }}>
          {tip}
        </div>
      )}
    </div>
  );
}
