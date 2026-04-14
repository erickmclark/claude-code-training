'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { modules, isModuleUnlocked } from '@/data/modules';
import { lessonSummaries, lessons as allLessons } from '@/data/lessons';
import { practiceExercises } from '@/data/practiceExercises';
import { getProgress } from '@/utils/progress';

const DIFF_STYLE: Record<string, { bg: string; color: string }> = {
  Beginner:     { bg: '#e8f5e9', color: '#2e7d32' },
  Intermediate: { bg: '#fff3e0', color: '#c76e00' },
  Advanced:     { bg: '#fce4ec', color: '#c62828' },
  Expert:       { bg: '#f3e5f5', color: '#6a1b9a' },
};

export default function ModulePage() {
  const params = useParams();
  const moduleId = parseInt(params.id as string, 10);
  const mod = modules.find((m) => m.id === moduleId);

  const [data] = useState(() => {
    if (typeof window === 'undefined') return { completedLessons: [] as number[], unlocked: true };
    const progress = getProgress();
    const completed = Object.values(progress.lessons)
      .filter((l) => l.completed)
      .map((l) => l.lessonId);
    return {
      completedLessons: completed,
      unlocked: isModuleUnlocked(moduleId, completed),
    };
  });

  if (!mod) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }}>Module not found.</p>
      </div>
    );
  }

  const moduleLessons = mod.lessons
    .map((id) => lessonSummaries.find((l) => l.id === id))
    .filter(Boolean) as typeof lessonSummaries;

  const fullLessons = mod.lessons
    .map((id) => allLessons.find((l) => l.id === id))
    .filter(Boolean) as typeof allLessons;

  const totalQuizQuestions = fullLessons.reduce((sum, l) => sum + (l.quiz?.length || 0), 0);
  const totalExercises = mod.lessons.reduce((sum, id) => sum + (practiceExercises[id]?.length || 0), 0);

  const completedCount = moduleLessons.filter((l) => data.completedLessons.includes(l.id)).length;
  const progressPct = moduleLessons.length > 0 ? Math.round((completedCount / moduleLessons.length) * 100) : 0;

  const prevMod = moduleId > 1 ? modules.find((m) => m.id === moduleId - 1) : null;
  const diff = mod.difficulty || 'Beginner';
  const diffStyle = DIFF_STYLE[diff] || DIFF_STYLE.Beginner;

  if (!data.unlocked) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-cream)' }}>
        <nav style={{ borderBottom: 'var(--border)', padding: '12px 24px' }}>
          <Link href="/" style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', fontSize: '14px', textDecoration: 'none' }}>← All Modules</Link>
        </nav>
        <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)', fontSize: '28px', marginBottom: '12px' }}>Module Locked</h1>
          <p style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
            Complete {prevMod ? `Module ${prevMod.id} · ${prevMod.title}` : 'the previous module'} before unlocking all lessons in this module.
          </p>
          {prevMod && (
            <Link href={`/modules/${prevMod.id}`} style={{ color: 'var(--color-coral)', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
              Go to Module {prevMod.id} →
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-cream)' }}>
      {/* Top nav */}
      <nav style={{ borderBottom: 'var(--border)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', fontSize: '14px', textDecoration: 'none' }}>
          Module {moduleId}
        </Link>
        <span style={{ color: 'var(--color-hint)', fontSize: '14px' }}>·</span>
        <span style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>{mod.title}</span>
      </nav>

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '36px 24px 64px' }}>
        {/* Eyebrow badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-body)', padding: '4px 12px', border: 'var(--border)', borderRadius: 'var(--radius-full)', color: 'var(--color-secondary)' }}>
            Module {moduleId} of {modules.length}
          </span>
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-body)', padding: '4px 12px', borderRadius: 'var(--radius-full)', backgroundColor: diffStyle.bg, color: diffStyle.color, fontWeight: 600 }}>
            {diff}
          </span>
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-body)', padding: '4px 12px', border: 'var(--border)', borderRadius: 'var(--radius-full)', color: 'var(--color-secondary)' }}>
            {mod.estimatedTime} total
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)', fontSize: '42px', fontWeight: 700, marginBottom: '14px', lineHeight: 1.15 }}>
          {mod.title}
        </h1>

        {/* Description */}
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-body)', fontSize: '16px', lineHeight: 1.65, marginBottom: '28px', maxWidth: 580 }}>
          {mod.description}
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '44px' }}>
          {[
            { label: `${moduleLessons.length} lesson${moduleLessons.length !== 1 ? 's' : ''}` },
            { label: mod.estimatedTime || '' },
            { label: `${totalQuizQuestions} quiz questions` },
            { label: `${totalExercises} exercise${totalExercises !== 1 ? 's' : ''}` },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--color-hint)', fontSize: '15px' }}>
                {i === 0 ? '☰' : i === 1 ? '◷' : i === 2 ? '↗' : '+'}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-secondary)', fontSize: '14px' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

          {/* Left column */}
          <div>
            {/* Outcomes */}
            {mod.outcomes && mod.outcomes.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', marginBottom: '16px', textTransform: 'uppercase' }}>
                  WHAT YOU&apos;LL BE ABLE TO DO
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {mod.outcomes.map((outcome) => (
                    <div key={outcome} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--color-coral-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l2.5 2.5L9 1" stroke="var(--color-coral)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-body)', fontSize: '15px', lineHeight: 1.5 }}>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lessons */}
            <div style={{ marginBottom: '40px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', marginBottom: '16px', textTransform: 'uppercase' }}>
                LESSONS IN THIS MODULE
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {moduleLessons.map((lesson) => {
                  const done = data.completedLessons.includes(lesson.id);
                  return (
                    <Link key={lesson.id} href={`/lesson/${lesson.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
                        borderRadius: 'var(--radius-md)', border: 'var(--border)',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                      }}>
                        {/* Number circle */}
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          backgroundColor: done ? 'var(--color-coral)' : 'var(--color-sand)',
                          color: done ? '#fff' : 'var(--color-secondary)',
                          fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 700,
                        }}>
                          {done ? '✓' : lesson.id}
                        </div>

                        {/* Title + meta */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                            {lesson.title}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-hint)', fontSize: '12px' }}>{lesson.duration}</span>
                          </div>
                        </div>

                        {/* Completion indicator */}
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: done ? 'none' : '1.5px solid var(--color-border)',
                          backgroundColor: done ? 'var(--color-coral)' : 'transparent',
                        }}>
                          {done ? (
                            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                              <path d="M1 5l3 3L11 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            <svg width="7" height="11" viewBox="0 0 7 11" fill="none">
                              <path d="M1 5V3a2.5 2.5 0 015 0v2" stroke="var(--color-border)" strokeWidth="1.4" strokeLinecap="round" />
                              <rect x="0.7" y="4.7" width="5.6" height="5.6" rx="0.8" stroke="var(--color-border)" strokeWidth="1.4" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* What's included */}
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', marginBottom: '16px', textTransform: 'uppercase' }}>
                WHAT&apos;S INCLUDED
              </p>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { count: moduleLessons.length, label: 'Lessons' },
                  { count: totalQuizQuestions, label: 'Quiz questions' },
                  { count: totalExercises, label: 'Exercises' },
                  { count: 1, label: 'Capstone' },
                ].map((item) => (
                  <div key={item.label} style={{ textAlign: 'center', padding: '16px 8px', border: 'var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: '#fff' }}>
                    <p style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)', fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>{item.count}</p>
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-hint)', fontSize: '11px' }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Prerequisite */}
            {prevMod && (
              <div style={{ padding: '16px', border: '1.5px solid var(--color-coral)', borderRadius: 'var(--radius-md)', backgroundColor: '#fff' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-coral)', fontFamily: 'var(--font-body)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Prerequisite
                </p>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-body)', fontSize: '13px', lineHeight: 1.55, marginBottom: '10px' }}>
                  Complete Module {prevMod.id} · {prevMod.title} before unlocking all lessons in this module.
                </p>
                <Link href={`/modules/${prevMod.id}`} style={{ color: 'var(--color-coral)', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                  Go to Module {prevMod.id} →
                </Link>
              </div>
            )}

            {/* Progress card */}
            <div style={{ padding: '16px', border: 'var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: '#fff' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', marginBottom: '12px', textTransform: 'uppercase' }}>
                YOUR PROGRESS
              </p>
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', fontSize: '13px', fontWeight: 600 }}>Module {moduleId}</span>
                  <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-coral)', fontSize: '13px', fontWeight: 600 }}>{progressPct}%</span>
                </div>
                <div style={{ height: '4px', backgroundColor: 'var(--color-sand)', borderRadius: 'var(--radius-full)' }}>
                  <div style={{ height: '100%', width: `${progressPct}%`, backgroundColor: 'var(--color-coral)', borderRadius: 'var(--radius-full)', transition: 'width 0.3s' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {moduleLessons.map((lesson) => {
                  const done = data.completedLessons.includes(lesson.id);
                  return (
                    <div key={lesson.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, backgroundColor: done ? 'var(--color-coral)' : 'var(--color-border)' }} />
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: done ? 'var(--color-secondary)' : 'var(--color-hint)', textDecoration: done ? 'line-through' : 'none' }}>
                        {lesson.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Before you start */}
            {mod.tip && (
              <div style={{ padding: '16px', border: 'var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: '#fff' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-coral)', fontFamily: 'var(--font-body)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Before You Start
                </p>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-body)', fontSize: '13px', lineHeight: 1.6 }}>
                  {mod.tip}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
