'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getLessonById, getModuleForLesson } from '@/src/data/lessons';
import { getLessonProgress, toggleStepComplete, markLessonComplete } from '@/utils/progress';
import LessonSidebar from './LessonSidebar';
import StepContent from './StepContent';
import BeginnerQuiz from '@/src/components/quiz/BeginnerQuiz';
import PracticeExercise from './PracticeExercise';
import ChatWidget from '@/src/components/chat/ChatWidget';

interface LessonPageProps {
  lessonId: number;
}

export default function LessonPage({ lessonId }: LessonPageProps) {
  const lesson = getLessonById(lessonId);
  const mod = getModuleForLesson(lessonId);

  const [activeSection, setActiveSection] = useState<'step' | 'quiz' | 'exercise'>('step');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [stepsCompleted, setStepsCompleted] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    return getLessonProgress(lessonId).stepsCompleted;
  });

  if (!lesson) {
    return (
      <div className="p-12 text-center" style={{ color: 'var(--color-hint)' }}>
        Lesson not found.
      </div>
    );
  }

  const totalSteps = lesson.steps.length;
  const progressPct = totalSteps > 0 ? Math.round((stepsCompleted.length / totalSteps) * 100) : 0;
  const hasQuiz = lesson.quiz.length > 0;
  const hasExercise = !!lesson.exercise;

  const handleStepClick = (index: number) => {
    setActiveStepIndex(index);
    setActiveSection('step');
  };

  const handleNext = () => {
    // Mark current step complete
    if (!stepsCompleted.includes(activeStepIndex)) {
      toggleStepComplete(lessonId, activeStepIndex);
      setStepsCompleted((prev) => [...prev, activeStepIndex]);
    }
    // Navigate to next step, or quiz, or exercise
    if (activeStepIndex + 1 < totalSteps) {
      setActiveStepIndex(activeStepIndex + 1);
    } else if (hasQuiz) {
      setActiveSection('quiz');
    } else if (hasExercise) {
      setActiveSection('exercise');
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
          <Link
            href="/"
            className="text-sm font-medium"
            style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }}
          >
            ← Back
          </Link>
          <span className="text-xs" style={{ color: 'var(--color-hint)', fontFamily: 'var(--font-body)' }}>
            {mod ? `${mod.title}` : ''} / Lesson {lessonId}
          </span>
        </div>

        {/* Progress bar */}
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
      </header>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto px-6 py-8 gap-8">
        {/* Sidebar */}
        <LessonSidebar
          steps={lesson.steps}
          stepsCompleted={stepsCompleted}
          activeStepIndex={activeStepIndex}
          onStepClick={handleStepClick}
          hasQuiz={hasQuiz}
          hasExercise={hasExercise}
          activeSection={activeSection}
          onSectionClick={setActiveSection}
        />

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {activeSection === 'step' && lesson.steps[activeStepIndex] && (
            <StepContent
              step={lesson.steps[activeStepIndex]}
              stepNumber={activeStepIndex + 1}
              totalSteps={totalSteps}
              onPrev={handlePrev}
              onNext={handleNext}
              hasPrev={activeStepIndex > 0}
              hasNext={activeStepIndex < totalSteps - 1 || hasQuiz || hasExercise}
            />
          )}

          {activeSection === 'quiz' && hasQuiz && (
            <div>
              <h2
                className="text-2xl font-semibold mb-6"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
              >
                Quiz
              </h2>
              <BeginnerQuiz questions={lesson.quiz} onComplete={handleQuizComplete} />
            </div>
          )}

          {activeSection === 'exercise' && lesson.exercise && (
            <PracticeExercise
              exercise={lesson.exercise}
              onComplete={handleExerciseComplete}
            />
          )}
        </main>
      </div>

      <ChatWidget
        lessonTitle={lesson.title}
        lessonId={lessonId}
        moduleTitle={mod?.title}
        currentSection={activeSection}
        currentStepTitle={
          activeSection === 'step'
            ? lesson.steps[activeStepIndex]?.title
            : undefined
        }
        quizQuestions={lesson.quiz.map((q) => q.question)}
      />
    </div>
  );
}
