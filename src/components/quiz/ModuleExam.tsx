'use client';

import { useState, useEffect } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface ModuleExamProps {
  moduleId: number;
  moduleTitle: string;
  onComplete?: (score: number) => void;
}

export default function ModuleExam({ moduleId, moduleTitle, onComplete }: ModuleExamProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleQuit = () => {
    const confirmed =
      typeof window === 'undefined' ||
      window.confirm('Restart the exam from question 1? Your current answers will be discarded.');
    if (!confirmed) return;
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCorrectCount(0);
    setFinished(false);
  };

  useEffect(() => {
    fetchQuestions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  function fetchQuestions() {
    setLoading(true);
    setError(false);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCorrectCount(0);
    setFinished(false);

    fetch('/api/quiz/module-exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleId }),
    })
      .then((res) => res.json())
      .then((data: { questions?: QuizQuestion[] }) => {
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div
          style={{
            width: 36,
            height: 36,
            border: '3px solid var(--color-sand)',
            borderTopColor: 'var(--color-coral)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }}
        />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-secondary)' }}>
          Generating module exam...
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-hint)', marginTop: '4px' }}>
          20 questions covering all lessons in {moduleTitle}
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-hint)' }}>
          Failed to generate exam. Please try again.
        </p>
        <button
          onClick={fetchQuestions}
          style={{
            marginTop: '16px',
            backgroundColor: 'var(--color-coral)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '8px 20px',
            fontSize: '14px',
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((correctCount / questions.length) * 100);
    const passed = pct >= 80;

    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '40px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
          {passed ? '🎉' : '📚'}
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--color-ink)',
            marginBottom: '8px',
          }}
        >
          {passed ? 'Module Complete!' : 'Keep Practicing'}
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--color-secondary)', marginBottom: '24px' }}>
          You scored <strong style={{ color: 'var(--color-ink)' }}>{correctCount}/{questions.length}</strong> ({pct}%)
          {passed ? ' — you\'ve mastered this module!' : ' — 80% needed to pass. Review the lessons and try again.'}
        </p>

        {/* Score bar */}
        <div style={{ maxWidth: '300px', margin: '0 auto 32px' }}>
          <div style={{ height: '8px', backgroundColor: 'var(--color-sand)', borderRadius: 'var(--radius-full)' }}>
            <div
              style={{
                height: '100%',
                width: `${pct}%`,
                backgroundColor: passed ? '#16a34a' : 'var(--color-coral)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-hint)' }}>0%</span>
            <span style={{ fontSize: '11px', color: 'var(--color-hint)' }}>80% to pass</span>
            <span style={{ fontSize: '11px', color: 'var(--color-hint)' }}>100%</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={fetchQuestions}
            style={{
              border: 'var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 24px',
              fontSize: '14px',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              color: 'var(--color-secondary)',
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
          {passed && onComplete && (
            <button
              onClick={() => onComplete(pct)}
              style={{
                backgroundColor: 'var(--color-coral)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '10px 24px',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Continue →
            </button>
          )}
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];
  if (!q) return null;

  const isCorrect = selectedAnswer === q.correctIndex;

  function handleSelect(optionIndex: number) {
    if (showFeedback) return;
    setSelectedAnswer(optionIndex);
    setShowFeedback(true);
    if (optionIndex === q.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  }

  function handleNext() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setFinished(true);
    }
  }

  return (
    <div style={{ maxWidth: '700px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: 12 }}>
        <div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-coral)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Module Exam
          </span>
          <span style={{ fontSize: '13px', color: 'var(--color-hint)', fontFamily: 'var(--font-body)', marginLeft: '8px' }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '13px', color: 'var(--color-hint)', fontFamily: 'var(--font-body)' }}>
            {correctCount} correct
          </span>
          <button
            onClick={handleQuit}
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--color-secondary)',
              fontFamily: 'var(--font-body)',
              border: 'var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 10px',
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            Restart exam
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '3px', backgroundColor: 'var(--color-sand)', borderRadius: 'var(--radius-full)', marginBottom: '28px' }}>
        <div
          style={{
            height: '100%',
            width: `${((currentIndex + (showFeedback ? 1 : 0)) / questions.length) * 100}%`,
            backgroundColor: 'var(--color-coral)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Question */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          color: 'var(--color-ink)',
          lineHeight: 1.7,
          marginBottom: '24px',
        }}
      >
        {q.question}
      </p>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {q.options.map((option, i) => {
          let bg = '#fff';
          let borderColor = 'var(--color-border)';
          let textColor = 'var(--color-body)';

          if (showFeedback) {
            if (i === q.correctIndex) {
              bg = '#f0faf4';
              borderColor = '#16a34a';
              textColor = '#15803d';
            } else if (i === selectedAnswer && !isCorrect) {
              bg = '#fef2f2';
              borderColor = '#ef4444';
              textColor = '#dc2626';
            }
          } else if (selectedAnswer === i) {
            borderColor = 'var(--color-coral)';
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px 18px',
                backgroundColor: bg,
                border: `1.5px solid ${borderColor}`,
                borderRadius: 'var(--radius-md)',
                textAlign: 'left',
                cursor: showFeedback ? 'default' : 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  backgroundColor: showFeedback && i === q.correctIndex ? '#16a34a' : 'var(--color-sand)',
                  color: showFeedback && i === q.correctIndex ? '#fff' : 'var(--color-secondary)',
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span
                style={{
                  fontSize: '14px',
                  fontFamily: 'var(--font-body)',
                  color: textColor,
                  lineHeight: 1.5,
                }}
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
          style={{
            padding: '16px 20px',
            backgroundColor: isCorrect ? '#f0faf4' : '#fef2f2',
            borderLeft: `3px solid ${isCorrect ? '#16a34a' : '#ef4444'}`,
            borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
            marginBottom: '20px',
          }}
        >
          <p style={{ fontSize: '13px', fontWeight: 600, color: isCorrect ? '#15803d' : '#dc2626', fontFamily: 'var(--font-body)', marginBottom: '4px' }}>
            {isCorrect ? '✓ Correct!' : '✗ Not quite'}
          </p>
          <p style={{ fontSize: '13px', color: 'var(--color-body)', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
            {q.explanation}
          </p>
        </div>
      )}

      {/* Next button */}
      {showFeedback && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleNext}
            style={{
              backgroundColor: 'var(--color-ink)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
            }}
          >
            {currentIndex + 1 < questions.length ? 'Next Question →' : 'See Results →'}
          </button>
        </div>
      )}
    </div>
  );
}
