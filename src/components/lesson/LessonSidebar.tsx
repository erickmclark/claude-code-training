'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Module, LessonSummary, Step } from '@/types/lesson';
import { getLessonById, getGlobalLessonNumber } from '@/src/data/lessons';

interface CurriculumSidebarProps {
  modules: Module[];
  lessonSummaries: LessonSummary[];
  currentLessonId: number;
  completedLessonIds: number[];
  onOverviewClick: () => void;
  isOverviewActive: boolean;
  currentSteps: Step[];
  stepsCompleted: number[];
  activeStepIndex: number;
  activeSection: 'step' | 'quiz' | 'exercise' | 'module-exam' | 'capstone';
  onStepClick: (index: number) => void;
  onSectionClick: (section: 'step' | 'quiz' | 'exercise' | 'module-exam' | 'capstone') => void;
  hasQuiz: boolean;
  hasExercise: boolean;
}

export default function LessonSidebar({
  modules,
  lessonSummaries,
  currentLessonId,
  completedLessonIds,
  onOverviewClick,
  isOverviewActive,
  currentSteps,
  stepsCompleted,
  activeStepIndex,
  activeSection,
  onStepClick,
  onSectionClick,
  hasQuiz,
  hasExercise,
}: CurriculumSidebarProps) {
  const router = useRouter();
  const activeRef = useRef<HTMLButtonElement>(null);
  const [expandedLessons, setExpandedLessons] = useState<Set<number>>(() => new Set([currentLessonId]));

  useEffect(() => {
    setExpandedLessons((prev) => {
      const next = new Set(prev);
      next.add(currentLessonId);
      return next;
    });
  }, [currentLessonId]);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [currentLessonId]);

  function toggleLesson(lessonId: number) {
    setExpandedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      return next;
    });
  }

  return (
    <nav
      style={{
        width: '280px',
        flexShrink: 0,
        height: 'calc(100vh - 49px)',
        position: 'sticky',
        top: '49px',
        overflowY: 'auto',
        borderRight: 'var(--border)',
        backgroundColor: 'var(--color-cream)',
        padding: '24px 0',
      }}
      className="hidden md:block"
    >
      {/* Course title */}
      <div style={{ padding: '0 20px', marginBottom: '8px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--color-ink)',
            lineHeight: 1.3,
          }}
        >
          Claude Code Mastery
        </h2>
      </div>

      {/* Course Overview link */}
      <button
        onClick={onOverviewClick}
        style={{
          display: 'block',
          width: '100%',
          textAlign: 'left',
          padding: '6px 20px',
          marginBottom: '16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '13px',
          fontFamily: 'var(--font-body)',
          color: isOverviewActive ? 'var(--color-coral)' : 'var(--color-secondary)',
          fontWeight: isOverviewActive ? 600 : 400,
          textDecoration: 'underline',
          textUnderlineOffset: '2px',
        }}
      >
        Course Overview
      </button>

      {/* Modules and lessons */}
      {modules.map((mod) => {
        if (mod.lessons.length === 0) return null;

        // BUILD MODE: force-unlock module exam + capstone buttons. Restore the line below before shipping.
        const allModuleLessonsDone = true;
        // const allModuleLessonsDone = mod.lessons.every((id) => completedLessonIds.includes(id));

        return (
          <div key={mod.id} style={{ marginBottom: '20px' }}>
            {/* Module header — clickable, navigates to module overview */}
            <button
              onClick={() => router.push(`/module/${mod.id}`)}
              style={{
                padding: '8px 20px',
                fontSize: '13px',
                fontWeight: 700,
                fontFamily: 'var(--font-body)',
                color: 'var(--color-ink)',
                lineHeight: 1.4,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                borderRadius: 'var(--radius-sm)',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-sand)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
            >
              {mod.title}
            </button>

            {/* Lessons in this module */}
            {mod.lessons.map((lessonId) => {
              const summary = lessonSummaries.find((s) => s.id === lessonId);
              if (!summary) return null;
              const lessonNumber = getGlobalLessonNumber(lessonId) ?? 0;

              const isCurrent = lessonId === currentLessonId && !isOverviewActive;
              const isDone = completedLessonIds.includes(lessonId);
              const isExpanded = expandedLessons.has(lessonId);

              // For non-current lessons, load steps from data
              const lessonData = lessonId === currentLessonId ? null : getLessonById(lessonId);
              const steps = isCurrent ? currentSteps : (lessonData?.steps ?? []);

              return (
                <div key={lessonId}>
                  {/* Lesson row */}
                  <button
                    ref={isCurrent ? activeRef : undefined}
                    onClick={() => {
                      if (lessonId !== currentLessonId) {
                        router.push(`/lesson/${lessonId}`);
                        setExpandedLessons((prev) => new Set(prev).add(lessonId));
                        return;
                      }
                      // Same lesson: if we're on overview, return to lesson view and ensure expanded
                      if (isOverviewActive) {
                        onOverviewClick();
                        setExpandedLessons((prev) => new Set(prev).add(lessonId));
                        return;
                      }
                      toggleLesson(lessonId);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      textAlign: 'left',
                      padding: '7px 20px',
                      background: isCurrent ? 'var(--color-sand)' : 'none',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isCurrent) e.currentTarget.style.background = 'rgba(0,0,0,0.02)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isCurrent) e.currentTarget.style.background = 'none';
                    }}
                  >
                    {/* Expand/collapse chevron */}
                    <span
                      style={{
                        fontSize: '10px',
                        color: 'var(--color-hint)',
                        width: '10px',
                        flexShrink: 0,
                        transition: 'transform 0.15s',
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      }}
                    >
                      ▶
                    </span>

                    {/* Completion circle */}
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        ...(isDone
                          ? { backgroundColor: 'var(--color-coral)', color: '#fff' }
                          : isCurrent
                          ? { border: '2px solid var(--color-coral)', backgroundColor: 'transparent' }
                          : { border: '1.5px solid var(--color-muted)', backgroundColor: 'transparent' }),
                      }}
                    >
                      {isDone && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>

                    {/* Lesson title */}
                    <span
                      style={{
                        fontSize: '13px',
                        fontFamily: 'var(--font-body)',
                        fontWeight: isCurrent ? 600 : 400,
                        color: isDone
                          ? 'var(--color-secondary)'
                          : isCurrent
                          ? 'var(--color-ink)'
                          : 'var(--color-body)',
                        lineHeight: 1.4,
                      }}
                    >
                      <span style={{ color: 'var(--color-hint)', fontWeight: 500, marginRight: 4 }}>{lessonNumber}.</span>
                      {summary.title}
                    </span>
                  </button>

                  {/* Expanded steps */}
                  {isExpanded && steps.length > 0 && (
                    <div style={{ paddingLeft: '46px', paddingRight: '12px', marginTop: '2px', marginBottom: '4px' }}>
                      {steps.map((step, i) => {
                        const isStepDone = isCurrent && stepsCompleted.includes(i);
                        const isStepActive = isCurrent && activeSection === 'step' && activeStepIndex === i;

                        return (
                          <button
                            key={i}
                            onClick={() => {
                              if (isCurrent) {
                                onSectionClick('step');
                                onStepClick(i);
                              } else {
                                router.push(`/lesson/${lessonId}`);
                              }
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              textAlign: 'left',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              background: isStepActive ? 'rgba(204, 92, 56, 0.08)' : 'none',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'background 0.1s',
                            }}
                          >
                            <span
                              style={{
                                width: 14,
                                height: 14,
                                borderRadius: '50%',
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '8px',
                                ...(isStepDone
                                  ? { backgroundColor: 'var(--color-coral)', color: '#fff' }
                                  : isStepActive
                                  ? { border: '1.5px solid var(--color-coral)', backgroundColor: 'transparent' }
                                  : { border: '1px solid var(--color-muted)', backgroundColor: 'transparent' }),
                              }}
                            >
                              {isStepDone && (
                                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </span>
                            <span
                              style={{
                                fontSize: '12px',
                                fontFamily: 'var(--font-body)',
                                fontWeight: isStepActive ? 600 : 400,
                                color: isStepDone
                                  ? 'var(--color-hint)'
                                  : isStepActive
                                  ? 'var(--color-ink)'
                                  : 'var(--color-secondary)',
                                lineHeight: 1.3,
                              }}
                            >
                              {step.title}
                            </span>
                          </button>
                        );
                      })}

                      {/* Exercise sub-item (current lesson only) */}
                      {isCurrent && hasExercise && (
                        <button
                          onClick={() => onSectionClick('exercise')}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                            textAlign: 'left', padding: '4px 8px', borderRadius: '4px',
                            background: activeSection === 'exercise' ? 'rgba(204, 92, 56, 0.08)' : 'none',
                            border: 'none', cursor: 'pointer', marginTop: '2px',
                          }}
                        >
                          <span style={{ width: 14, height: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: activeSection === 'exercise' ? 'var(--color-coral)' : 'var(--color-muted)' }}>✎</span>
                          <span style={{ fontSize: '12px', fontFamily: 'var(--font-body)', fontWeight: activeSection === 'exercise' ? 600 : 400, color: activeSection === 'exercise' ? 'var(--color-ink)' : 'var(--color-secondary)' }}>Exercise</span>
                        </button>
                      )}

                      {/* Quiz sub-item (current lesson only) */}
                      {isCurrent && hasQuiz && (
                        <button
                          onClick={() => onSectionClick('quiz')}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                            textAlign: 'left', padding: '4px 8px', borderRadius: '4px',
                            background: activeSection === 'quiz' ? 'rgba(204, 92, 56, 0.08)' : 'none',
                            border: 'none', cursor: 'pointer', marginTop: '2px',
                          }}
                        >
                          <span style={{ width: 14, height: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: activeSection === 'quiz' ? 'var(--color-coral)' : 'var(--color-muted)' }}>?</span>
                          <span style={{ fontSize: '12px', fontFamily: 'var(--font-body)', fontWeight: activeSection === 'quiz' ? 600 : 400, color: activeSection === 'quiz' ? 'var(--color-ink)' : 'var(--color-secondary)' }}>Quiz</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Module Exam */}
            <button
              onClick={() => {
                onSectionClick('module-exam');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                textAlign: 'left',
                padding: '7px 20px 7px 50px',
                background: activeSection === 'module-exam' && modules.find(m => m.lessons.includes(currentLessonId))?.id === mod.id ? 'var(--color-sand)' : 'none',
                border: 'none',
                cursor: allModuleLessonsDone ? 'pointer' : 'default',
                opacity: allModuleLessonsDone ? 1 : 0.4,
                marginTop: '4px',
              }}
              disabled={!allModuleLessonsDone}
            >
              <span style={{ fontSize: '12px', color: 'var(--color-coral)' }}>📝</span>
              <span
                style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  color: 'var(--color-coral)',
                }}
              >
                Module Exam
              </span>
              {!allModuleLessonsDone && (
                <span style={{ fontSize: '10px', color: 'var(--color-hint)', marginLeft: 'auto' }}>🔒</span>
              )}
            </button>

            {/* Module Capstone */}
            <button
              onClick={() => {
                onSectionClick('capstone');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                textAlign: 'left',
                padding: '7px 20px 7px 50px',
                background: activeSection === 'capstone' && modules.find(m => m.lessons.includes(currentLessonId))?.id === mod.id ? 'var(--color-sand)' : 'none',
                border: 'none',
                cursor: allModuleLessonsDone ? 'pointer' : 'default',
                opacity: allModuleLessonsDone ? 1 : 0.4,
                marginTop: '2px',
              }}
              disabled={!allModuleLessonsDone}
            >
              <span style={{ fontSize: '12px', color: 'var(--color-coral)' }}>🏆</span>
              <span
                style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  color: 'var(--color-coral)',
                }}
              >
                Module Capstone
              </span>
              {!allModuleLessonsDone && (
                <span style={{ fontSize: '10px', color: 'var(--color-hint)', marginLeft: 'auto' }}>🔒</span>
              )}
            </button>
          </div>
        );
      })}
    </nav>
  );
}
