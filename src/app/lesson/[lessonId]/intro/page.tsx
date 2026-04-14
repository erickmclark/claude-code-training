'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProgress, updateStreak, saveUserLevel } from '@/src/lib/progress';
import { getLessonById, getModuleForLesson } from '@/src/data/lessons/index';
import ChatWidget from '@/src/components/chat/ChatWidget';

export default function Page({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId: lessonIdStr } = use(params);
  const lessonId = parseInt(lessonIdStr, 10);
  const router = useRouter();

  const [progress] = useState(() => getProgress());
  const [selectedLevel, setSelectedLevel] = useState<'A' | 'B' | 'C' | null>(null);
  const [levelSaved, setLevelSaved] = useState(false);

  const lesson = getLessonById(lessonId);
  const mod = getModuleForLesson(lessonId);

  if (!lesson) {
    return (
      <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)', fontSize: 28 }}>Lesson not found</h1>
          <Link href="/dashboard" style={{ color: 'var(--color-coral)', fontFamily: 'var(--font-body)', textDecoration: 'none' }}>← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const showKnowledgeCheck = progress.userLevel === null && !levelSaved;

  const stepsCount = lesson.steps.length;
  const quizCount = lesson.quiz?.length ?? 0;
  const hasExercise = !!lesson.exercise;
  const durationMinutes = parseInt(lesson.duration.match(/\d+/)?.[0] ?? '0', 10);

  const completedLessonIds: number[] = Object.entries(progress.lessons)
    .filter(([, v]) => v.status === 'complete')
    .map(([k]) => parseInt(k, 10));

  const modLessons = mod?.lessons ?? [];
  const modLessonsDone = modLessons.filter((id) => completedLessonIds.includes(id)).length;
  const modPct = modLessons.length > 0 ? Math.round((modLessonsDone / modLessons.length) * 100) : 0;

  const lessonIdxInModule = modLessons.indexOf(lessonId);
  const prevLessonId = lessonIdxInModule > 0 ? modLessons[lessonIdxInModule - 1] : null;
  const nextLessonId = lessonIdxInModule < modLessons.length - 1 ? modLessons[lessonIdxInModule + 1] : null;
  const prevLesson = prevLessonId ? getLessonById(prevLessonId) : null;
  const nextLesson = nextLessonId ? getLessonById(nextLessonId) : null;

  const handleLevelSelect = (level: 'A' | 'B' | 'C') => {
    setSelectedLevel(level);
    saveUserLevel(level);
    setLevelSaved(true);
  };

  const handleStartLesson = () => {
    updateStreak();
    router.push(`/lesson/${lessonId}`);
  };

  const levelResponses: Record<'A' | 'B' | 'C', string> = {
    A: "Great! We'll start from the very beginning and build your foundation.",
    B: "Perfect! We'll reinforce what you know and fill in the gaps.",
    C: "Excellent! You'll pick up advanced patterns and optimization techniques.",
  };

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
          <Link href="/dashboard" style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-body)', textDecoration: 'none' }}>Progress</Link>
          <Link href="/certificate" style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-body)', textDecoration: 'none' }}>Certificate</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, fontFamily: 'var(--font-body)', fontSize: 13 }}>
            <Link href={`/module/${mod?.id}`} style={{ color: 'var(--color-coral)', textDecoration: 'none' }}>
              {mod?.title ?? 'Module'}
            </Link>
            <span style={{ color: 'var(--color-hint)' }}>›</span>
            <span style={{ color: 'var(--color-secondary)' }}>{lesson.title}</span>
          </div>
          {/* Badges */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, backgroundColor: 'var(--color-sand)', color: 'var(--color-secondary)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: 'var(--border)' }}>Lesson {lessonId}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, backgroundColor: 'var(--color-sand)', color: 'var(--color-secondary)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: 'var(--border)' }}>{lesson.difficulty}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, backgroundColor: 'var(--color-sand)', color: 'var(--color-secondary)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: 'var(--border)' }}>{lesson.duration}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 10px 0' }}>{lesson.title}</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontStyle: 'italic', color: 'var(--color-body)', margin: 0, lineHeight: 1.6 }}>{lesson.description}</p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
          {[
            { value: String(stepsCount), label: 'Steps' },
            { value: String(quizCount), label: 'Quiz Questions' },
            { value: hasExercise ? 'Included' : 'None', label: 'Exercise' },
            { value: String(durationMinutes), label: 'Minutes' },
          ].map((tile) => (
            <div key={tile.label} style={{ backgroundColor: '#fff', border: 'var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--color-coral)', lineHeight: 1 }}>{tile.value}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-hint)', marginTop: 6 }}>{tile.label}</div>
            </div>
          ))}
        </div>

        {/* Main + Sidebar */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          {/* Main */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Coming Up Roadmap */}
            <div style={{ backgroundColor: '#fff', border: 'var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 20px 0' }}>What&apos;s Coming Up</h2>
              <div style={{ borderLeft: '2px solid var(--color-border)', paddingLeft: 20, marginLeft: 16 }}>
                {/* Step dots */}
                {lesson.steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, marginLeft: -32 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-sand)', border: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ paddingTop: 6 }}>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--color-ink)' }}>{step.title}</div>
                    </div>
                  </div>
                ))}
                {/* Quiz dot */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, marginLeft: -32 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>Q</div>
                  <div style={{ paddingTop: 6 }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--color-ink)' }}>Knowledge Quiz</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-hint)', marginTop: 2 }}>{quizCount} questions</div>
                  </div>
                </div>
                {/* Exercise dot */}
                {hasExercise && (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginLeft: -32 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-full)', backgroundColor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>Ex</div>
                    <div style={{ paddingTop: 6 }}>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--color-ink)' }}>{lesson.exercise?.title ?? 'Practice Exercise'}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Knowledge Check */}
            {showKnowledgeCheck && (
              <div style={{ backgroundColor: '#fff', border: 'var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 8px 0' }}>Quick Check-In</h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-body)', margin: '0 0 20px 0' }}>What best describes your experience with Claude Code?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {([
                    { key: 'A' as const, label: 'A — Brand new, never used it before' },
                    { key: 'B' as const, label: 'B — Some experience, want to fill gaps' },
                    { key: 'C' as const, label: 'C — Experienced, want advanced patterns' },
                  ]).map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => handleLevelSelect(key)}
                      style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: selectedLevel === key ? '2px solid var(--color-coral)' : 'var(--border)',
                        backgroundColor: selectedLevel === key ? 'var(--color-coral-light)' : '#fff',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        fontSize: 14,
                        color: 'var(--color-ink)',
                        transition: 'all 0.15s',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {selectedLevel && (
                  <div style={{ marginTop: 16, padding: 14, backgroundColor: 'var(--color-coral-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-coral)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-coral-dark)', margin: 0, lineHeight: 1.5 }}>{levelResponses[selectedLevel]}</p>
                  </div>
                )}
                {!selectedLevel && (
                  <button
                    onClick={() => setLevelSaved(true)}
                    style={{ marginTop: 12, fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-hint)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                  >
                    Skip
                  </button>
                )}
              </div>
            )}

            {/* Start button */}
            <button
              onClick={handleStartLesson}
              style={{ backgroundColor: 'var(--color-coral)', color: '#fff', padding: '14px 32px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, border: 'none', cursor: 'pointer', width: '100%' }}
            >
              Start Lesson →
            </button>
          </div>

          {/* Sidebar */}
          <div style={{ width: 256, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Module progress card */}
            {mod && (
              <div style={{ backgroundColor: '#fff', border: 'var(--border)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 10px 0' }}>{mod.title}</h3>
                <div style={{ backgroundColor: 'var(--color-sand)', borderRadius: 'var(--radius-full)', height: 6, overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ width: `${modPct}%`, height: '100%', backgroundColor: 'var(--color-coral)', transition: 'width 0.4s ease' }} />
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-hint)', margin: '0 0 12px 0' }}>{modLessonsDone}/{modLessons.length} lessons complete</p>
                <Link href={`/module/${mod.id}`} style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-coral)', textDecoration: 'none', fontWeight: 600 }}>View module →</Link>
              </div>
            )}

            {/* Lesson sequence */}
            <div style={{ backgroundColor: '#fff', border: 'var(--border)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 12px 0' }}>Lesson Sequence</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {prevLesson && prevLessonId && (
                  <Link href={`/lesson/${prevLessonId}/intro`} style={{ textDecoration: 'none', display: 'block', padding: '8px 10px', borderRadius: 'var(--radius-md)', border: 'var(--border)' }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--color-hint)', marginBottom: 2 }}>← Previous</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-secondary)' }}>{prevLesson.title}</div>
                  </Link>
                )}
                <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-coral-light)', border: '1px solid var(--color-coral)' }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--color-coral)', marginBottom: 2, fontWeight: 600 }}>Current</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-coral-dark)', fontWeight: 600 }}>→ {lesson.title}</div>
                </div>
                {nextLesson && (
                  <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-md)', border: 'var(--border)', opacity: 0.5 }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--color-hint)', marginBottom: 2 }}>Next up</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-secondary)' }}>{nextLesson.title}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Tip card */}
            <div style={{ backgroundColor: 'var(--color-sand)', border: 'var(--border)', borderRadius: 'var(--radius-lg)', padding: 16 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-body)', margin: 0, lineHeight: 1.6 }}>
                💡 Have Claude Code open while learning. Try every command as you go.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ChatWidget
        lessonTitle={lesson.title}
        lessonId={lessonId}
        moduleTitle={mod?.title}
        currentSection="intro"
      />
    </div>
  );
}
