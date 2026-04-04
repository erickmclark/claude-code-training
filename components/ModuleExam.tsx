'use client';

import { useState, useEffect, useCallback } from 'react';
import { ModuleExam as ModuleExamType } from '@/types/assessment';
import { ExamResult } from '@/types/assessment';
import { formatTime } from '@/utils/assessment';

interface ModuleExamProps {
  exam: ModuleExamType;
  onComplete: (result: ExamResult) => void;
}

export default function ModuleExam({ exam, onComplete }: ModuleExamProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(exam.duration * 60);
  const [startTime] = useState(Date.now());

  const questions = exam.questions;
  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question?.correctIndex;

  const finishExam = useCallback((finalAnswers: number[], finalCorrectCount: number) => {
    setCompleted(true);
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const score = Math.round((finalCorrectCount / questions.length) * 100);
    const result: ExamResult = {
      examId: exam.id,
      score,
      passed: score >= exam.passingScore,
      completedAt: new Date().toISOString(),
      timeSpent,
      answers: finalAnswers,
    };
    onComplete(result);
  }, [startTime, questions.length, exam.id, exam.passingScore, onComplete]);

  useEffect(() => {
    if (completed) return;
    if (timeRemaining <= 0) {
      // Auto-submit with current answers
      const finalAnswers = [...answers];
      // Fill remaining unanswered questions with -1
      while (finalAnswers.length < questions.length) {
        finalAnswers.push(-1);
      }
      finishExam(finalAnswers, correctCount);
      return;
    }
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, completed, answers, questions.length, correctCount, finishExam]);

  const handleSelect = (idx: number) => {
    if (showExplanation) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    setAnswers(prev => [...prev, idx]);
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
      const finalAnswers = [...answers];
      const finalCorrectCount = correctCount;
      finishExam(finalAnswers, finalCorrectCount);
    }
  };

  if (completed) {
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= exam.passingScore;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    return (
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-8 text-center">
        <div className="text-6xl mb-4">{passed ? '🎉' : '📚'}</div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {exam.title} — {passed ? 'Passed!' : 'Not Passed'}
        </h3>
        <p className="text-4xl font-bold mb-2">
          <span className={passed ? 'text-green-400' : 'text-red-400'}>
            {score}%
          </span>
        </p>
        <p className="text-slate-300 mb-2">
          {correctCount} of {questions.length} correct
        </p>
        <p className="text-slate-400 mb-4">
          Time: {formatTime(timeSpent)}
        </p>
        <p className="text-slate-400 mb-6">
          {passed
            ? 'Great work! You\'ve demonstrated solid understanding of this module.'
            : `You need ${exam.passingScore}% to pass. Review the material and try again.`}
        </p>
        {passed ? (
          <button
            onClick={() => {}}
            className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={() => {
              setCurrentQuestion(0);
              setSelectedAnswer(null);
              setShowExplanation(false);
              setCorrectCount(0);
              setAnswers([]);
              setCompleted(false);
              setTimeRemaining(exam.duration * 60);
            }}
            className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
          >
            Retake Exam
          </button>
        )}
      </div>
    );
  }

  const timerWarning = timeRemaining <= 60;

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">{exam.title}</h3>
        <span className={`text-sm font-mono font-semibold px-3 py-1 rounded-lg ${
          timerWarning
            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
            : 'bg-slate-700 text-slate-300'
        }`}>
          {formatTime(timeRemaining)}
        </span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-400">
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <span className="text-sm text-slate-400">
          {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
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
