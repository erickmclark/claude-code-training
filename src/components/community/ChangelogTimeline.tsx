'use client';

import { useState } from 'react';
import type { ChangelogVersion, ChangelogItem } from '@/data/community/types';

const categoryConfig: Record<ChangelogItem['category'], { label: string; color: string; bg: string }> = {
  added: { label: 'Added', color: '#16a34a', bg: '#f0fdf4' },
  fixed: { label: 'Fixed', color: 'var(--color-coral)', bg: 'var(--color-coral-light)' },
  improved: { label: 'Improved', color: '#2563eb', bg: '#eff6ff' },
  changed: { label: 'Changed', color: '#d97706', bg: '#fffbeb' },
  removed: { label: 'Removed', color: '#6b7280', bg: '#f3f4f6' },
};

function CategoryBadge({ category, count }: { category: ChangelogItem['category']; count: number }) {
  const config = categoryConfig[category];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '11px',
        fontWeight: 600,
        color: config.color,
        backgroundColor: config.bg,
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)',
      }}
    >
      {config.label} ({count})
    </span>
  );
}

function VersionCard({ version, defaultExpanded }: { version: ChangelogVersion; defaultExpanded: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const grouped = version.items.reduce<Record<string, ChangelogItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  const categoryOrder: ChangelogItem['category'][] = ['added', 'fixed', 'improved', 'changed', 'removed'];

  return (
    <div style={{ position: 'relative', paddingLeft: '28px' }}>
      {/* Timeline dot */}
      <div
        style={{
          position: 'absolute',
          left: '0',
          top: '8px',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: defaultExpanded ? 'var(--color-coral)' : 'var(--color-sand)',
          border: '2px solid #fff',
          boxShadow: '0 0 0 1px var(--color-border)',
        }}
      />

      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: 'none',
          border: 'none',
          padding: '0',
          cursor: 'pointer',
          textAlign: 'left',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: expanded ? '12px' : '0',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--color-ink)',
          }}
        >
          v{version.version}
        </span>
        <span style={{ fontSize: '13px', color: 'var(--color-hint)' }}>
          {version.date}
        </span>
        <span style={{ fontSize: '13px', color: 'var(--color-hint)', marginLeft: 'auto' }}>
          {version.items.length} changes {expanded ? '▾' : '▸'}
        </span>
      </button>

      {expanded && (
        <div
          style={{
            backgroundColor: '#fff',
            border: 'var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 24px',
          }}
        >
          {/* Category badges summary */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {categoryOrder.map((cat) =>
              grouped[cat] ? <CategoryBadge key={cat} category={cat} count={grouped[cat].length} /> : null
            )}
          </div>

          {/* Items by category */}
          {categoryOrder.map((cat) => {
            const items = grouped[cat];
            if (!items) return null;
            return (
              <div key={cat} style={{ marginBottom: '12px' }}>
                <ul style={{ margin: 0, padding: '0 0 0 18px' }}>
                  {items.map((item, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: '13px',
                        color: 'var(--color-body)',
                        lineHeight: 1.6,
                        marginBottom: '4px',
                      }}
                    >
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ChangelogTimeline({ versions }: { versions: ChangelogVersion[] }) {
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? versions : versions.slice(0, 3);
  const hasMore = versions.length > 3;

  return (
    <div>
      {/* Timeline line */}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: '5px',
            top: '8px',
            bottom: '0',
            width: '2px',
            backgroundColor: 'var(--color-sand)',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {visible.map((v, i) => (
            <VersionCard key={v.version} version={v} defaultExpanded={i < 2} />
          ))}
        </div>
      </div>

      {/* Show more */}
      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          style={{
            display: 'block',
            margin: '24px auto 0',
            background: 'none',
            border: 'var(--border)',
            borderRadius: 'var(--radius-full)',
            padding: '8px 20px',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--color-coral)',
            cursor: 'pointer',
          }}
        >
          Show {versions.length - 3} older versions ▾
        </button>
      )}
    </div>
  );
}
