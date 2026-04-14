'use client';

import Link from 'next/link';
import { modules } from '@/data/modules';
import { lessonSummaries } from '@/data/lessons';

const DIFFICULTY_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  Beginner:     { bg: '#dcfce7', color: '#15803d', border: '#86efac' },
  Intermediate: { bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
  Advanced:     { bg: 'var(--color-coral-light)', color: 'var(--color-coral-dark)', border: 'var(--color-coral)' },
};

/**
 * Full course overview. Shows every module, their lessons, outcomes, and
 * total-course stats. Replaces the old per-lesson "about" screen, which was
 * misleading when users clicked the Overview button expecting a course map.
 */
export default function AboutThisCourse() {
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalMinutes = modules.reduce((sum, m) => {
    const match = (m.estimatedTime ?? '').match(/(\d+)/);
    return sum + (match ? parseInt(match[1], 10) : 0);
  }, 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

  // Curated course-level "what you'll learn" items. Intentionally higher-level
  // than per-module outcomes — the module cards below already list those in full.
  // Ordered to mirror the course progression.
  const courseOutcomes = [
    'Install Claude Code, understand the agentic loop, and use all of its built-in tools',
    'Run 3–5 parallel Claude sessions at once with git worktrees — the biggest productivity unlock',
    'Use Plan Mode and CLAUDE.md to let Claude 1-shot your implementations instead of flailing',
    'Build verification loops so Claude catches its own mistakes before you ever look at the code',
    'Speed up iteration with voice dictation, checkpoints, and rewind',
    'Create custom slash commands and lifecycle hooks to automate the repetitive parts of your workflow',
    'Integrate Claude with CI/CD, Chrome, Slack, and mobile — drive sessions from anywhere',
    'Design multi-agent systems with specialized subagents and /batch parallelization',
    'Master the daily power-user toolkit: /effort, /compact, sessions, skills, and headless mode',
    'Ship a real feature end-to-end using the full plan → build → verify → ship workflow',
  ];

  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            backgroundColor: 'var(--color-coral-light)',
            borderRadius: 'var(--radius-full)',
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 12 }}>⚡</span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-coral-dark)',
            }}
          >
            Course overview
          </span>
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 34,
            fontWeight: 700,
            color: 'var(--color-ink)',
            margin: '0 0 14px 0',
            lineHeight: 1.2,
          }}
        >
          Claude Code Mastery
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            color: 'var(--color-body)',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          A hands-on course that takes you from your first <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9em', backgroundColor: 'var(--color-sand)', padding: '2px 6px', borderRadius: 4 }}>claude</code> command to orchestrating multi-agent workflows at 10x speed. Every technique is taught with real scenarios, situational quizzes, and exercises you do in your own Claude Code session.
        </p>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          marginBottom: 32,
        }}
      >
        {[
          { value: String(modules.length), label: 'Modules' },
          { value: String(totalLessons), label: 'Lessons' },
          { value: `~${totalHours}h`, label: 'Total time' },
          { value: 'AI', label: 'Adaptive quizzes' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: '#fff',
              border: 'var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 12px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 24,
                fontWeight: 700,
                color: 'var(--color-coral)',
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: 'var(--color-hint)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* What you'll learn (course-level) */}
      <div
        style={{
          backgroundColor: '#fff',
          border: 'var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 24,
          marginBottom: 32,
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--color-ink)',
            margin: '0 0 14px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 20 }}>📚</span>
          What you&apos;ll learn
        </h2>
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            columnGap: 20,
            rowGap: 10,
          }}
        >
          {courseOutcomes.map((item, i) => (
            <li
              key={i}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--color-body)',
                lineHeight: 1.6,
                paddingLeft: 22,
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  color: 'var(--color-coral)',
                  fontWeight: 700,
                }}
              >
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Module list */}
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--color-ink)',
          margin: '0 0 16px 0',
        }}
      >
        The 7 modules
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
          marginBottom: 32,
        }}
      >
        {modules.map((mod) => {
          const firstLesson = mod.lessons[0];
          const firstLessonSummary = firstLesson
            ? lessonSummaries.find((s) => s.id === firstLesson)
            : null;
          const linkHref = firstLessonSummary ? `/lesson/${firstLesson}` : `/module/${mod.id}`;

          return (
            <Link
              key={mod.id}
              href={linkHref}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                backgroundColor: '#fff',
                border: 'var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 18,
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.15s',
                height: '100%',
              }}
            >
              {/* Card top: icon + difficulty */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 26, lineHeight: 1 }}>{mod.icon}</span>
                {mod.difficulty && (() => {
                  const c = DIFFICULTY_COLORS[mod.difficulty] ?? {
                    bg: 'var(--color-sand)',
                    color: 'var(--color-secondary)',
                    border: 'var(--color-border)',
                  };
                  return (
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        padding: '3px 9px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: c.bg,
                        color: c.color,
                        border: `1px solid ${c.border}`,
                      }}
                    >
                      {mod.difficulty}
                    </span>
                  );
                })()}
              </div>

              {/* Title — reserved height for 2 lines so the divider aligns across cards */}
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 15,
                  fontWeight: 700,
                  color: 'var(--color-ink)',
                  margin: '0 0 6px 0',
                  lineHeight: 1.3,
                  minHeight: 'calc(1.3em * 2)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {mod.title}
              </h3>

              {/* Description — clamped to 3 lines so all cards have matching vertical rhythm */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--color-body)',
                  lineHeight: 1.55,
                  margin: '0 0 10px 0',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: 'calc(1.55em * 3)',
                }}
              >
                {mod.description}
              </p>

              {/* Lesson count / duration */}
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  fontFamily: 'var(--font-body)',
                  fontSize: 10,
                  color: 'var(--color-hint)',
                  marginBottom: 12,
                }}
              >
                <span>
                  <strong style={{ color: 'var(--color-secondary)' }}>{mod.lessons.length}</strong>{' '}
                  lesson{mod.lessons.length === 1 ? '' : 's'}
                </span>
                {mod.estimatedTime && <span>· {mod.estimatedTime}</span>}
              </div>

              {/* Outcomes — natural flow (no margin:auto) since top content is now fixed-height */}
              {mod.outcomes && mod.outcomes.length > 0 && (
                <ul
                  style={{
                    margin: 0,
                    padding: '10px 0 0 0',
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    borderTop: 'var(--border)',
                  }}
                >
                  {mod.outcomes.map((outcome, i) => (
                    <li
                      key={i}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 11,
                        color: 'var(--color-secondary)',
                        lineHeight: 1.55,
                        paddingLeft: 14,
                        position: 'relative',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: 0,
                          color: 'var(--color-coral)',
                          fontSize: 9,
                        }}
                      >
                        →
                      </span>
                      {outcome}
                    </li>
                  ))}
                </ul>
              )}
            </Link>
          );
        })}
      </div>

      {/* Who this is for */}
      <div
        style={{
          backgroundColor: 'var(--color-coral-light)',
          border: '1px solid var(--color-coral)',
          borderRadius: 'var(--radius-lg)',
          padding: 24,
          marginBottom: 32,
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--color-coral-dark)',
            margin: '0 0 10px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 18 }}>👤</span>
          Who this is for
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: 'var(--color-body)',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Developers who already write code and want to go from &quot;Claude Code is a better autocomplete&quot; to &quot;Claude Code is how I build and ship software.&quot; No prior Claude Code experience required — the first module starts with installation and ends with you running your first agentic session. By the end of the course you will be orchestrating parallel agents, verifying your own work, and shipping features in a fraction of the time.
        </p>
      </div>
    </div>
  );
}
