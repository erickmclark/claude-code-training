'use client';

import { useState } from 'react';
import type { QuizQuestion } from '@/types/lesson';

interface BeginnerQuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

const LETTERS = ['A', 'B', 'C', 'D'];

export default function BeginnerQuiz({ questions, onComplete }: BeginnerQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[currentIndex];
  const isCorrect = selectedAnswer === question?.correctIndex;

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (index === question.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      onComplete(correctCount);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCorrectCount(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">{pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚'}</div>
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

  return (
    <div className="max-w-2xl">
      {/* Progress */}
      <p className="text-xs mb-6" style={{ color: 'var(--color-hint)', fontFamily: 'var(--font-body)' }}>
        Question {currentIndex + 1} of {questions.length}
      </p>

      {/* Progress bar */}
      <div className="w-full h-1 mb-8" style={{ backgroundColor: 'var(--color-sand)', borderRadius: 'var(--radius-full)' }}>
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
            backgroundColor: 'var(--color-coral)',
            borderRadius: 'var(--radius-full)',
          }}
        />
      </div>

      {/* Question */}
      <h3
        className="text-lg font-medium mb-8"
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

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={showFeedback}
              className="w-full flex items-start gap-3 p-4 text-left transition-all"
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
          className="p-4 mb-6"
          style={{
            backgroundColor: isCorrect ? 'var(--color-coral-light)' : '#fef2f2',
            borderRadius: 'var(--radius-md)',
            border: isCorrect ? '1px solid var(--color-coral)' : '1px solid #fecaca',
          }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: isCorrect ? 'var(--color-coral-dark)' : '#dc2626' }}>
            {isCorrect ? '✓ Correct!' : '✗ Not quite'}
          </p>
          <p className="text-sm" style={{ color: 'var(--color-body)', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
            {question.explanation}
          </p>
        </div>
      )}

      {/* Next button */}
      {showFeedback && (
        <button
          onClick={handleNext}
          className="w-full py-3 text-sm font-medium transition-all"
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
