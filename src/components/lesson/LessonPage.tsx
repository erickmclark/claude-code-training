'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getLessonById, getModuleForLesson, getGlobalLessonNumber } from '@/src/data/lessons';
import { lessonSummaries } from '@/data/lessons';
import { modules } from '@/data/modules';
import { getLessonProgress, toggleStepComplete, markLessonComplete } from '@/utils/progress';
import { practiceExercises } from '@/data/practiceExercises';
import LessonSidebar from './LessonSidebar';
import { StepLead, StepRail, StepInsights } from './StepContent';
import BeginnerQuiz from '@/src/components/quiz/BeginnerQuiz';
import PracticeExercise from './PracticeExercise';
import LessonComplete from './LessonComplete';
import ChatWidget from '@/src/components/chat/ChatWidget';
import AboutThisCourse from './AboutThisCourse';
import BashBlock from '@/src/components/ui/BashBlock';
import ModuleExam from '@/src/components/quiz/ModuleExam';
import ModuleCapstone from './ModuleCapstone';
import { moduleCapstones } from '@/data/moduleCapstones';
import WorkflowDiagram from '@/src/components/module/WorkflowDiagram';

type View = 'lesson' | 'overview';

// Static flat list of all lesson IDs in curriculum order — used for
// keyboard navigation (Up/Down arrows to move between lessons).
const ALL_LESSON_IDS = modules.flatMap((m) => m.lessons);

interface LessonPageProps {
  lessonId: number;
}

