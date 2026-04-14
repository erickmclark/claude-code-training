'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { getProgress, type UserProgress, createDefaultProgress } from '@/src/lib/progress';
import { getModuleById, isModuleUnlocked } from '@/data/modules';
import { getLessonById } from '@/src/data/lessons/index';
import { lessonSummaries } from '@/data/lessons';
import { moduleCapstones } from '@/data/moduleCapstones';

const MODULE_TIP: Record<number, string> = {
  1: '"Running 3–5 worktrees simultaneously is the single biggest productivity unlock."',
  2: '"A verification loop is the difference between hoping your code works and knowing it does."',
  3: '"Custom slash commands are your personal force multipliers. Build them once, use them forever."',
  4: '"The real unlock is orchestrating agents that orchestrate agents."',
  5: '"If you do something more than once a day, turn it into a skill or command."',
  6: '"The 10x leap is not learning more techniques. It is connecting them into one workflow."',
};

export default function Page({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId: moduleIdStr } = use(params);
  const moduleId = parseInt(moduleIdStr, 10);
  const [progress, setProgress] = useState<UserProgress>(createDefaultProgress);
  useEffect(() => { setProgress(getProgress()); }, []);

  const mod = getModuleById(moduleId);

  if (!mod) {
    return (
      <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)', fontSize: 28 }}>Module not found</h1>
          <Link href="/dashboard" style={{ color: 'var(--color-coral)', fontFamily: 'var(--font-body)', textDecoration: 'none' }}>← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const completedLessonIds: number[] = Object.entries(progress.lessons)
    .filter(([, v]) => v.status === 'complete')
    .map(([k]) => parseInt(k, 10));

  // UNLOCKED — all modules open until ready to ship
  const unlocked = true;
  const modProgress = progress.modules?.[String(moduleId)];
  const moduleStatus = modProgress?.status ?? 'locked';

  const ctaLabel = moduleStatus === 'complete' ? 'Review Module' : moduleStatus === 'in-progress' ? 'Continue' : 'Start Module';
  const firstPendingLessonId = mod.lessons.find((id) => !completedLessonIds.includes(id)) ?? mod.lessons[0];

  const lessonItems = mod.lessons.map((id) => {
    const summary = lessonSummaries.find((s) => s.id === id);
    const lesson = getLessonById(id);
    const isDone = completedLessonIds.includes(id);
    const isCurrent = progress.currentLessonId === id && !isDone;
    // All lessons unlocked until ready to ship
    const isLocked = false;
    return { id, summary, lesson, isDone, isCurrent, isLocked };
  });

  const lessonsCount = mod.lessons.length;
  const quizQuestionsTotal = lessonsCount * 8;
  const exercisesTotal = lessonsCount;
  const lessonsDoneInModule = mod.lessons.filter((id) => completedLessonIds.includes(id)).length;
  const modulePct = lessonsCount > 0 ? Math.round((lessonsDoneInModule / lessonsCount) * 100) : 0;

  const prevModId = moduleId > 1 ? moduleId - 1 : null;
  const prevModComplete = prevModId ? progress.modules?.[String(prevModId)]?.status === 'complete' : true;
  // No prereq banner while everything is unlocked
  const showPrereqBanner = false;

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{ backgroundColor: '#fff', borderBottom: 'var(--border)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', gap: 32 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700 }}>CC</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--color-ink)' }}>Claude Code Training</span>
        </Link>
        <div style={{ display: 'flex', gap: 24, marginLeft: 'auto' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-body)', textDecoration: 'none' }}>Lessons</Link>
          <Link href="/dashboard" style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-coral)', textDecoration: 'none', fontWeight: 600 }}>Progress</Link>
          <Link href="/certificate" style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-body)', textDecoration: 'none' }}>Certificate</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 24 }}>
          <Link href="/dashboard" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-coral)', textDecoration: 'none' }}>← Dashboard</Link>
        </div>

        {/* Hero */}
        <div className="animate-fade-in" style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-coral)', fontWeight: 600 }}>Module {moduleId}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 12px 0' }}>{mod.title}</h1>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, backgroundColor: 'var(--color-sand)', color: 'var(--color-secondary)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: 'var(--border)' }}>{mod.difficulty}</span>
            {mod.estimatedTime && (
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, backgroundColor: 'var(--color-sand)', color: 'var(--color-secondary)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: 'var(--border)' }}>{mod.estimatedTime}</span>
            )}
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--color-body)', lineHeight: 1.7, margin: '0 0 20px 0', maxWidth: 680 }}>{mod.description}</p>
          {/* Stat row */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
            {[
              { value: String(lessonsCount), label: 'lessons' },
              { value: mod.estimatedTime ?? 'N/A', label: 'estimated time' },
              { value: String(quizQuestionsTotal), label: 'quiz questions' },
              { value: String(exercisesTotal), label: 'exercises' },
            ].map((s) => (
              <div key={s.label} style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-secondary)' }}>
                <strong style={{ color: 'var(--color-ink)' }}>{s.value}</strong> {s.label}
              </div>
            ))}
          </div>
          {unlocked && (
            <Link
              href={`/lesson/${firstPendingLessonId}`}
              style={{ display: 'inline-block', backgroundColor: 'var(--color-coral)', color: '#fff', padding: '12px 28px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, textDecoration: 'none' }}
            >
              {ctaLabel} →
            </Link>
          )}
        </div>

        {/* Main + Sidebar */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Outcomes */}
            {(mod.outcomes ?? []).length > 0 && (
              <div className="animate-fade-in-up stagger-1" style={{ backgroundColor: '#fff', border: 'var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 16px 0' }}>What You&apos;ll Be Able to Do</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {(mod.outcomes ?? []).map((outcome, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-coral)', marginTop: 7, flexShrink: 0 }} />
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-body)', margin: 0, lineHeight: 1.6 }}>{outcome}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lessons list */}
            <div className="animate-fade-in-up stagger-2" style={{ backgroundColor: '#fff', border: 'var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 16px 0' }}>Lessons</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {lessonItems.map(({ id, summary, isDone, isCurrent, isLocked }, lessonIndex) => {
                  const circleStyle: React.CSSProperties = isDone
                    ? { backgroundColor: 'var(--color-coral)', color: '#fff' }
                    : isCurrent
                    ? { backgroundColor: '#fff', border: '2px solid var(--color-coral)', color: 'var(--color-coral)' }
                    : { backgroundColor: 'var(--color-sand)', color: 'var(--color-hint)' };

                  const inner = (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 'var(--radius-md)', opacity: isLocked ? 0.5 : 1 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-full)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, ...circleStyle }}>
                        {isDone ? '✓' : lessonIndex + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--color-ink)' }}>{summary?.title ?? `Lesson ${id}`}</div>
                        {summary && (
                          <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-hint)', marginTop: 2 }}>{summary.duration}</div>
                        )}
                      </div>
                      {isDone && <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#22c55e', fontWeight: 600 }}>✓ Done</span>}
                      {isCurrent && <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--color-coral)', fontWeight: 600 }}>In progress</span>}
                      {isLocked && <span style={{ fontSize: 14 }}>🔒</span>}
                    </div>
                  );

                  return isLocked ? (
                    <div key={id}>{inner}</div>
                  ) : (
                    <Link key={id} href={`/lesson/${id}`} style={{ textDecoration: 'none', display: 'block' }}>
                      <div className="card-hover" style={{ borderRadius: 'var(--radius-md)', transition: 'background 0.15s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-sand)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                        {inner}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Module Capstone scenario */}
            {moduleCapstones[moduleId] && (() => {
              const capstone = moduleCapstones[moduleId];
              // BUILD MODE: force-unlock the module capstone card. Restore the line below before shipping.
              const capstoneUnlocked = true;
              void lessonsDoneInModule;
              // const capstoneUnlocked = lessonsDoneInModule === lessonsCount && lessonsCount > 0;
              const capstoneDone = !!modProgress?.capstoneComplete;
              const lastLessonId = mod.lessons[mod.lessons.length - 1];
              return (
                <div className="animate-fade-in-up stagger-3" style={{
                  border: '1.5px solid var(--color-coral)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 24,
                  marginBottom: 24,
                  backgroundColor: capstoneUnlocked ? 'var(--color-coral-light)' : 'var(--color-sand)',
                  opacity: capstoneUnlocked ? 1 : 0.7,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>🏆</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-coral-dark)', fontWeight: 700 }}>
                      Module Capstone · {capstone.estimatedMinutes} min
                    </span>
                    {capstoneDone && <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#22c55e', fontWeight: 600, marginLeft: 'auto' }}>✓ Complete</span>}
                    {!capstoneUnlocked && <span style={{ fontSize: 14, marginLeft: 'auto' }}>🔒</span>}
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 8px 0' }}>{capstone.title}</h2>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-body)', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                    {capstone.situation.length > 220 ? capstone.situation.slice(0, 220) + '…' : capstone.situation}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {capstone.techniques.map((t) => (
                      <span key={t} style={{ fontFamily: 'var(--font-body)', fontSize: 11, padding: '3px 10px', border: '1px solid var(--color-coral)', borderRadius: 'var(--radius-full)', color: 'var(--color-coral-dark)', backgroundColor: '#fff' }}>{t}</span>
                    ))}
                  </div>
                  {capstoneUnlocked ? (
                    <Link
                      href={`/lesson/${lastLessonId}?section=capstone`}
                      style={{ display: 'inline-block', backgroundColor: 'var(--color-coral)', color: '#fff', padding: '10px 22px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                    >
                      {capstoneDone ? 'Review Capstone' : 'Start Capstone'} →
                    </Link>
                  ) : (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-secondary)', margin: 0, fontStyle: 'italic' }}>
                      Complete all {lessonsCount} lessons to unlock this capstone scenario.
                    </p>
                  )}
                </div>
              );
            })()}

          </div>

          {/* Sidebar */}
          <div style={{ width: 256, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Prereq banner */}
            {showPrereqBanner && prevModId && (
              <div style={{ backgroundColor: '#fff8f0', border: '1px solid var(--color-coral)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-coral-dark)', margin: '0 0 8px 0', fontWeight: 600 }}>🔒 Prerequisites Required</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-body)', margin: '0 0 10px 0', lineHeight: 1.5 }}>Complete Module {prevModId} first to unlock this module.</p>
                <Link href={`/module/${prevModId}`} style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-coral)', textDecoration: 'none', fontWeight: 600 }}>Go to Module {prevModId} →</Link>
              </div>
            )}

            {/* Module progress */}
            <div style={{ backgroundColor: '#fff', border: 'var(--border)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 12px 0' }}>Progress</h3>
              <div style={{ backgroundColor: 'var(--color-sand)', borderRadius: 'var(--radius-full)', height: 6, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ width: `${modulePct}%`, height: '100%', backgroundColor: 'var(--color-coral)', transition: 'width 0.4s ease' }} />
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-secondary)', margin: '0 0 12px 0' }}>
                {lessonsDoneInModule}/{lessonsCount} lessons
              </p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {mod.lessons.map((id) => (
                  <div key={id} style={{ width: 10, height: 10, borderRadius: 'var(--radius-full)', backgroundColor: completedLessonIds.includes(id) ? 'var(--color-coral)' : 'var(--color-sand)', border: 'var(--border)' }} />
                ))}
              </div>
            </div>

            {/* Module tip */}
            <div style={{ backgroundColor: 'var(--color-coral-light)', border: '1px solid var(--color-coral)', borderRadius: 'var(--radius-md)', padding: 16 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontStyle: 'italic', color: 'var(--color-coral-dark)', lineHeight: 1.6, margin: 0 }}>
                {MODULE_TIP[moduleId] ?? MODULE_TIP[1]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
