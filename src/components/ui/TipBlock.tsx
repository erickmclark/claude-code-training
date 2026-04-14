import type { ReactNode } from 'react';

type TipVariant = 'pro' | 'warning' | 'info' | 'success';

interface TipBlockProps {
  variant: TipVariant;
  label?: string;
  children: ReactNode;
}

const variantConfig: Record<TipVariant, {
  bg: string;
  border: string;
  labelColor: string;
  defaultLabel: string;
  icon: ReactNode;
}> = {
  pro: {
    bg: '#fff9f7',
    border: '#f0c4b0',
    labelColor: '#cc5c38',
    defaultLabel: 'Pro Tip',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cc5c38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6M10 22h4M12 2v1M12 7a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.4V16h-4v-1.6A4 4 0 0 1 8 11a4 4 0 0 1 4-4z" />
      </svg>
    ),
  },
  warning: {
    bg: '#fffbf0',
    border: '#f5d98a',
    labelColor: '#b8860b',
    defaultLabel: 'Warning',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
      </svg>
    ),
  },
  info: {
    bg: '#f0f6ff',
    border: '#b5d4f4',
    labelColor: '#2563eb',
    defaultLabel: 'Info',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  success: {
    bg: '#f0faf4',
    border: '#9fe1cb',
    labelColor: '#16a34a',
    defaultLabel: 'Success',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
};

export default function TipBlock({ variant, label, children }: TipBlockProps) {
  const config = variantConfig[variant];

  return (
    <div
      style={{
        backgroundColor: config.bg,
        borderLeft: `3px solid ${config.border}`,
        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
        padding: '14px 16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '6px',
        }}
      >
        {config.icon}
        <span
          style={{
            fontSize: '12px',
            fontWeight: 700,
            fontFamily: 'var(--font-body)',
            color: config.labelColor,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {label || config.defaultLabel}
        </span>
      </div>
      <div
        style={{
          fontSize: '13px',
          fontFamily: 'var(--font-body)',
          color: 'var(--color-body)',
          lineHeight: 1.6,
        }}
      >
        {children}
      </div>
    </div>
  );
}
