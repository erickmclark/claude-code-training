'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getProgress, getCourseProgress, getCurrentLesson } from '@/src/lib/progress';
import { modules, isModuleUnlocked } from '@/data/modules';
import { getLessonById, getModuleForLesson } from '@/src/data/lessons';
import { lessonSummaries } from '@/data/lessons';

const MODULE_DIFFICULTY: Record<number, string> = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Advanced',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? 'yesterday' : `${days}d ago`;
}

export default function DashboardPage() {
  const [progress] = useState(() => getProgress());
  const [courseProgress] = useState(() => getCourseProgress());
  const [currentLesson] = useState(() => getCurrentLesson());

  const completedLessonIds: number[] = Object.entries(progress.lessons)
    .filter(([, v]) => v.status === 'complete')
    .map(([k]) => parseInt(k, 10));

  const lessonsDoneCount = completedLessonIds.length;
  const streakCount = progress.streak.count;

  const quizScoreValues = Object.values(progress.quizScores);
  const quizAvg =
    quizScoreValues.length > 0
      ? Math.round(quizScoreValues.reduce((a, b) => a + b, 0) / quizScoreValues.length)
      : null;

  const resumeLesson = getLessonById(currentLesson.lessonId);
  const resumeModule = getModuleForLesson(currentLesson.lessonId);

  const last14Dates: string[] = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().split('T')[0];
  });

  const moduleCardData = modules.map((mod) => {
    const unlocked = isModuleUnlocked(mod.id, completedLessonIds);
    const lessonsDone = mod.lessons.filter((id) => completedLessonIds.includes(id)).length;
    const modStatus = progress.modules[String(mod.id)]?.status ?? 'locked';
    const isComplete = modStatus === 'complete';
    const isInProgress = modStatus === 'in-progress' && !isComplete;
    const pct =
      mod.lessons.length > 0
        ? Math.round((lessonsDone / mod.lessons.length) * 100)
        : 0;
    return { mod, unlocked, lessonsDone, isComplete, isInProgress, pct };
  });

  const recentActivity = Object.entries(progress.lessons)
    .filter(([, v]) => v.status === 'complete' && v.completedAt)
    .map(([k, v]) => ({ lessonId: parseInt(k, 10), completedAt: v.completedAt! }))
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    .slice(0, 4);

  const lessonsRemaining = 20 - lessonsDoneCount;

  const statCards = [
    { value: `${lessonsDoneCount}/20`, label: 'Lessons Done' },
    { value: `${courseProgress}%`, label: 'Course Complete' },
    { value: `🔥 ${streakCount}`, label: 'Day Streak' },
    { value: quizAvg !== null ? `${quizAvg}%` : '--', label: 'Quiz Average' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh' }}>
      {/* ── Navbar ── */}
      <nav
        className="flex items-center justify-between px-6 py-3.5"
        style={{ borderBottom: 'var(--border)', backgroundColor: '#fff' }}
      >
        <div className="flex items-center gap-2.5">
          {/* Logo mark */}
          <div
            className="flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-coral)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
            }}
          >
            ✓
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 17,
              fontWeight: 600,
              color: 'var(--color-ink)',
            }}
          >
            Claude Code Training
          </span>
        </div>

        <div className="flex items-center gap-6">
          {[
            { href: '/', label: 'Lessons' },
            { href: '/dashboard', label: 'Progress' },
            { href: '/certificate', label: 'Certificate' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
                color:
                  link.href === '/dashboard'
                    ? 'var(--color-coral)'
                    : 'var(--color-secondary)',
              }}
            >
              {link.label}
            </Link>
          ))}
          {/* User avatar */}
          <div
            className="flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-coral)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              fontFamily: 'var(--font-body)',
              flexShrink: 0,
            }}
          >
            CC
          </div>
        </div>
      </nav>

      {/* ── Hero Strip ── */}
      <section
        className="px-6 pt-10 pb-6"
        style={{ maxWidth: 1100, margin: '0 auto' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--color-hint)',
            marginBottom: 4,
          }}
        >
          Good morning, there
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32,
            fontWeight: 700,
            color: 'var(--color-ink)',
            marginBottom: 4,
          }}
        >
          Pick up where you left off
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--color-secondary)',
            marginBottom: 24,
          }}
        >
          You&apos;re working through{' '}
          <span style={{ fontWeight: 600 }}>
            {resumeModule?.title ?? 'your course'}
          </span>
        </p>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="px-5 py-4"
              style={{
                backgroundColor: '#fff',
                border: 'var(--border)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 26,
                  fontWeight: 700,
                  color: 'var(--color-coral)',
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--color-hint)',
                  marginTop: 2,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Resume Banner ── */}
      <section className="px-6 pb-8" style={{ maxWidth: 1100, margin: '0 auto' }}>
        {resumeLesson ? (
          <Link
            href={`/lesson/${currentLesson.lessonId}`}
            className="flex items-center justify-between p-5"
            style={{
              backgroundColor: 'var(--color-coral-light)',
              border: '1px solid var(--color-coral)',
              borderRadius: 'var(--radius-lg)',
              textDecoration: 'none',
            }}
          >
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 28 }}>{resumeLesson.icon}</span>
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    color: 'var(--color-coral)',
                    fontWeight: 600,
                    marginBottom: 2,
                  }}
                >
                  Continue where you left off · Step {currentLesson.step + 1}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 16,
                    fontWeight: 600,
                    color: 'var(--color-ink)',
                  }}
                >
                  {resumeLesson.title}
                </p>
              </div>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--color-coral)',
                flexShrink: 0,
              }}
            >
              Resume →
            </span>
          </Link>
        ) : (
          <div
            className="p-5 text-center"
            style={{
              backgroundColor: 'var(--color-coral-light)',
              border: '1px solid var(--color-coral)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--color-ink)',
              }}
            >
              You&apos;ve completed all 20 lessons! 🏆
            </p>
          </div>
        )}
      </section>

      {/* ── Main: Module Grid + Sidebar ── */}
      <section
        className="px-6 flex flex-col lg:flex-row gap-8 pb-12"
        style={{ maxWidth: 1100, margin: '0 auto' }}
      >
        {/* Module Cards */}
        <div className="flex-1 min-w-0">
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--color-ink)',
              marginBottom: 16,
            }}
          >
            Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moduleCardData.map(
              ({ mod, unlocked, lessonsDone, isComplete, isInProgress, pct }) => {
                const accentColor = isComplete
                  ? '#22c55e'
                  : isInProgress
                  ? 'var(--color-coral)'
                  : 'var(--color-border)';

                const cardStyle = {
                  backgroundColor: isComplete
                    ? '#f0fdf4'
                    : unlocked
                    ? '#fff'
                    : 'var(--color-sand)',
                  borderTop: 'var(--border)',
                  borderRight: 'var(--border)',
                  borderBottom: 'var(--border)',
                  borderLeft: `4px solid ${accentColor}`,
                  borderRadius: 'var(--radius-lg)',
                  opacity: unlocked ? 1 : 0.5,
                  textDecoration: 'none',
                  display: 'block',
                  padding: '20px',
                };

                const inner = (
                  <>
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 11,
                            color: 'var(--color-hint)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            marginBottom: 4,
                          }}
                        >
                          Module {mod.id}
                        </p>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 20 }}>{mod.icon}</span>
                          <h3
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: 16,
                              fontWeight: 600,
                              color: 'var(--color-ink)',
                            }}
                          >
                            {mod.title}
                          </h3>
                        </div>
                      </div>
                      {/* Badge */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 10,
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--color-sand)',
                            color: 'var(--color-secondary)',
                          }}
                        >
                          {MODULE_DIFFICULTY[mod.id]}
                        </span>
                        {isComplete && (
                          <span
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: 10,
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: '#dcfce7',
                              color: '#16a34a',
                            }}
                          >
                            ✓ Complete
                          </span>
                        )}
                        {isInProgress && (
                          <span
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: 10,
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: 'var(--color-coral-light)',
                              color: 'var(--color-coral)',
                            }}
                          >
                            In progress
                          </span>
                        )}
                        {!unlocked && (
                          <span style={{ fontSize: 16 }}>🔒</span>
                        )}
                      </div>
                    </div>

                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        color: 'var(--color-secondary)',
                        marginBottom: 12,
                        lineHeight: 1.5,
                      }}
                    >
                      {mod.description}
                    </p>

                    {/* Meta row */}
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 11,
                        color: 'var(--color-hint)',
                        marginBottom: 10,
                      }}
                    >
                      {mod.lessons.length} lessons · {mod.estimatedTime ?? 'N/A'}
                    </p>

                    {/* Progress bar */}
                    <div
                      style={{
                        width: '100%',
                        height: 4,
                        backgroundColor: 'var(--color-sand)',
                        borderRadius: 'var(--radius-full)',
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          backgroundColor: isComplete
                            ? '#22c55e'
                            : 'var(--color-coral)',
                          borderRadius: 'var(--radius-full)',
                          transition: 'width 0.3s',
                        }}
                      />
                    </div>

                    {/* Lesson dots + count */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {mod.lessons.map((id) => (
                          <div
                            key={id}
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: completedLessonIds.includes(id)
                                ? isComplete
                                  ? '#22c55e'
                                  : 'var(--color-coral)'
                                : 'var(--color-sand)',
                            }}
                          />
                        ))}
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 11,
                          color: 'var(--color-hint)',
                        }}
                      >
                        {lessonsDone}/{mod.lessons.length} lessons
                      </span>
                    </div>
                  </>
                );

                if (!unlocked) {
                  return (
                    <div key={mod.id} style={cardStyle}>
                      {inner}
                    </div>
                  );
                }

                return (
                  <Link key={mod.id} href={`/module/${mod.id}`} style={cardStyle}>
                    {inner}
                  </Link>
                );
              }
            )}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-72 shrink-0 space-y-5">
          {/* Streak Calendar */}
          <div
            className="p-5"
            style={{
              backgroundColor: '#fff',
              border: 'var(--border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--color-ink)',
                marginBottom: 12,
              }}
            >
              🔥 14-Day Streak
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 4,
                marginBottom: 8,
              }}
            >
              {last14Dates.map((date, i) => {
                const dayLabel = new Date(date + 'T12:00:00').toLocaleDateString(
                  'en-US',
                  { weekday: 'narrow' }
                );
                const isActive = progress.streak.activeDates.includes(date);
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 9,
                        color: 'var(--color-hint)',
                      }}
                    >
                      {dayLabel}
                    </span>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isActive
                          ? 'var(--color-coral)'
                          : 'var(--color-sand)',
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--color-ink)',
              }}
            >
              {streakCount} day streak
            </p>
          </div>

          {/* Certificate Progress */}
          <div
            className="p-5"
            style={{
              backgroundColor:
                courseProgress >= 100 ? 'var(--color-coral-light)' : '#fff',
              border:
                courseProgress >= 100
                  ? '1px solid var(--color-coral)'
                  : 'var(--border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--color-ink)',
                marginBottom: 8,
              }}
            >
              {courseProgress >= 100 ? '🎓 Certificate Earned!' : '🎓 Certificate'}
            </h3>
            <div
              style={{
                width: '100%',
                height: 6,
                backgroundColor: 'var(--color-sand)',
                borderRadius: 'var(--radius-full)',
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: `${courseProgress}%`,
                  height: '100%',
                  backgroundColor: 'var(--color-coral)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.3s',
                }}
              />
            </div>
            {courseProgress >= 100 ? (
              <Link
                href="/certificate"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--color-coral)',
                  textDecoration: 'none',
                }}
              >
                View certificate →
              </Link>
            ) : (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  color: 'var(--color-hint)',
                }}
              >
                {lessonsRemaining} lessons remaining
              </p>
            )}
          </div>

          {/* Recent Activity */}
          <div
            className="p-5"
            style={{
              backgroundColor: '#fff',
              border: 'var(--border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--color-ink)',
                marginBottom: 12,
              }}
            >
              📋 Recent Activity
            </h3>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map(({ lessonId, completedAt }) => {
                  const summary = lessonSummaries.find((s) => s.id === lessonId);
                  if (!summary) return null;
                  return (
                    <div key={lessonId} className="flex items-center gap-2.5">
                      <span style={{ fontSize: 16 }}>{summary.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p
                          className="truncate"
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 12,
                            fontWeight: 500,
                            color: 'var(--color-ink)',
                          }}
                        >
                          {summary.title}
                        </p>
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 10,
                            color: 'var(--color-hint)',
                          }}
                        >
                          {timeAgo(completedAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--color-hint)',
                }}
              >
                Start your first lesson to see activity here.
              </p>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
