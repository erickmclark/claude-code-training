'use client';

import { useState } from 'react';
import { QuizQuestion } from '@/types/lesson';

interface QuizProps {
  questions: QuizQuestion[];
  lessonId: number;
  onComplete: (score: number) => void;
}

export default function Quiz({ questions, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question?.correctIndex;

  const handleSelect = (idx: number) => {
    if (showExplanation) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === question.correctIndex) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const finalScore = correctCount + (isCorrect ? 0 : 0);
      setCompleted(true);
      onComplete(Math.round((correctCount / questions.length) * 100));
    }
  };

  if (completed) {
    const score = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-8 text-center">
        <div className="text-6xl mb-4">{score >= 80 ? '🎉' : score >= 60 ? '👍' : '📚'}</div>
        <h3 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h3>
        <p className="text-4xl font-bold mb-2">
          <span className={score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'}>
            {score}%
          </span>
        </p>
        <p className="text-slate-300 mb-4">
          {correctCount} of {questions.length} correct
        </p>
        <p className="text-slate-400">
          {score >= 80
            ? 'Excellent! You\'ve mastered this lesson.'
            : score >= 60
            ? 'Good work! Review the material and try again.'
            : 'Keep learning! Review the lesson and retake the quiz.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Quiz</h3>
        <span className="text-sm text-slate-400">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      <div className="mb-2 bg-slate-700 rounded-full h-1.5">
        <div
          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>

      <p className="text-white text-lg mb-6 mt-4">{question.question}</p>

      <div className="space-y-3 mb-6">
        {question.options.map((option, idx) => {
          let style = 'border-slate-600 bg-slate-700/50 hover:border-blue-500 hover:bg-slate-700';
          if (showExplanation) {
            if (idx === question.correctIndex) {
              style = 'border-green-500 bg-green-500/20';
            } else if (idx === selectedAnswer && !isCorrect) {
              style = 'border-red-500 bg-red-500/20';
            } else {
              style = 'border-slate-600 bg-slate-700/30 opacity-50';
            }
          } else if (selectedAnswer === idx) {
            style = 'border-blue-500 bg-blue-500/20';
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${style}`}
            >
              <span className="text-slate-300">{option}</span>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className={`p-4 rounded-lg mb-4 ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
          <p className={`font-semibold mb-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </p>
          <p className="text-slate-300 text-sm">{question.explanation}</p>
        </div>
      )}

      {showExplanation && (
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
        >
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
        </button>
      )}
    </div>
  );
}
