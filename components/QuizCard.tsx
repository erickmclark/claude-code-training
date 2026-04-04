'use client';

import { useState } from 'react';
import { QuizQuestion } from '@/types/lesson';

interface QuizCardProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export default function QuizCard({ questions, onComplete }: QuizCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[currentIndex];
  const isCorrect = selectedAnswer === question?.correctIndex;

  const handleSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === question.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      const finalScore = correctCount;
      setFinished(true);
      onComplete(finalScore);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  if (finished) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 text-center">
        <div className="text-6xl mb-4">{percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}</div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Quiz Complete!
        </h3>
        <p className="text-4xl font-bold text-blue-600 mb-2">
          {correctCount}/{questions.length}
        </p>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {percentage >= 80
            ? 'Excellent! You\'ve mastered this lesson.'
            : percentage >= 60
            ? 'Good job! Review the topics you missed.'
            : 'Keep studying! Review the lesson material and try again.'}
        </p>
        <button
          onClick={() => {
            setCurrentIndex(0);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setCorrectCount(0);
            setFinished(false);
          }}
          className="px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="text-sm font-medium text-emerald-600">
          {correctCount} correct
        </span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-8">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {question.question}
      </h3>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          let styles = 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700';
          if (showExplanation) {
            if (index === question.correctIndex) {
              styles = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
            } else if (index === selectedAnswer && !isCorrect) {
              styles = 'border-red-500 bg-red-50 dark:bg-red-900/20';
            } else {
              styles = 'border-gray-200 dark:border-gray-700 opacity-50';
            }
          } else if (selectedAnswer === index) {
            styles = 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={showExplanation}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${styles}`}
            >
              <span className="text-sm text-gray-900 dark:text-gray-100">
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div
          className={`p-4 rounded-xl mb-6 ${
            isCorrect
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}
        >
          <p className="text-sm font-medium mb-1">
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {question.explanation}
          </p>
        </div>
      )}

      {showExplanation && (
        <button
          onClick={handleNext}
          className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          {currentIndex + 1 >= questions.length ? 'See Results' : 'Next Question'}
        </button>
      )}
    </div>
  );
}
