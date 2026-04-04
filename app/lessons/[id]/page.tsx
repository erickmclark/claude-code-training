'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import ChatWidget from '@/src/components/chat/ChatWidget';
import { lessons } from '@/data/lessons';
import { modules } from '@/data/modules';
import { practiceExercises } from '@/data/practiceExercises';
import { getLessonProgress, markLessonComplete, toggleStepComplete } from '@/utils/progress';

const DIFF_STYLE: Record<string, { bg: string; color: string }> = {
  Beginner:     { bg: '#e8f5e9', color: '#2e7d32' },
  Intermediate: { bg: '#fff3e0', color: '#c76e00' },
  Advanced:     { bg: '#fce4ec', color: '#c62828' },
  Expert:       { bg: '#f3e5f5', color: '#6a1b9a' },
};

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const lessonId = parseInt(id, 10);
  const lesson = lessons.find((l) => l.id === lessonId);
  const mod = modules.find((m) => m.lessons.includes(lessonId));
  const exercises = practiceExercises[lessonId] || [];

  const [experienceLevel, setExperienceLevel] = useState<'A' | 'B' | 'C' | null>(null);

  const [activeSection, setActiveSection] = useState<'intro' | 'learn' | 'practice' | 'quiz'>(() => {
    if (typeof window === 'undefined') return 'intro';
    const progress = getLessonProgress(lessonId);
    return progress.stepsCompleted.length > 0 || progress.completed ? 'learn' : 'intro';
  });

  const [activeStep, setActiveStep] = useState(0);
  const [stepsCompleted, setStepsCompleted] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    return getLessonProgress(lessonId).stepsCompleted;
  });
  const [quizCompleted, setQuizCompleted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return getLessonProgress(lessonId).completed;
  });
  const [quizState, setQuizState] = useState<{ index: number; selected: number | null; showFeedback: boolean; correct: number }>({
    index: 0, selected: null, showFeedback: false, correct: 0,
  });

  const [modProgress] = useState(() => {
    if (!mod || typeof window === 'undefined') return { completedLessons: [] as number[] };
    // gather all completed lessons across the module
    const allCompleted: number[] = [];
    mod.lessons.forEach((lid) => {
      const p = getLessonProgress(lid);
      if (p.completed) allCompleted.push(lid);
    });
    return { completedLessons: allCompleted };
  });

  if (!lesson) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)', fontSize: '24px' }}>Lesson not found</h1>
          <Link href="/" style={{ color: 'var(--color-coral)', fontFamily: 'var(--font-body)', fontSize: '14px', marginTop: '16px', display: 'inline-block' }}>← Back</Link>
        </div>
      </div>
    );
  }

  const totalSteps = lesson.steps.length;
  const progressPct = totalSteps > 0 ? Math.round((stepsCompleted.length / totalSteps) * 100) : 0;
  const prevId = lessonId > 1 ? lessonId - 1 : null;
  const nextId = lessonId < lessons.length ? lessonId + 1 : null;
  const step = lesson.steps[activeStep];
  const diffStyle = DIFF_STYLE[lesson.difficulty] || DIFF_STYLE.Beginner;

  const handleNextStep = () => {
    if (!stepsCompleted.includes(activeStep)) {
      toggleStepComplete(lessonId, activeStep);
      setStepsCompleted((p) => [...p, activeStep]);
    }
    if (activeStep + 1 < totalSteps) setActiveStep(activeStep + 1);
    else if (lesson.quiz.length > 0) setActiveSection('quiz');
  };

  const handleQuizSelect = (optIndex: number) => {
    if (quizState.showFeedback) return;
    const isCorrect = optIndex === lesson.quiz[quizState.index].correctIndex;
    setQuizState((s) => ({ ...s, selected: optIndex, showFeedback: true, correct: s.correct + (isCorrect ? 1 : 0) }));
  };

  const handleQuizNext = () => {
    if (quizState.index + 1 >= lesson.quiz.length) {
      const score = Math.round(((quizState.correct + (quizState.selected === lesson.quiz[quizState.index].correctIndex ? 1 : 0)) / lesson.quiz.length) * 100);
      setQuizCompleted(true);
      markLessonComplete(lessonId, score);
    } else {
      setQuizState((s) => ({ ...s, index: s.index + 1, selected: null, showFeedback: false }));
    }
  };

  const handleStartLesson = () => setActiveSection('learn');

  const handleExperienceAnswer = (level: 'A' | 'B' | 'C') => {
    setExperienceLevel(level);
    setTimeout(() => setActiveSection('learn'), 300);
  };

  const LETTERS = ['A', 'B', 'C', 'D'];

  // ─── INTRO SCREEN ────────────────────────────────────────────────────────
  if (activeSection === 'intro') {
    const firstSentence = lesson.description.split(/(?<=[.!?])\s/)[0];
    const modLessons = mod ? mod.lessons.map((lid) => lessons.find((l) => l.id === lid)).filter(Boolean) as typeof lessons : [];
    const modCompletedCount = modProgress.completedLessons.length;
    const modTotal = modLessons.length;

    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-cream)' }}>
        {/* Top nav */}
        <nav style={{ borderBottom: 'var(--border)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {mod && (
            <Link href={`/modules/${mod.id}`} style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', fontSize: '14px', textDecoration: 'none' }}>
              Module {mod.id}
            </Link>
          )}
          {mod && <span style={{ color: 'var(--color-hint)', fontSize: '14px' }}>·</span>}
          <span style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            Lesson {lessonId} · {lesson.title}
          </span>
        </nav>

        <div style={{ maxWidth: 980, margin: '0 auto', padding: '36px 24px 64px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 items-start">

            {/* Left: lesson intro */}
            <div>
              {/* Eyebrow */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-body)', padding: '4px 12px', border: 'var(--border)', borderRadius: 'var(--radius-full)', color: 'var(--color-secondary)' }}>
                  Lesson {lessonId}
                </span>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-body)', fontWeight: 600, padding: '4px 12px', borderRadius: 'var(--radius-full)', backgroundColor: diffStyle.bg, color: diffStyle.color }}>
                  {lesson.difficulty}
                </span>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-body)', padding: '4px 12px', border: 'var(--border)', borderRadius: 'var(--radius-full)', color: 'var(--color-secondary)' }}>
                  {lesson.duration}
                </span>
              </div>

              {/* Title */}
              <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)', fontSize: '38px', fontWeight: 700, marginBottom: '12px', lineHeight: 1.2 }}>
                {lesson.title}
              </h1>

              {/* Italic subtitle */}
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-secondary)', fontSize: '16px', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '28px' }}>
                {firstSentence}
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-3" style={{ marginBottom: '36px' }}>
                {[
                  { count: totalSteps, label: 'Concept steps' },
                  { count: lesson.quiz.length, label: 'Quiz questions' },
                  { count: exercises.length, label: exercises.length === 1 ? 'Exercise' : 'Exercises' },
                  { count: parseInt(lesson.duration) || 10, label: 'Minutes' },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: 'center', padding: '16px 8px', border: 'var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: '#fff' }}>
                    <p style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)', fontSize: '26px', fontWeight: 700, marginBottom: '4px' }}>{s.count}</p>
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-hint)', fontSize: '11px' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Coming up */}
              <div style={{ marginBottom: '36px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', marginBottom: '14px', textTransform: 'uppercase' }}>
                  COMING UP IN THIS LESSON
                </p>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {lesson.steps.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < lesson.steps.length - 1 ? 'var(--border)' : 'none' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: '#fff' }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, color: 'var(--color-secondary)' }}>{i + 1}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-body)', fontSize: '14px' }}>{s.title}</span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-hint)', fontSize: '12px' }}>Concept · 2 min</span>
                    </div>
                  ))}
                  {lesson.quiz.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderTop: 'var(--border)' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>Q</span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-body)', fontSize: '14px', flex: 1 }}>Situational quiz</span>
                      <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-hint)', fontSize: '12px' }}>{lesson.quiz.length} questions</span>
                    </div>
                  )}
                  {exercises.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderTop: 'var(--border)' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>Ex</span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-body)', fontSize: '14px', flex: 1 }}>Practice exercise</span>
                      <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-hint)', fontSize: '12px' }}>Hands-on</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Before we start */}
              <div style={{ padding: '20px', border: 'var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: '#fff', marginBottom: '28px' }}>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
                  Which best describes where you are with Claude Code right now?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { key: 'A' as const, label: 'Complete beginner — I\'ve never used Claude Code' },
                    { key: 'B' as const, label: 'Tried it a few times but not confident yet' },
                    { key: 'C' as const, label: 'I use it regularly but want to go deeper' },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => handleExperienceAnswer(opt.key)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', textAlign: 'left',
                        border: experienceLevel === opt.key ? '1.5px solid var(--color-coral)' : 'var(--border)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: experienceLevel === opt.key ? 'var(--color-coral-light)' : 'transparent',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                        border: experienceLevel === opt.key ? 'none' : 'var(--border)',
                        backgroundColor: experienceLevel === opt.key ? 'var(--color-coral)' : 'var(--color-sand)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, color: experienceLevel === opt.key ? '#fff' : 'var(--color-secondary)' }}>{opt.key}</span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-body)', fontSize: '14px' }}>{opt.label}</span>
                    </button>
                  ))}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-hint)', fontSize: '12px', marginTop: '12px', fontStyle: 'italic' }}>
                  Your answer personalizes tips throughout the lesson
                </p>
              </div>

              {/* Start button */}
              <button
                onClick={handleStartLesson}
                style={{ padding: '12px 32px', backgroundColor: 'var(--color-coral)', color: '#fff', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >
                Start Lesson →
              </button>
            </div>

            {/* Right sidebar: module context */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Module progress */}
              {mod && (
                <div style={{ padding: '16px', border: 'var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: '#fff' }}>
                  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-hint)', fontSize: '12px', marginBottom: '4px' }}>Module {mod.id} · {mod.title}</p>
                  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Your progress</p>
                  <div style={{ height: '4px', backgroundColor: 'var(--color-sand)', borderRadius: 'var(--radius-full)', marginBottom: '8px' }}>
                    <div style={{ height: '100%', width: `${modTotal > 0 ? Math.round((modCompletedCount / modTotal) * 100) : 0}%`, backgroundColor: 'var(--color-coral)', borderRadius: 'var(--radius-full)' }} />
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-secondary)', fontSize: '12px' }}>{modCompletedCount} of {modTotal} lessons complete</p>
                </div>
              )}

              {/* Lessons in module */}
              {mod && modLessons.length > 0 && (
                <div style={{ padding: '16px', border: 'var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: '#fff' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', marginBottom: '12px', textTransform: 'uppercase' }}>
                    LESSONS IN THIS MODULE
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {modLessons.map((ml) => {
                      if (!ml) return null;
                      const isActive = ml.id === lessonId;
                      const isDone = modProgress.completedLessons.includes(ml.id);
                      return (
                        <Link key={ml.id} href={`/lessons/${ml.id}`} style={{ textDecoration: 'none' }}>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                            border: isActive ? '1.5px solid var(--color-coral)' : 'var(--border)',
                            backgroundColor: isActive ? 'var(--color-coral-light)' : 'transparent',
                          }}>
                            <div style={{
                              width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              backgroundColor: isDone ? 'var(--color-coral)' : isActive ? 'var(--color-coral)' : 'var(--color-sand)',
                            }}>
                              {isDone ? (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              ) : (
                                <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 700, color: isActive ? '#fff' : 'var(--color-secondary)' }}>{ml.id}</span>
                              )}
                            </div>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: isActive ? 'var(--color-coral)' : isDone ? 'var(--color-secondary)' : 'var(--color-body)', fontWeight: isActive ? 600 : 400, flex: 1 }}>
                              {ml.title}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Before you start tip */}
              {lesson.keyTakeaway && (
                <div style={{ padding: '16px', border: 'var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: '#fff' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-coral)', fontFamily: 'var(--font-body)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Before you start
                  </p>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-coral)', fontFamily: 'var(--font-body)', marginBottom: '6px' }}>Tip</p>
                  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-body)', fontSize: '13px', lineHeight: 1.6 }}>
                    {lesson.keyTakeaway}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── LEARN / QUIZ / PRACTICE ─────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: 'var(--color-cream)', minHeight: '100vh' }}>
      {/* Top bar */}
      <nav className="sticky top-0 z-40 px-6 py-3 flex items-center justify-between" style={{ backgroundColor: 'var(--color-cream)', borderBottom: 'var(--border)' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveSection('intro')} className="text-sm font-medium" style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', background: 'none', border: 'none', cursor: 'pointer' }}>← Back</button>
          <span className="text-xs" style={{ color: 'var(--color-hint)', fontFamily: 'var(--font-body)' }}>
            {mod?.title || ''} / Lesson {lessonId}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium" style={{ color: 'var(--color-hint)' }}>{progressPct}%</span>
          <div className="w-32 h-1.5" style={{ backgroundColor: 'var(--color-sand)', borderRadius: 'var(--radius-full)' }}>
            <div className="h-full transition-all" style={{ width: `${progressPct}%`, backgroundColor: 'var(--color-coral)', borderRadius: 'var(--radius-full)' }} />
          </div>
          {nextId && <Link href={`/lessons/${nextId}`} className="text-xs px-3 py-1.5 font-medium" style={{ backgroundColor: 'var(--color-coral)', color: '#fff', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)' }}>Next →</Link>}
        </div>
      </nav>

      <div className="flex flex-col md:flex-row max-w-6xl mx-auto px-6 py-8 gap-8">
        {/* Step nav sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <div className="space-y-1">
            {lesson.steps.map((s, i) => {
              const done = stepsCompleted.includes(i);
              const active = activeSection === 'learn' && activeStep === i;
              return (
                <button key={i} onClick={() => { setActiveSection('learn'); setActiveStep(i); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left" style={{ backgroundColor: active ? 'var(--color-coral-light)' : 'transparent' }}>
                  <span className="shrink-0 w-5 h-5 flex items-center justify-center text-[10px] font-bold" style={{ borderRadius: 'var(--radius-full)', ...(done ? { backgroundColor: 'var(--color-coral)', color: '#fff' } : active ? { border: '2px solid var(--color-coral)', color: 'var(--color-coral)' } : { border: '1.5px solid var(--color-muted)', color: 'var(--color-muted)' }) }}>
                    {done ? '✓' : i + 1}
                  </span>
                  <span className="text-xs leading-tight truncate" style={{ fontFamily: 'var(--font-body)', fontWeight: active ? 600 : 400, color: done ? 'var(--color-hint)' : active ? 'var(--color-ink)' : 'var(--color-secondary)' }}>{s.title}</span>
                </button>
              );
            })}
          </div>
          {(lesson.quiz.length > 0 || exercises.length > 0) && <div className="my-3" style={{ borderTop: 'var(--border)' }} />}
          {lesson.quiz.length > 0 && (
            <button onClick={() => setActiveSection('quiz')} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left" style={{ backgroundColor: activeSection === 'quiz' ? 'var(--color-coral-light)' : 'transparent' }}>
              <span className="text-xs" style={{ color: activeSection === 'quiz' ? 'var(--color-coral)' : 'var(--color-muted)' }}>?</span>
              <span className="text-xs" style={{ fontFamily: 'var(--font-body)', fontWeight: activeSection === 'quiz' ? 600 : 400, color: activeSection === 'quiz' ? 'var(--color-ink)' : 'var(--color-secondary)' }}>Quiz {quizCompleted ? '✓' : ''}</span>
            </button>
          )}
          {exercises.length > 0 && (
            <button onClick={() => setActiveSection('practice')} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left" style={{ backgroundColor: activeSection === 'practice' ? 'var(--color-coral-light)' : 'transparent' }}>
              <span className="text-xs" style={{ color: activeSection === 'practice' ? 'var(--color-coral)' : 'var(--color-muted)' }}>✎</span>
              <span className="text-xs" style={{ fontFamily: 'var(--font-body)', fontWeight: activeSection === 'practice' ? 600 : 400, color: activeSection === 'practice' ? 'var(--color-ink)' : 'var(--color-secondary)' }}>Practice</span>
            </button>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* LEARN */}
          {activeSection === 'learn' && step && (
            <article className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-semibold px-2.5 py-1" style={{ backgroundColor: 'var(--color-coral-light)', color: 'var(--color-coral)', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-body)' }}>
                  Step {activeStep + 1} of {totalSteps}
                </span>
                {step.techniques?.map((t) => (
                  <span key={t} className="text-xs px-2.5 py-1" style={{ backgroundColor: 'var(--color-sand)', color: 'var(--color-secondary)', borderRadius: 'var(--radius-full)' }}>{t}</span>
                ))}
              </div>

              <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>{step.title}</h2>
              <p className="text-base mb-6" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-body)', lineHeight: 1.7 }}>{step.description}</p>

              {step.code && (
                <div className="mb-6 overflow-x-auto" style={{ borderRadius: 'var(--radius-md)' }}>
                  {step.language && (
                    <div className="px-4 py-2 text-xs" style={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-muted)', borderBottom: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', fontFamily: 'monospace' }}>{step.language}</div>
                  )}
                  <pre className="p-4 text-sm leading-relaxed overflow-x-auto" style={{ backgroundColor: 'var(--color-ink)', color: '#e8e4de', borderRadius: step.language ? '0 0 var(--radius-md) var(--radius-md)' : 'var(--radius-md)', fontFamily: 'monospace' }}>
                    <code>{step.code}</code>
                  </pre>
                </div>
              )}

              {step.tip && (
                <div className="mb-6 p-4" style={{ borderLeft: '3px solid var(--color-coral)', backgroundColor: 'var(--color-coral-light)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                  <p className="text-sm" style={{ color: 'var(--color-coral-dark)', fontFamily: 'var(--font-body)' }}><span className="font-semibold">Tip: </span>{step.tip}</p>
                </div>
              )}

              {step.borisTip && (
                <div className="mb-6 p-4" style={{ borderLeft: '3px solid var(--color-coral)', backgroundColor: 'var(--color-coral-light)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                  <p className="text-sm" style={{ color: 'var(--color-coral-dark)', fontFamily: 'var(--font-body)' }}><span className="font-semibold">💡 Boris Tip: </span>{step.borisTip}</p>
                </div>
              )}

              {step.officialTip && (
                <div className="mb-6 p-4" style={{ borderLeft: '3px solid var(--color-ink)', backgroundColor: 'var(--color-sand)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                  <p className="text-sm" style={{ color: 'var(--color-body)', fontFamily: 'var(--font-body)' }}>
                    <span className="font-semibold" style={{ color: 'var(--color-ink)' }}>📖 Official Docs: </span>{step.officialTip}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-8 mt-8" style={{ borderTop: 'var(--border)' }}>
                {activeStep > 0 ? (
                  <button onClick={() => setActiveStep(activeStep - 1)} className="px-5 py-2.5 text-sm font-medium" style={{ border: 'var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }}>← Previous</button>
                ) : <div />}
                <button onClick={handleNextStep} className="px-5 py-2.5 text-sm font-medium" style={{ backgroundColor: 'var(--color-coral)', color: '#fff', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)' }}>
                  {activeStep + 1 < totalSteps ? 'Next →' : lesson.quiz.length > 0 ? 'Take Quiz →' : 'Complete ✓'}
                </button>
              </div>
            </article>
          )}

          {/* QUIZ */}
          {activeSection === 'quiz' && lesson.quiz.length > 0 && !quizCompleted && (
            <div className="max-w-2xl">
              <p className="text-xs mb-4" style={{ color: 'var(--color-hint)', fontFamily: 'var(--font-body)' }}>Question {quizState.index + 1} of {lesson.quiz.length}</p>
              <div className="w-full h-1 mb-8" style={{ backgroundColor: 'var(--color-sand)', borderRadius: 'var(--radius-full)' }}>
                <div className="h-full transition-all" style={{ width: `${((quizState.index + 1) / lesson.quiz.length) * 100}%`, backgroundColor: 'var(--color-coral)', borderRadius: 'var(--radius-full)' }} />
              </div>

              <h3 className="text-lg font-medium mb-8" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', lineHeight: 1.6 }}>{lesson.quiz[quizState.index].question}</h3>

              <div className="space-y-3 mb-6">
                {lesson.quiz[quizState.index].options.map((opt, i) => {
                  const isSelected = quizState.selected === i;
                  const isCorrectOpt = i === lesson.quiz[quizState.index].correctIndex;
                  let borderColor = 'var(--color-border)';
                  let bgColor = 'transparent';
                  let letterBg = 'var(--color-sand)';
                  let letterColor = 'var(--color-secondary)';
                  if (quizState.showFeedback) {
                    if (isCorrectOpt) { borderColor = '#22c55e'; bgColor = '#f0fdf4'; letterBg = '#22c55e'; letterColor = '#fff'; }
                    else if (isSelected) { borderColor = '#ef4444'; bgColor = '#fef2f2'; letterBg = '#ef4444'; letterColor = '#fff'; }
                  } else if (isSelected) { borderColor = 'var(--color-coral)'; bgColor = 'var(--color-coral-light)'; letterBg = 'var(--color-coral)'; letterColor = '#fff'; }
                  return (
                    <button key={i} onClick={() => handleQuizSelect(i)} disabled={quizState.showFeedback} className="w-full flex items-start gap-3 p-4 text-left transition-all" style={{ border: `1.5px solid ${borderColor}`, borderRadius: 'var(--radius-md)', backgroundColor: bgColor, opacity: quizState.showFeedback && !isCorrectOpt && !isSelected ? 0.5 : 1 }}>
                      <span className="shrink-0 w-7 h-7 flex items-center justify-center text-xs font-semibold" style={{ borderRadius: 'var(--radius-full)', backgroundColor: letterBg, color: letterColor }}>{LETTERS[i]}</span>
                      <span className="text-sm pt-0.5" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-body)', lineHeight: 1.5 }}>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {quizState.showFeedback && (
                <>
                  <div className="p-4 mb-6" style={{ backgroundColor: quizState.selected === lesson.quiz[quizState.index].correctIndex ? 'var(--color-coral-light)' : '#fef2f2', borderRadius: 'var(--radius-md)', border: quizState.selected === lesson.quiz[quizState.index].correctIndex ? '1px solid var(--color-coral)' : '1px solid #fecaca' }}>
                    <p className="text-sm font-semibold mb-1" style={{ color: quizState.selected === lesson.quiz[quizState.index].correctIndex ? 'var(--color-coral-dark)' : '#dc2626' }}>
                      {quizState.selected === lesson.quiz[quizState.index].correctIndex ? '✓ Correct!' : '✗ Not quite'}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-body)', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>{lesson.quiz[quizState.index].explanation}</p>
                  </div>
                  <button onClick={handleQuizNext} className="w-full py-3 text-sm font-medium" style={{ backgroundColor: 'var(--color-coral)', color: '#fff', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)' }}>
                    {quizState.index + 1 >= lesson.quiz.length ? 'See Results' : 'Next Question →'}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Quiz complete */}
          {activeSection === 'quiz' && quizCompleted && (
            <div className="max-w-2xl text-center py-12">
              <div className="text-5xl mb-4">{quizState.correct >= lesson.quiz.length * 0.8 ? '🎉' : '📚'}</div>
              <h3 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>Quiz Complete!</h3>
              <p className="text-3xl font-bold mb-6" style={{ color: 'var(--color-coral)' }}>{quizState.correct}/{lesson.quiz.length}</p>
              <div className="flex gap-3 justify-center">
                {nextId && (
                  <Link href={`/lessons/${nextId}`} className="px-6 py-2.5 text-sm font-medium" style={{ backgroundColor: 'var(--color-coral)', color: '#fff', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)' }}>
                    Next Lesson →
                  </Link>
                )}
                <Link href="/" className="px-6 py-2.5 text-sm font-medium" style={{ border: 'var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }}>
                  All Lessons
                </Link>
              </div>
            </div>
          )}

          {/* PRACTICE */}
          {activeSection === 'practice' && (
            <div className="max-w-2xl">
              {exercises.length > 0 ? (
                <div className="space-y-6">
                  {exercises.map((ex) => (
                    <div key={ex.id} className="p-6" style={{ backgroundColor: '#fff', border: 'var(--border)', borderRadius: 'var(--radius-lg)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold px-2.5 py-1" style={{ backgroundColor: ex.difficulty === 'beginner' ? '#e8f5e9' : ex.difficulty === 'intermediate' ? '#fff3e0' : '#fce4ec', color: ex.difficulty === 'beginner' ? '#2e7d32' : ex.difficulty === 'intermediate' ? '#e65100' : '#c62828', borderRadius: 'var(--radius-full)' }}>
                          {ex.difficulty}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--color-hint)' }}>{ex.type}</span>
                      </div>
                      <h3 className="text-base font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>{ex.title}</h3>
                      <p className="text-sm mb-4" style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>{ex.description}</p>
                      <div className="p-4 mb-4" style={{ backgroundColor: 'var(--color-coral-light)', border: '1px solid var(--color-coral)', borderRadius: 'var(--radius-md)' }}>
                        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-coral-dark)' }}>Challenge:</p>
                        <p className="text-sm" style={{ color: 'var(--color-coral-dark)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>{ex.challenge}</p>
                      </div>
                      {ex.hints.length > 0 && (
                        <details className="mb-4">
                          <summary className="text-xs font-medium cursor-pointer" style={{ color: 'var(--color-hint)' }}>Show hints</summary>
                          <ul className="mt-2 space-y-1">
                            {ex.hints.map((h, i) => (
                              <li key={i} className="text-xs" style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }}>💡 {h}</li>
                            ))}
                          </ul>
                        </details>
                      )}
                      <details>
                        <summary className="text-xs font-medium cursor-pointer" style={{ color: 'var(--color-coral)' }}>Show solution</summary>
                        <pre className="mt-2 p-3 text-xs overflow-x-auto" style={{ backgroundColor: 'var(--color-ink)', color: '#e8e4de', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace' }}>
                          <code>{ex.solution}</code>
                        </pre>
                        <p className="mt-2 text-xs" style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }}>✅ {ex.successMessage}</p>
                      </details>
                    </div>
                  ))}
                </div>
              ) : lesson.exercise ? (
                <div>
                  <div className="p-4 mb-6" style={{ border: '1.5px solid var(--color-coral)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-coral-light)' }}>
                    <h3 className="text-base font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-coral-dark)' }}>🧪 {lesson.exercise.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {lesson.exercise.instructions.map((inst, i) => (
                      <div key={i} className="flex items-start gap-3 p-4" style={{ border: 'var(--border)', borderRadius: 'var(--radius-md)' }}>
                        <span className="shrink-0 w-6 h-6 flex items-center justify-center text-xs font-semibold" style={{ borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-sand)', color: 'var(--color-secondary)' }}>{i + 1}</span>
                        <span className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-body)', lineHeight: 1.5 }}>{inst}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center py-12" style={{ color: 'var(--color-hint)', fontFamily: 'var(--font-body)' }}>No exercises for this lesson yet.</p>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Bottom nav */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between pt-8" style={{ borderTop: 'var(--border)' }}>
          {prevId ? (
            <Link href={`/lessons/${prevId}`} className="text-sm" style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }}>← Lesson {prevId}</Link>
          ) : (
            <Link href="/" className="text-sm" style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }}>← All Lessons</Link>
          )}
          {nextId && (
            <Link href={`/lessons/${nextId}`} className="text-sm px-5 py-2 font-medium" style={{ backgroundColor: 'var(--color-coral)', color: '#fff', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)' }}>
              Next: {lessons.find((l) => l.id === nextId)?.title || `Lesson ${nextId}`} →
            </Link>
          )}
        </div>
      </div>

      <ChatWidget
        lessonTitle={lesson.title}
        lessonId={lessonId}
        moduleTitle={mod?.title}
        currentSection={activeSection === 'learn' ? 'step' : activeSection}
        currentStepTitle={activeSection === 'learn' ? step?.title : undefined}
        quizQuestions={lesson.quiz.map((q) => q.question)}
      />
    </div>
  );
}
