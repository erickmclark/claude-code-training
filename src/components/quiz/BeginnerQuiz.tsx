'use client';

import { useState, useEffect } from 'react';
import type { QuizQuestion } from '@/types/lesson';
import { getProgress } from '@/src/lib/progress';

interface BeginnerQuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  lessonTitle?: string;
  lessonId?: number;
  lessonObjectives?: string[];
  lessonStepTitles?: string[];
}

const LETTERS = ['A', 'B', 'C', 'D'];

const LEVEL_MAP: Record<string, string> = {
  A: 'beginner',
  B: 'intermediate',
  C: 'advanced',
};

function resolveUserLevel(): string {
  if (typeof window === 'undefined') return 'beginner';
  try {
    const progress = getProgress();
    return progress.userLevel ? (LEVEL_MAP[progress.userLevel] ?? 'beginner') : 'beginner';
  } catch {
    return 'beginner';
  }
}

export default function BeginnerQuiz({ questions: staticQuestions, onComplete, lessonTitle, lessonId, lessonObjectives, lessonStepTitles }: BeginnerQuizProps) {

  const [questions, setQuestions] = useState<QuizQuestion[]>(staticQuestions);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [adaptedExplanation, setAdaptedExplanation] = useState<string | null>(null);

  // Fetch AI-generated questions on mount, but only when the lesson does NOT
  // already ship with hand-authored questions. The new lessons (and most of
  // the older ones) include 8 fallback questions in lesson.quiz — when those
  // are present, we use them as-is and never call the AI route.
  useEffect(() => {
    if (!lessonTitle) return;
    if (staticQuestions && staticQuestions.length >= 8) return;
    setAiLoading(true);
    fetch('/api/quiz/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lessonTitle,
        lessonId,
        objectives: lessonObjectives ?? [],
        steps: lessonStepTitles ?? [],
      }),
    })
      .then((res) => res.json())
      .then((data: { questions?: QuizQuestion[] }) => {
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          setQuestions(data.questions);
          setAiGenerated(true);
        }
      })
      .catch(() => {
        // Silently fall back to static questions
      })
      .finally(() => {
        setAiLoading(false);
      });
  }, [lessonTitle, lessonObjectives, lessonStepTitles]);

  const question = questions[currentIndex];
  const isCorrect = selectedAnswer === question?.correctIndex;

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (index === question.correctIndex) {
      setCorrectCount((c) => c + 1);
    } else {
      // Wrong answer: fetch adaptive explanation
      const correctAnswerText = question.options[question.correctIndex] ?? '';
      const userLevel = resolveUserLevel();
      setLoadingExplanation(true);
      fetch('/api/agents/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalExplanation: question.explanation,
          question: question.question,
          correctAnswer: correctAnswerText,
          userLevel,
        }),
      })
        .then((res) => res.json())
        .then((data: { explanation?: string }) => {
          if (data.explanation) {
            setAdaptedExplanation(data.explanation);
          }
        })
        .catch(() => {
          // Fall back to static explanation silently
        })
        .finally(() => {
          setLoadingExplanation(false);
        });
    }
  };

  const handleQuit = () => {
    const confirmed =
      typeof window === 'undefined' ||
      window.confirm('Quit the quiz and start over from question 1? Your current answers will be discarded.');
    if (!confirmed) return;
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCorrectCount(0);
    setFinished(false);
    setAdaptedExplanation(null);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      onComplete(correctCount);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setAdaptedExplanation(null);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCorrectCount(0);
    setFinished(false);
    setAdaptedExplanation(null);
    // Re-fetch AI questions for a fresh attempt — but only when the lesson
    // does NOT have hand-authored questions. With authored questions we
    // simply reset to the existing question set (no AI call needed).
    if (lessonTitle && !(staticQuestions && staticQuestions.length >= 8)) {
      setAiLoading(true);
      fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonTitle,
          lessonId,
          objectives: lessonObjectives ?? [],
          steps: lessonStepTitles ?? [],
        }),
      })
        .then((res) => res.json())
        .then((data: { questions?: QuizQuestion[] }) => {
          if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
            setQuestions(data.questions);
            setAiGenerated(true);
          }
        })
        .catch(() => {})
        .finally(() => setAiLoading(false));
    }
  };

  if (finished) {
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="text-5xl mb-4 animate-scale-in">{pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚'}</div>
        <h3 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
          {pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good work!' : 'Keep studying!'}
        </h3>
        <p className="text-3xl font-bold mb-2" style={{ color: 'var(--color-coral)' }}>
          {correctCount}/{questions.length}
        </p>
        <p className="text-sm mb-8" style={{ color: 'var(--color-hint)', fontFamily: 'var(--font-body)' }}>
          {pct >= 80 ? 'You\'ve mastered this lesson.' : 'Review the scenarios you missed and try again.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRetry}
            className="px-5 py-2.5 text-sm font-medium"
            style={{ border: 'var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--color-secondary)', fontFamily: 'var(--font-body)' }}
          >
            Try Again
          </button>
          <button
            onClick={() => onComplete(correctCount)}
            className="px-5 py-2.5 text-sm font-medium"
            style={{ backgroundColor: 'var(--color-coral)', color: '#fff', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)' }}
          >
            Complete Lesson
          </button>
        </div>
      </div>
    );
  }

  if (aiLoading) {
    return (
      <div className="max-w-2xl animate-fade-in" style={{ textAlign: 'center', padding: '48px 0' }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '3px solid var(--color-sand)',
            borderTopColor: 'var(--color-coral)',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }}
        />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-secondary)', marginBottom: 4 }}>
          Generating quiz questions...
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-hint)' }}>
          AI is creating unique questions for this lesson
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div key={currentIndex} className="max-w-2xl animate-fade-in">
      {/* AI badge */}
      {aiGenerated && currentIndex === 0 && !showFeedback && (
        <div
          className="animate-scale-in"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: 'var(--color-coral)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
            fontFamily: 'var(--font-body)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 13 }}>✦</span> AI-Generated Questions
        </div>
      )}

      {/* Progress + Quit */}
      <div
        className="flex items-center justify-between mb-6"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <p className="text-xs" style={{ color: 'var(--color-hint)' }}>
          Question {currentIndex + 1} of {questions.length}
        </p>
        <button
          onClick={handleQuit}
          className="text-xs font-medium"
          style={{
            color: 'var(--color-secondary)',
            border: 'var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 10px',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
        >
          Restart quiz
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 mb-8" style={{ backgroundColor: 'var(--color-sand)', borderRadius: 'var(--radius-full)' }}>
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
            backgroundColor: 'var(--color-coral)',
            borderRadius: 'var(--radius-full)',
          }}
        />
      </div>

      {/* Question */}
      <h3
        className="text-lg font-medium mb-8 animate-fade-in-up"
        style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', lineHeight: 1.6 }}
      >
        {question.question}
      </h3>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectOption = index === question.correctIndex;

          let borderColor = 'var(--color-border)';
          let bgColor = 'transparent';
          let letterBg = 'var(--color-sand)';
          let letterColor = 'var(--color-secondary)';

          if (showFeedback) {
            if (isCorrectOption) {
              borderColor = '#22c55e';
              bgColor = '#f0fdf4';
              letterBg = '#22c55e';
              letterColor = '#fff';
            } else if (isSelected && !isCorrectOption) {
              borderColor = '#ef4444';
              bgColor = '#fef2f2';
              letterBg = '#ef4444';
              letterColor = '#fff';
            } else {
              bgColor = 'transparent';
              borderColor = 'var(--color-border)';
            }
          } else if (isSelected) {
            borderColor = 'var(--color-coral)';
            bgColor = 'var(--color-coral-light)';
            letterBg = 'var(--color-coral)';
            letterColor = '#fff';
          }

          const staggerClass = `animate-fade-in-up stagger-${index + 1}`;

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={showFeedback}
              className={`w-full flex items-start gap-3 p-4 text-left transition-all duration-200 ${staggerClass} ${!showFeedback ? 'card-hover' : ''}`}
              style={{
                border: `1.5px solid ${borderColor}`,
                borderRadius: 'var(--radius-md)',
                backgroundColor: bgColor,
                opacity: showFeedback && !isCorrectOption && !isSelected ? 0.5 : 1,
              }}
            >
              <span
                className="shrink-0 w-7 h-7 flex items-center justify-center text-xs font-semibold"
                style={{
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: letterBg,
                  color: letterColor,
                  fontFamily: 'var(--font-body)',
                }}
              >
                {LETTERS[index]}
              </span>
              <span
                className="text-sm pt-0.5"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-body)', lineHeight: 1.5 }}
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div
          className="p-4 mb-6 animate-scale-in"
          style={{
            backgroundColor: isCorrect ? 'var(--color-coral-light)' : '#fef2f2',
            borderRadius: 'var(--radius-md)',
            border: isCorrect ? '1px solid var(--color-coral)' : '1px solid #fecaca',
          }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: isCorrect ? 'var(--color-coral-dark)' : '#dc2626' }}>
            {isCorrect ? '✓ Correct!' : '✗ Not quite'}
          </p>
          {loadingExplanation ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '4px',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-coral)',
                  animation: 'pulse 1.4s ease-in-out infinite',
                  opacity: 0.7,
                }}
              />
              <span
                style={{
                  fontSize: '13px',
                  color: 'var(--color-hint)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Personalizing explanation...
              </span>
              <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }`}</style>
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--color-body)', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
              {adaptedExplanation ?? question.explanation}
            </p>
          )}
        </div>
      )}

      {/* Next button */}
      {showFeedback && (
        <button
          onClick={handleNext}
          className="w-full py-3 text-sm font-medium transition-all duration-200 animate-fade-in-up card-hover"
          style={{
            backgroundColor: 'var(--color-coral)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {currentIndex + 1 >= questions.length ? 'See Results' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}
