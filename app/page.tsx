'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getProgress } from '@/utils/progress';
import { lessonSummaries } from '@/data/lessons';
import { modules } from '@/data/modules';

export default function Home() {
  const [progress] = useState(() => {
    if (typeof window === 'undefined') return null;
    return getProgress();
  });

  const isComplete = (id: number) => progress?.lessons[id]?.completed;
  const completedCount = progress
    ? Object.values(progress.lessons).filter((l) => l.completed).length
    : 0;

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
          <span className="text-xs" style={{ color: 'var(--color-hint)', fontFamily: 'var(--font-body)' }}>
            Based on Boris Cherny&apos;s techniques
          </span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <section className="mb-16 text-center">
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
            20 interactive lessons to build 10x faster. Learn the techniques that top engineers use every day.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6 mb-10">
            {[
              { value: '20', label: 'Lessons' },
              { value: '4', label: 'Modules' },
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
              href="/lessons/1"
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
              {completedCount}/20
            </span>
          </div>
          <div
            className="w-full h-2"
            style={{ backgroundColor: 'var(--color-sand)', borderRadius: 'var(--radius-full)' }}
          >
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${Math.round((completedCount / 20) * 100)}%`,
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
            4 Modules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((mod) => {
              const done = mod.lessons.filter((id) => isComplete(id)).length;
              return (
                <Link key={mod.id} href={`/modules/${mod.id}`}>
                  <div
                    className="p-5 transition-all hover:shadow-sm"
                    style={{
                      backgroundColor: '#fff',
                      border: 'var(--border)',
                      borderRadius: 'var(--radius-lg)',
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{mod.icon}</span>
                      <div>
                        <h4
                          className="font-semibold text-base"
                          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
                        >
                          {mod.title}
                        </h4>
                        <p className="text-xs" style={{ color: 'var(--color-hint)', fontFamily: 'var(--font-body)' }}>
                          {mod.lessons.length} lessons · {mod.estimatedTime}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm mb-3" style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }}>
                      {mod.description}
                    </p>
                    <div
                      className="w-full h-1.5"
                      style={{ backgroundColor: 'var(--color-sand)', borderRadius: 'var(--radius-full)' }}
                    >
                      <div
                        className="h-full"
                        style={{
                          width: `${mod.lessons.length > 0 ? Math.round((done / mod.lessons.length) * 100) : 0}%`,
                          backgroundColor: 'var(--color-coral)',
                          borderRadius: 'var(--radius-full)',
                        }}
                      />
                    </div>
                    <p className="text-xs mt-2" style={{ color: 'var(--color-hint)', fontFamily: 'var(--font-body)' }}>
                      {done}/{mod.lessons.length} complete
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Boris quote */}
        <section
          className="mb-16 p-6"
          style={{
            backgroundColor: 'var(--color-coral-light)',
            border: '1px solid var(--color-coral)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--color-coral)', fontFamily: 'var(--font-body)' }}>
            From the creator
          </p>
          <blockquote
            className="text-lg font-semibold mb-3"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)', lineHeight: 1.4 }}
          >
            &ldquo;Give Claude a way to verify its work. If Claude has that feedback loop, it will 2-3x the quality of the final result.&rdquo;
          </blockquote>
          <p className="text-sm" style={{ color: 'var(--color-coral-dark)', fontFamily: 'var(--font-body)' }}>
            Boris Cherny — Creator of Claude Code at Anthropic
          </p>
        </section>

        {/* All lessons */}
        <section className="mb-16">
          <h3
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            All 20 Lessons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessonSummaries.map((lesson) => {
              const completed = isComplete(lesson.id);
              const diffColors: Record<string, { bg: string; text: string }> = {
                Beginner: { bg: '#e8f5e9', text: '#2e7d32' },
                Intermediate: { bg: '#fff3e0', text: '#e65100' },
                Advanced: { bg: '#fce4ec', text: '#c62828' },
                Expert: { bg: '#f3e5f5', text: '#6a1b9a' },
              };
              const dc = diffColors[lesson.difficulty] || diffColors.Beginner;
              return (
                <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                  <div
                    className="p-5 transition-all hover:shadow-sm"
                    style={{
                      backgroundColor: completed ? 'var(--color-coral-light)' : '#fff',
                      border: completed ? '1px solid var(--color-coral)' : 'var(--border)',
                      borderRadius: 'var(--radius-lg)',
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{lesson.icon}</span>
                      {completed && (
                        <span
                          className="w-5 h-5 flex items-center justify-center"
                          style={{ backgroundColor: 'var(--color-coral)', borderRadius: 'var(--radius-full)' }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <h4
                      className="font-semibold text-base mb-1"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
                    >
                      {lesson.title}
                    </h4>
                    <p className="text-sm mb-3" style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
                      {lesson.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-medium px-2.5 py-0.5"
                        style={{
                          backgroundColor: dc.bg,
                          color: dc.text,
                          borderRadius: 'var(--radius-full)',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {lesson.difficulty}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--color-hint)', fontFamily: 'var(--font-body)' }}>
                        {lesson.duration}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <section
          className="text-center py-12"
          style={{ borderTop: 'var(--border)' }}
        >
          <h3
            className="text-2xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            Ready to build 10x faster?
          </h3>
          <p className="mb-6" style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }}>
            Start with Lesson 1 and master Claude Code.
          </p>
          <Link
            href="/lessons/1"
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