export default function LessonPage({ lessonId }: LessonPageProps) {
  const lesson = getLessonById(lessonId);
  const mod = getModuleForLesson(lessonId);
  const router = useRouter();

  const [view, setView] = useState<View>('lesson');
  const [activeSection, setActiveSection] = useState<'step' | 'quiz' | 'exercise' | 'module-exam' | 'capstone'>('step');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [stepsCompleted, setStepsCompleted] = useState<number[]>([]);

  // Single source of truth for per-lesson state reset. Runs whenever lessonId
  // changes so LessonPage is a true route-reactive component: navigating between
  // lessons drops out of overview mode, resets the active section (unless
  // overridden by ?section=), clears the step index, and reloads step progress.
  useEffect(() => {
    setView('lesson');
    setActiveStepIndex(0);
    setStepsCompleted(getLessonProgress(lessonId).stepsCompleted);

    let nextSection: 'step' | 'quiz' | 'exercise' | 'module-exam' | 'capstone' = 'step';
    if (typeof window !== 'undefined') {
      const section = new URLSearchParams(window.location.search).get('section');
      if (
        section === 'capstone' ||
        section === 'quiz' ||
        section === 'exercise' ||
        section === 'module-exam'
      ) {
        nextSection = section;
      }
    }
    setActiveSection(nextSection);

    // Re-focus the page so keyboard shortcuts (arrow keys) continue working
    // after a router.push navigation. Without this, focus can get stuck on
    // the sidebar button that triggered the navigation.
    if (typeof window !== 'undefined') {
      window.focus();
      window.scrollTo(0, 0);
    }
  }, [lessonId]);
  const [exerciseDone, setExerciseDone] = useState(false);

  // Completed lesson IDs for curriculum sidebar
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('claude-training-progress');
      if (raw) {
        const progress = JSON.parse(raw);
        if (progress.lessons) {
          const ids = Object.entries(progress.lessons)
            .filter(([, v]) => (v as { status: string }).status === 'complete')
            .map(([k]) => parseInt(k, 10));
          setCompletedLessonIds(ids);
        }
      }
    } catch { /* ignore */ }
  }, []);

  // For AI-generated lessons (empty steps array), fetch from Supabase/API
  const [dynamicSteps, setDynamicSteps] = useState<Array<{ title: string; description: string; code?: string; language?: string; tip?: string; officialTip?: string; borisTip?: string; techniques?: string[] }> | null>(null);
  useEffect(() => {
    if (!lesson || lesson.steps.length > 0) return;
    fetch('/api/lesson/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lessonId,
        topic: lesson.title,
        sourceContent: lesson.description,
      }),
    })
      .then((res) => res.json())
      .then((data: { steps?: typeof lesson.steps }) => {
        if (data.steps && Array.isArray(data.steps)) {
          setDynamicSteps(data.steps);
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const effectiveSteps = (lesson && lesson.steps.length > 0) ? lesson.steps : (dynamicSteps ?? []);

  // Step 1 back-navigation: first lesson in module → intro, others → previous lesson
  const lessonIdxInModule = mod ? mod.lessons.indexOf(lessonId) : -1;
  const isFirstInModule = lessonIdxInModule <= 0;
  const step1BackHref = isFirstInModule
    ? `/lesson/${lessonId}/intro`
    : `/lesson/${mod!.lessons[lessonIdxInModule - 1]}`;
  const step1BackLabel = isFirstInModule ? '← Back to intro' : '← Previous lesson';

  // Pre-fetch enrichments for ALL steps on lesson mount.
  // Skip the AI call entirely for steps that already have hand-authored
  // tip/borisTip/officialTip — those lessons are complete and don't need
  // generated context. We only call /api/lesson/enrich for older lessons
  // that ship without authored tips.
  const [enrichments, setEnrichments] = useState<Record<number, { why: string; when: string; commonMistakes: string; useCase?: string; useCaseName?: string; useCaseRole?: string; useCaseIndustry?: string; useCaseTechniques?: string[]; howTo?: string }>>({});
  useEffect(() => {
    if (!lesson) return;
    effectiveSteps.forEach((step, i) => {
      // Generate insights for ALL steps — even those with authored tips.
      // Tips go in the right rail (code reference), insights go in the
      // left column (deeper context). Both serve different purposes and
      // the user wants every step to have the "Why / When / Mistakes"
      // card so no concept goes unexplained.
      void step; // used for context in the API call below

      const cacheKey = `enrich-v3-${lessonId}-step-${i + 1}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.why && parsed.when && parsed.commonMistakes && parsed.useCase) {
            setEnrichments((prev) => ({ ...prev, [i]: parsed }));
            return;
          }
        } catch { /* fetch fresh */ }
      }
      fetch('/api/lesson/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonTitle: lesson.title,
          lessonId,
          stepIndex: i,
          stepTitle: step.title,
          stepDescription: step.description,
        }),
      })
        .then((res) => res.json())
        .then((data: { enriched?: { why: string; when: string; commonMistakes: string; useCase?: string; useCaseName?: string; useCaseRole?: string; useCaseIndustry?: string; useCaseTechniques?: string[]; howTo?: string } }) => {
          if (data.enriched) {
            setEnrichments((prev) => ({ ...prev, [i]: data.enriched! }));
            sessionStorage.setItem(`enrich-v3-${lessonId}-step-${i + 1}`, JSON.stringify(data.enriched));
          }
        })
        .catch(() => {});
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  // ─── Keyboard navigation ─────────────────────────────────────
  // Hooks must be called before any early return (React rules-of-hooks).
  // Arrow Left/Right: previous/next step
  // Arrow Up/Down: previous/next lesson
  const currentLessonIndex = ALL_LESSON_IDS.indexOf(lessonId);

  const goToPrevLesson = useCallback(() => {
    if (currentLessonIndex > 0) {
      router.push(`/lesson/${ALL_LESSON_IDS[currentLessonIndex - 1]}`);
    }
  }, [currentLessonIndex, router]);

  const goToNextLesson = useCallback(() => {
    if (currentLessonIndex < ALL_LESSON_IDS.length - 1) {
      router.push(`/lesson/${ALL_LESSON_IDS[currentLessonIndex + 1]}`);
    }
  }, [currentLessonIndex, router]);

  useEffect(() => {
    if (!lesson) return;
    const totalSteps = effectiveSteps.length;
    const hasQuizLocal = lesson.quiz.length > 0;
    const hasExerciseLocal = (practiceExercises[lessonId] ?? []).length > 0 || !!lesson.exercise;

    // Is this the last lesson in its module? Module-exam and capstone
    // only appear after the last lesson — not from mid-module lessons.
    const currentMod = modules.find((m) => m.lessons.includes(lessonId));
    const isLastInModule = currentMod
      ? currentMod.lessons[currentMod.lessons.length - 1] === lessonId
      : false;
    const isFirstInModule = currentMod
      ? currentMod.lessons[0] === lessonId
      : false;

    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }

      // Full navigation flow per lesson:
      //   steps (1→2→3...) → quiz → exercise
      //   THEN if last lesson in module: → module-exam → capstone
      //   THEN → next lesson (or next module's first lesson)

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown': {
          e.preventDefault();

          if (activeSection === 'step') {
            if (activeStepIndex + 1 < totalSteps) {
              setActiveStepIndex((i) => i + 1);
            } else if (hasQuizLocal) {
              setActiveSection('quiz');
            } else if (hasExerciseLocal) {
              setActiveSection('exercise');
            } else if (isLastInModule) {
              setActiveSection('module-exam');
            } else {
              goToNextLesson();
            }
          } else if (activeSection === 'quiz') {
            if (hasExerciseLocal) setActiveSection('exercise');
            else if (isLastInModule) setActiveSection('module-exam');
            else goToNextLesson();
          } else if (activeSection === 'exercise') {
            if (isLastInModule) setActiveSection('module-exam');
            else goToNextLesson();
          } else if (activeSection === 'module-exam') {
            setActiveSection('capstone');
          } else if (activeSection === 'capstone') {
            goToNextLesson();
          }
          break;
        }

        case 'ArrowLeft':
        case 'ArrowUp': {
          e.preventDefault();

          if (activeSection === 'capstone') {
            setActiveSection('module-exam');
          } else if (activeSection === 'module-exam') {
            // Go back to the last lesson section in this module
            if (hasExerciseLocal) setActiveSection('exercise');
            else if (hasQuizLocal) setActiveSection('quiz');
            else { setActiveSection('step'); setActiveStepIndex(totalSteps - 1); }
          } else if (activeSection === 'exercise') {
            if (hasQuizLocal) setActiveSection('quiz');
            else { setActiveSection('step'); setActiveStepIndex(totalSteps - 1); }
          } else if (activeSection === 'quiz') {
            setActiveSection('step');
            setActiveStepIndex(totalSteps - 1);
          } else if (activeSection === 'step') {
            if (activeStepIndex > 0) {
              setActiveStepIndex((i) => i - 1);
            } else if (isFirstInModule) {
              // First step of first lesson in module — go to previous module's capstone
              goToPrevLesson();
            } else {
              goToPrevLesson();
            }
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lesson, lessonId, effectiveSteps, activeSection, activeStepIndex, goToNextLesson, goToPrevLesson]);

  if (!lesson) {
    return (
      <div className="p-12 text-center" style={{ color: 'var(--color-hint)' }}>
        Lesson not found.
      </div>
    );
  }

  const totalSteps = effectiveSteps.length;
  const progressPct = totalSteps > 0 ? Math.round((stepsCompleted.length / totalSteps) * 100) : 0;
  const hasQuiz = lesson.quiz.length > 0;
  const richExercises = practiceExercises[lessonId] ?? [];
  const hasExercise = richExercises.length > 0 || !!lesson.exercise;

  const handleStepClick = (index: number) => {
    setActiveStepIndex(index);
    setActiveSection('step');
  };

  const handleNext = () => {
    if (!stepsCompleted.includes(activeStepIndex)) {
      toggleStepComplete(lessonId, activeStepIndex);
      setStepsCompleted((prev) => [...prev, activeStepIndex]);
    }
    if (activeStepIndex + 1 < totalSteps) {
      setActiveStepIndex(activeStepIndex + 1);
    } else if (hasExercise) {
      setActiveSection('exercise');
    } else if (hasQuiz) {
      setActiveSection('quiz');
    }
  };

  const handlePrev = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
      setActiveSection('step');
    }
  };

  const handleQuizComplete = (score: number) => {
    markLessonComplete(lessonId, score);
  };

  const handleExerciseComplete = () => {
    markLessonComplete(lessonId, 0);
    setExerciseDone(true);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-cream)' }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-40 px-6 py-3 flex items-center justify-between"
        style={{
          backgroundColor: 'var(--color-cream)',
          borderBottom: 'var(--border)',
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-sm"
            style={{
              color: 'var(--color-hint)',
              fontFamily: 'var(--font-body)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
            }}
            title="Go back"
          >
            ←
          </button>
          {/* Module switcher dropdown */}
          <ModuleSwitcher currentModuleId={mod?.id ?? 0} />
          <span
            style={{
              width: 1,
              height: 16,
              backgroundColor: 'var(--color-border)',
              flexShrink: 0,
            }}
          />
          <span className="text-xs" style={{ color: 'var(--color-hint)', fontFamily: 'var(--font-body)' }}>
            Lesson {getGlobalLessonNumber(lessonId) ?? lessonId}
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium" style={{ color: 'var(--color-hint)', fontFamily: 'var(--font-body)' }}>
              {progressPct}%
            </span>
            <div
              className="w-32 h-1.5"
              style={{ backgroundColor: 'var(--color-sand)', borderRadius: 'var(--radius-full)' }}
            >
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${progressPct}%`,
                  backgroundColor: 'var(--color-coral)',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main layout: sidebar + content */}
      <div style={{ display: 'flex' }}>
        {/* Curriculum sidebar */}
        <LessonSidebar
          modules={modules}
          lessonSummaries={lessonSummaries}
          currentLessonId={lessonId}
          completedLessonIds={completedLessonIds}
          onOverviewClick={() => setView(view === 'overview' ? 'lesson' : 'overview')}
          isOverviewActive={view === 'overview'}
          currentSteps={effectiveSteps}
          stepsCompleted={stepsCompleted}
          activeStepIndex={activeStepIndex}
          activeSection={activeSection}
          onStepClick={handleStepClick}
          onSectionClick={setActiveSection}
          hasQuiz={hasQuiz}
          hasExercise={hasExercise}
        />

        {/* Content area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Install banner */}
          <div
            style={{
              backgroundColor: 'var(--color-coral-light)',
              borderBottom: '1px solid var(--color-coral)',
              padding: '10px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  backgroundColor: 'var(--color-coral)',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: 'var(--font-body)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Required
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--color-ink)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                You must have Claude Code installed to practice this lesson.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <code
                style={{
                  backgroundColor: '#fff',
                  color: 'var(--color-coral-dark)',
                  padding: '4px 12px',
                  borderRadius: 4,
                  fontSize: 13,
                  border: '1px solid var(--color-coral)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                curl -fsSL https://claude.ai/install.sh | bash
              </code>
              <a
                href="/getting-started"
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#fff',
                  fontFamily: 'var(--font-body)',
                  textDecoration: 'none',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-coral)',
                  whiteSpace: 'nowrap',
                }}
              >
                Install Guide
              </a>
            </div>
          </div>

          {/* Overview view */}
          {view === 'overview' && (
            <div style={{ padding: '48px 40px' }}>
              <AboutThisCourse />
            </div>
          )}

          {/* Lesson view */}
          {view === 'lesson' && (
            <div style={{ padding: '32px 40px' }}>
              {/* Lesson title header */}
              <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '26px',
                    fontWeight: 700,
                    color: 'var(--color-ink)',
                    margin: 0,
                  }}
                >
                  {(() => {
                    const n = getGlobalLessonNumber(lessonId);
                    return n != null ? `Lesson ${n}: ${lesson.title}` : lesson.title;
                  })()}
                </h1>
              </div>

              {/* Main content */}
              <main className="animate-fade-in">
                {activeSection === 'step' && effectiveSteps[activeStepIndex] && (
                  // Every lesson renders with a 2-column layout: narrative on the
                  // left, sticky reference rail on the right. The right column
                  // content varies: lesson 36 gets the interactive WorkflowDiagram,
                  // every other lesson gets StepRail (code + tips + enrichment).
                  //
                  // Column ratio flips based on what's in the right column:
                  // - Lesson 36: right slightly wider (map needs 2-cards-per-row space)
                  // - Other lessons: LEFT wider since the code block is denser per
                  //   pixel than flowing prose — text needs more room to breathe.
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        lessonId === 36
                          ? 'minmax(0, 1fr) minmax(0, 1.15fr)'
                          : 'minmax(0, 1.2fr) minmax(0, 1fr)',
                      gap: lessonId === 36 ? 16 : 48,
                      alignItems: 'start',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <StepLead
                        step={effectiveSteps[activeStepIndex]}
                        stepNumber={activeStepIndex + 1}
                        totalSteps={totalSteps}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        hasPrev={activeStepIndex > 0}
                        hasNext={activeStepIndex < totalSteps - 1 || hasQuiz || hasExercise}
                        backHref={step1BackHref}
                        backLabel={step1BackLabel}
                      />
                      {/* Insights live in the narrative column, below the nav.
                          They're explanatory prose, not a code reference — they
                          belong with the lesson text, not in the right rail. */}
                      <StepInsights enrichment={enrichments[activeStepIndex]} />
                    </div>
                    <aside
                      style={{
                        position: 'sticky',
                        top: 80,
                        minWidth: 0,
                        alignSelf: 'start',
                      }}
                    >
                      {lessonId === 36 ? (
                        <WorkflowDiagram layout="narrow" />
                      ) : (
                        <StepRail step={effectiveSteps[activeStepIndex]} />
                      )}
                    </aside>
                  </div>
                )}

                {activeSection === 'quiz' && hasQuiz && (
                  <div>
                    <h2
                      className="text-2xl font-semibold mb-6"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
                    >
                      Quiz
                    </h2>
                    <BeginnerQuiz
                      questions={lesson.quiz}
                      onComplete={handleQuizComplete}
                      lessonTitle={lesson.title}
                      lessonId={lessonId}
                      lessonObjectives={lesson.objectives}
                      lessonStepTitles={effectiveSteps.map((s) => s.title)}
                    />
                  </div>
                )}

                {activeSection === 'exercise' && (
                  <div>
                    {richExercises.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <h2
                          className="text-2xl font-semibold"
                          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
                        >
                          Practice Exercises
                        </h2>
                        {richExercises.map((ex) => (
                          <div
                            key={ex.id}
                            style={{
                              border: 'var(--border)',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: '#fff',
                              overflow: 'hidden',
                            }}
                          >
                            <div style={{ padding: '16px 20px', borderBottom: 'var(--border)', backgroundColor: 'var(--color-cream)' }}>
                              <div className="flex items-center gap-3 mb-1">
                                <span
                                  className="text-xs font-semibold px-2 py-0.5"
                                  style={{
                                    backgroundColor: ex.difficulty === 'beginner' ? '#e8f5e9' : ex.difficulty === 'intermediate' ? '#fff3e0' : '#fce4ec',
                                    color: ex.difficulty === 'beginner' ? '#2e7d32' : ex.difficulty === 'intermediate' ? '#e65100' : '#c62828',
                                    borderRadius: 'var(--radius-full)',
                                    fontFamily: 'var(--font-body)',
                                    textTransform: 'capitalize',
                                  }}
                                >
                                  {ex.difficulty}
                                </span>
                                <span className="text-xs" style={{ color: 'var(--color-hint)', fontFamily: 'var(--font-body)' }}>
                                  {ex.type}
                                </span>
                              </div>
                              <h3 className="text-base font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
                                {ex.title}
                              </h3>
                              <p className="text-sm mt-1" style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }}>
                                {ex.description}
                              </p>
                            </div>
                            <div style={{ padding: '16px 20px' }}>
                              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-body)' }}>Challenge</p>
                              <p className="text-sm" style={{ color: 'var(--color-body)', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>{ex.challenge}</p>
                            </div>
                            <details style={{ borderTop: 'var(--border)' }}>
                              <summary className="text-sm font-semibold cursor-pointer px-5 py-3" style={{ color: 'var(--color-coral)', fontFamily: 'var(--font-body)', listStyle: 'none' }}>
                                ▸ Hints ({ex.hints.length})
                              </summary>
                              <ul style={{ padding: '8px 20px 16px 20px', margin: 0 }}>
                                {ex.hints.map((hint, i) => (
                                  <li key={i} className="text-sm" style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', marginBottom: 6 }}>
                                    {i + 1}. {hint}
                                  </li>
                                ))}
                              </ul>
                            </details>
                            <details style={{ borderTop: 'var(--border)' }}>
                              <summary className="text-sm font-semibold cursor-pointer px-5 py-3" style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)', listStyle: 'none' }}>
                                ▸ Solution
                              </summary>
                              <div style={{ padding: '8px 20px 16px 20px' }}>
                                <BashBlock code={ex.solution} label="Solution" />
                                <p className="text-sm mt-3" style={{ color: 'var(--color-coral)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                                  {ex.successMessage}
                                </p>
                              </div>
                            </details>
                          </div>
                        ))}
                        {exerciseDone && (
                          <LessonComplete
                            lessonId={String(lessonId)}
                            lessonTitle={lesson.title}
                            moduleTitle={mod?.title ?? ''}
                            exerciseDescription={richExercises[0]?.title ?? ''}
                          />
                        )}
                      </div>
                    ) : lesson.exercise ? (
                      <div>
                        <PracticeExercise
                          exercise={lesson.exercise}
                          onComplete={handleExerciseComplete}
                        />
                        {exerciseDone && (
                          <LessonComplete
                            lessonId={String(lessonId)}
                            lessonTitle={lesson.title}
                            moduleTitle={mod?.title ?? ''}
                            exerciseDescription={lesson.exercise.title}
                          />
                        )}
                      </div>
                    ) : null}
                  </div>
                )}

                {activeSection === 'module-exam' && mod && (
                  <div>
                    <h2
                      className="text-2xl font-semibold mb-6"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
                    >
                      {mod.title} — Final Exam
                    </h2>
                    <ModuleExam
                      moduleId={mod.id}
                      moduleTitle={mod.title}
                    />
                  </div>
                )}

                {activeSection === 'capstone' && mod && moduleCapstones[mod.id] && (
                  <ModuleCapstone scenario={moduleCapstones[mod.id]} />
                )}

                {activeSection === 'capstone' && mod && !moduleCapstones[mod.id] && (
                  <div className="max-w-4xl">
                    <p
                      className="text-sm"
                      style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }}
                    >
                      No capstone scenario available for this module yet.
                    </p>
                  </div>
                )}

                {/* Step navigation dots — bottom of lesson view */}
                {activeSection === 'step' && totalSteps > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '32px' }}>
                    {effectiveSteps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handleStepClick(i)}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: i === activeStepIndex ? 'var(--color-coral)' : stepsCompleted.includes(i) ? 'var(--color-coral)' : 'var(--color-sand)',
                          opacity: i === activeStepIndex ? 1 : stepsCompleted.includes(i) ? 0.5 : 1,
                          transition: 'all 0.15s',
                        }}
                      />
                    ))}
                  </div>
                )}
              </main>
            </div>
          )}

          {/* Removed: fixed bottom-right "Next →" button. Navigation is handled
              by the Previous/Continue buttons in StepLead + arrow keys. The fixed
              button overlapped with the Ask Claude floating chat button. */}
        </div>
      </div>

      <ChatWidget
        lessonTitle={lesson.title}
        lessonId={lessonId}
        moduleTitle={mod?.title}
        currentSection={activeSection}
        currentStepTitle={
          activeSection === 'step'
            ? effectiveSteps[activeStepIndex]?.title
            : undefined
        }
        quizQuestions={lesson.quiz.map((q) => q.question)}
      />
    </div>
  );
}

