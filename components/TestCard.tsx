'use client';

import { useState } from 'react';
import { QuizQuestion, TestResult } from '@/types/lesson';

interface TestCardProps {
  questions: QuizQuestion[];
  onComplete: (result: TestResult) => void;
}

export default function TestCard({ questions, onComplete }: TestCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const question = questions[currentIndex];

  const handleSelect = (optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const handleSubmit = () => {
    let correct = 0;
    const categoryScores: Record<string, { correct: number; total: number }> = {};

    questions.forEach((q, i) => {
      const category = getCategoryForQuestion(i);
      if (!categoryScores[category]) {
        categoryScores[category] = { correct: 0, total: 0 };
      }
      categoryScores[category].total += 1;
      if (answers[i] === q.correctIndex) {
        correct += 1;
        categoryScores[category].correct += 1;
      }
    });

    const percentage = Math.round((correct / questions.length) * 100);
    const result: TestResult = {
      score: percentage,
      passed: percentage >= 80,
      completedAt: new Date().toISOString(),
      answers: Object.values(answers),
    };

    setSubmitted(true);
    onComplete(result);
  };

  const answeredCount = Object.keys(answers).length;
  const percentage = submitted
    ? Math.round(
        (questions.filter((q, i) => answers[i] === q.correctIndex).length /
          questions.length) *
          100
      )
    : 0;

  if (submitted) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{percentage >= 80 ? '🏆' : percentage >= 60 ? '👍' : '📖'}</div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {percentage >= 80 ? 'Congratulations!' : 'Test Complete'}
          </h3>
          <p className="text-5xl font-bold text-blue-600 mb-2">{percentage}%</p>
          <p className="text-gray-500 dark:text-gray-400">
            {questions.filter((q, i) => answers[i] === q.correctIndex).length} of{' '}
            {questions.length} correct
          </p>
          {percentage >= 80 && (
            <p className="mt-4 text-emerald-600 font-medium">
              You have achieved Claude Code Mastery!
            </p>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">Review Answers</h4>
          {questions.map((q, i) => {
            const isCorrect = answers[i] === q.correctIndex;
            return (
              <div
                key={i}
                className={`p-4 rounded-xl border ${
                  isCorrect
                    ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10'
                    : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                }`}
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {i + 1}. {q.question}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {isCorrect ? '✓ ' : `✗ You answered: ${q.options[answers[i]] || 'No answer'} — `}
                  {q.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="text-sm font-medium text-gray-500">
          {answeredCount} answered
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

      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              answers[currentIndex] === index
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
            }`}
          >
            <span className="text-sm text-gray-900 dark:text-gray-100">{option}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
            disabled={currentIndex === questions.length - 1}
            className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Next
          </button>
        </div>
        {answeredCount === questions.length && (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            Submit Test
          </button>
        )}
      </div>

      <div className="flex gap-1 mt-6 flex-wrap">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
              i === currentIndex
                ? 'bg-blue-600 text-white'
                : answers[i] !== undefined
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

function getCategoryForQuestion(index: number): string {
  const categories = [
    'Parallel Workflows',
    'Parallel Workflows',
    'Planning & Strategy',
    'Planning & Strategy',
    'Planning & Strategy',
    'Project Configuration',
    'Project Configuration',
    'Project Configuration',
    'Parallel Workflows',
    'Parallel Workflows',
    'Productivity',
    'Productivity',
    'Productivity',
    'Productivity',
    'Productivity',
    'Parallel Workflows',
    'Parallel Workflows',
    'Productivity',
    'Productivity',
    'Project Configuration',
    'Project Configuration',
    'Project Configuration',
    'Project Configuration',
    'Productivity',
    'Productivity',
    'Planning & Strategy',
    'Planning & Strategy',
    'Planning & Strategy',
    'Planning & Strategy',
    'Planning & Strategy',
  ];
  return categories[index] || 'General';
}
