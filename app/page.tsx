'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getProgress } from '@/utils/progress';
import { modules } from '@/data/modules';

const diffColors: Record<string, { bg: string; text: string }> = {
  Beginner: { bg: '#e8f5e9', text: '#2e7d32' },
  Intermediate: { bg: '#fff3e0', text: '#e65100' },
  Advanced: { bg: '#fce4ec', text: '#c62828' },
  Expert: { bg: '#f3e5f5', text: '#6a1b9a' },
};

export default function Home() {
  const [progress, setProgress] = useState<ReturnType<typeof getProgress> | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const isComplete = (id: number) => progress?.lessons[id]?.completed;
  const completedCount = progress
    ? Object.values(progress.lessons).filter((l) => l.completed).length
    : 0;

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-10 px-6 py-4"
        style={{
          backgroundColor: 'var(--color-cream)',
          borderBottom: 'var(--border)',
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1
            className="text-xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            Claude Code Mastery
          </h1>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <section className="mb-16 text-center animate-fade-in">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)', lineHeight: 1.2 }}
          >
            Master Claude Code
          </h2>
          <p
            className="text-lg mb-10 max-w-xl mx-auto"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-secondary)', lineHeight: 1.6 }}
          >
            {totalLessons} interactive lessons to build 10x faster. Learn the techniques that top engineers use every day.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6 mb-10 animate-fade-in-up stagger-1">
            {[
              { value: String(totalLessons), label: 'Lessons' },
              { value: String(modules.length), label: 'Modules' },
              { value: '10x', label: 'Faster' },
            ].map((s) => (
              <div
                key={s.label}
                className="px-6 py-4"
                style={{
                  border: 'var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: '#fff',
                }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-coral)' }}
                >
                  {s.value}
                </div>
                <div className="text-xs" style={{ color: 'var(--color-hint)', fontFamily: 'var(--font-body)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex justify-center gap-3">
            <Link
              href="/lesson/34"
              className="px-7 py-3 text-sm font-semibold"
              style={{
                backgroundColor: 'var(--color-coral)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Start Learning →
            </Link>
            <Link
              href="/getting-started"
              className="px-7 py-3 text-sm font-semibold"
              style={{
                border: 'var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-secondary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Install Claude Code
            </Link>
          </div>
        </section>

        {/* Progress bar */}
        <section
          className="mb-16 p-6"
          style={{
            backgroundColor: '#fff',
            border: 'var(--border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-sm font-semibold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
            >
              Your Progress
            </span>
            <span
              className="text-sm font-bold"
              style={{ color: 'var(--color-coral)', fontFamily: 'var(--font-body)' }}
            >
              {completedCount}/{totalLessons}
            </span>
          </div>
          <div
            className="w-full h-2"
            style={{ backgroundColor: 'var(--color-sand)', borderRadius: 'var(--radius-full)' }}
          >
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${Math.round((completedCount / totalLessons) * 100)}%`,
                backgroundColor: 'var(--color-coral)',
                borderRadius: 'var(--radius-full)',
              }}
            />
          </div>
        </section>

        {/* Modules */}
        <section className="mb-16">
          <h3
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            Modules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod) => {
              const done = mod.lessons.filter((id) => isComplete(id)).length;
              const pct = mod.lessons.length > 0 ? Math.round((done / mod.lessons.length) * 100) : 0;
              const dc = diffColors[mod.difficulty ?? 'Beginner'];
              const isAllDone = done === mod.lessons.length && mod.lessons.length > 0;

              const href = mod.id === 6 ? '/capstone' : `/module/${mod.id}`;
              return (
                <Link key={mod.id} href={href} style={{ textDecoration: 'none' }} className={`animate-fade-in-up stagger-${mod.id}`}>
                  <div
                    className="h-full card-hover"
                    style={{
                      backgroundColor: '#fff',
                      border: isAllDone ? '1.5px solid var(--color-coral)' : 'var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '24px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Icon + badge row */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{mod.icon}</span>
                      <span
                        className="text-xs font-medium px-2 py-0.5"
                        style={{
                          backgroundColor: dc.bg,
                          color: dc.text,
                          borderRadius: 'var(--radius-full)',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {mod.difficulty}
                      </span>
                    </div>

                    {/* Title */}
                    <h4
                      className="font-semibold text-base mb-1"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
                    >
                      {mod.title}
                    </h4>

                    {/* Description */}
                    <p
                      className="text-xs mb-3"
                      style={{
                        color: 'var(--color-secondary)',
                        fontFamily: 'var(--font-body)',
                        lineHeight: 1.5,
                        flex: 1,
                      }}
                    >
                      {mod.description}
                    </p>

                    {/* Stats */}
                    <p
                      className="text-xs mb-3"
                      style={{ color: 'var(--color-hint)', fontFamily: 'var(--font-body)' }}
                    >
                      {mod.lessons.length} lessons · {mod.estimatedTime}
                    </p>

                    {/* Progress bar */}
                    <div className="flex items-center gap-3">
                      <div
                        className="flex-1 h-1.5"
                        style={{ backgroundColor: 'var(--color-sand)', borderRadius: 'var(--radius-full)' }}
                      >
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: 'var(--color-coral)',
                            borderRadius: 'var(--radius-full)',
                          }}
                        />
                      </div>
                      <span
                        className="text-xs shrink-0"
                        style={{ color: 'var(--color-hint)', fontFamily: 'var(--font-body)' }}
                      >
                        {done}/{mod.lessons.length}
                      </span>
                    </div>

                    {/* CTA */}
                    <div className="mt-3 text-right">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: 'var(--color-coral)', fontFamily: 'var(--font-body)' }}
                      >
                        {isAllDone ? 'Review →' : done > 0 ? 'Continue →' : 'Start →'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Pro tip */}
        <section
          className="mb-16 p-6 animate-fade-in-up"
          style={{
            backgroundColor: 'var(--color-coral-light)',
            border: '1px solid var(--color-coral)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--color-coral)', fontFamily: 'var(--font-body)' }}>
            Pro tip
          </p>
          <blockquote
            className="text-lg font-semibold mb-3"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)', lineHeight: 1.4 }}
          >
            &ldquo;Give Claude a way to verify its work. If Claude has that feedback loop, it will 2-3x the quality of the final result.&rdquo;
          </blockquote>
          <p className="text-sm" style={{ color: 'var(--color-coral-dark)', fontFamily: 'var(--font-body)' }}>
            The #1 technique for better Claude Code results
          </p>
        </section>

        {/* Bottom CTA */}
        <section
          className="text-center py-12 animate-fade-in-up"
          style={{ borderTop: 'var(--border)' }}
        >
          <h3
            className="text-2xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            Ready to build 10x faster?
          </h3>
          <p className="mb-6" style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }}>
            Start with the basics and master Claude Code.
          </p>
          <Link
            href="/lesson/34"
            className="inline-block px-8 py-3 text-sm font-semibold"
            style={{
              backgroundColor: 'var(--color-coral)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Begin Your Journey →
          </Link>
        </section>
      </main>
    </div>
  );
}
