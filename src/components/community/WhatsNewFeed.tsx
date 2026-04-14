'use client';

import type { WhatsNewWeek } from '@/data/community/types';

export default function WhatsNewFeed({ weeks }: { weeks: WhatsNewWeek[] }) {
  if (weeks.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {weeks.map((week) => (
        <div
          key={week.weekNumber}
          style={{
            backgroundColor: '#fff',
            border: 'var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 28px',
          }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#fff',
                backgroundColor: 'var(--color-coral)',
                padding: '2px 10px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              Week {week.weekNumber}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--color-hint)' }}>
              {week.dateRange}
            </span>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--color-secondary)',
                backgroundColor: 'var(--color-sand)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {week.versionRange}
            </span>
          </div>

          {/* Headline */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--color-body)',
              lineHeight: 1.7,
              margin: '0 0 12px 0',
            }}
            dangerouslySetInnerHTML={{
              __html: week.headline.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'),
            }}
          />

          {/* Highlights */}
          {week.highlights.length > 0 && (
            <ul style={{ margin: '0 0 12px 0', padding: '0 0 0 20px' }}>
              {week.highlights.map((h, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '2px',
                  }}
                >
                  {h}
                </li>
              ))}
            </ul>
          )}

          {/* Digest link */}
          {week.digestUrl && (
            <a
              href={week.digestUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-coral)',
                textDecoration: 'none',
              }}
            >
              Read full digest →
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
