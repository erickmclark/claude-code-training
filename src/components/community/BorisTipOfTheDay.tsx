'use client';

import { useState } from 'react';
import type { BorisTip } from '@/data/community/types';

function getDayIndex(totalTips: number): number {
  const daysSinceEpoch = Math.floor(Date.now() / 86_400_000);
  return daysSinceEpoch % totalTips;
}

export default function BorisTipOfTheDay({ tips }: { tips: BorisTip[] }) {
  const todayIndex = getDayIndex(tips.length);
  const [currentIndex, setCurrentIndex] = useState(todayIndex);
  const [isShuffled, setIsShuffled] = useState(false);

  if (tips.length === 0) return null;

  const tip = tips[currentIndex];

  function handleShuffle() {
    let next: number;
    do {
      next = Math.floor(Math.random() * tips.length);
    } while (next === currentIndex && tips.length > 1);
    setCurrentIndex(next);
    setIsShuffled(true);
  }

  function handleBackToToday() {
    setCurrentIndex(todayIndex);
    setIsShuffled(false);
  }

  // Strip markdown formatting for display
  function renderContent(content: string): string {
    return content
      .split('\n')
      .filter(line => !line.startsWith('```') && !line.startsWith('> ') && !line.startsWith('---'))
      .join('\n')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .trim()
      .split('\n\n')[0]; // First paragraph only
  }

  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: 'var(--border)',
        borderLeft: '4px solid var(--color-coral)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>💡</span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--color-ink)',
            }}
          >
            Boris&apos;s Tip of the Day
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-hint)' }}>
            {currentIndex + 1} of {tips.length}
          </span>
          <button
            onClick={handleShuffle}
            style={{
              background: 'none',
              border: 'var(--border)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 12px',
              fontSize: '13px',
              color: 'var(--color-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            🔀 Shuffle
          </button>
        </div>
      </div>

      {/* Category badge */}
      <span
        style={{
          display: 'inline-block',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--color-coral)',
          backgroundColor: 'var(--color-coral-light)',
          padding: '2px 10px',
          borderRadius: 'var(--radius-full)',
          marginBottom: '12px',
        }}
      >
        {tip.category}
      </span>

      {/* Tip title */}
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--color-ink)',
          marginBottom: '10px',
          lineHeight: 1.4,
        }}
      >
        {tip.title}
      </h3>

      {/* Blockquote if present */}
      {tip.quote && (
        <blockquote
          style={{
            borderLeft: '3px solid var(--color-coral)',
            paddingLeft: '16px',
            margin: '0 0 12px 0',
            fontStyle: 'italic',
            color: 'var(--color-body)',
            fontSize: '14px',
            lineHeight: 1.7,
          }}
        >
          &ldquo;{tip.quote}&rdquo;
          <span style={{ display: 'block', fontSize: '12px', color: 'var(--color-hint)', marginTop: '4px' }}>
            — Boris Cherny
          </span>
        </blockquote>
      )}

      {/* Content preview */}
      {!tip.quote && (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--color-body)',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {renderContent(tip.content)}
        </p>
      )}

      {/* Back to today link */}
      {isShuffled && (
        <button
          onClick={handleBackToToday}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px 0 0',
            fontSize: '13px',
            color: 'var(--color-coral)',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          ← Back to today&apos;s tip
        </button>
      )}
    </div>
  );
}