// ─── Module switcher dropdown ──────────────────────────────────
// Inline component: click the module name in the top bar to see all
// modules and jump to any one directly. Closes on outside click.
function ModuleSwitcher({ currentModuleId }: { currentModuleId: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const currentModule = modules.find((m) => m.id === currentModuleId);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--color-ink)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 6px',
          borderRadius: 'var(--radius-sm)',
          transition: 'background 0.1s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-sand)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
      >
        {currentModule?.title ?? 'Modules'}
        <span style={{ fontSize: 10, color: 'var(--color-hint)', transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 6,
            backgroundColor: '#fff',
            border: 'var(--border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            zIndex: 100,
            minWidth: 280,
            padding: '6px 0',
            animation: 'wfFadeUp 0.15s ease both',
          }}
        >
          {modules.map((m) => {
            const isCurrent = m.id === currentModuleId;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setOpen(false);
                  router.push(`/module/${m.id}`);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  background: isCurrent ? 'var(--color-sand)' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'var(--font-body)',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => { if (!isCurrent) e.currentTarget.style.background = 'var(--color-cream)'; }}
                onMouseLeave={(e) => { if (!isCurrent) e.currentTarget.style.background = isCurrent ? 'var(--color-sand)' : 'transparent'; }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{m.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: isCurrent ? 600 : 400, color: 'var(--color-ink)' }}>
                    {m.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-hint)', marginTop: 1 }}>
                    {m.lessons.length} lessons · {m.estimatedTime ?? ''}
                  </div>
                </div>
                {isCurrent && (
                  <span style={{ fontSize: 11, color: 'var(--color-coral)', fontWeight: 600 }}>Current</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
