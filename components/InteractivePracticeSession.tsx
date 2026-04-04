'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PracticeExercise } from '@/types/lesson';
import { validateAnswer, getProgressBarColor } from '@/utils/practiceFeedback';

interface InteractivePracticeSessionProps {
  exercises: PracticeExercise[];
  lessonId: number;
  onExerciseComplete: (exerciseId: string) => void;
  completedExercises: string[];
}

const typeLabels: Record<string, { label: string; color: string; icon: string }> = {
  command: { label: 'Command Practice', color: 'text-blue-400 bg-blue-500/20 border-blue-500/30', icon: '>' },
  code: { label: 'Code Practice', color: 'text-green-400 bg-green-500/20 border-green-500/30', icon: '{ }' },
  planning: { label: 'Planning Practice', color: 'text-purple-400 bg-purple-500/20 border-purple-500/30', icon: '?' },
  verification: { label: 'Verification Practice', color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30', icon: '!' },
};

const difficultyColors: Record<string, string> = {
  beginner: 'text-green-400 bg-green-500/20 border-green-500/30',
  intermediate: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
  advanced: 'text-red-400 bg-red-500/20 border-red-500/30',
};

export default function InteractivePracticeSession({
  exercises,
  lessonId,
  onExerciseComplete,
  completedExercises,
}: InteractivePracticeSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string; score: number } | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const exercise = exercises[currentIndex];
  const isExerciseCompleted = completedExercises.includes(exercise?.id);
  const allCompleted = exercises.every(e => completedExercises.includes(e.id));

  // Reset state when exercise changes
  useEffect(() => {
    setInput('');
    setFeedback(null);
    setShowHints(false);
    setHintIndex(0);
    setShowSolution(false);
    setIsComplete(false);
  }, [currentIndex]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(120, textareaRef.current.scrollHeight)}px`;
    }
  }, [input]);

  const handleSubmit = useCallback(() => {
    if (!exercise || !input.trim()) return;
    const result = validateAnswer(exercise, input);
    setFeedback({ correct: result.correct, message: result.feedback, score: result.score });

    if (result.correct) {
      setIsComplete(true);
      onExerciseComplete(exercise.id);
    }
  }, [exercise, input, onExerciseComplete]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === '/' && e.ctrlKey) {
      e.preventDefault();
      setShowHints(true);
      setHintIndex(prev => Math.min(prev + 1, (exercise?.hints.length ?? 1) - 1));
    }
  }, [handleSubmit, exercise?.hints.length]);

  const handleNextExercise = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (!exercise) return null;

  const typeInfo = typeLabels[exercise.type];
  const completedCount = exercises.filter(e => completedExercises.includes(e.id)).length;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-white">Interactive Practice</h3>
          <span className="text-sm text-slate-400">
            {completedCount}/{exercises.length} completed
          </span>
        </div>
        <div className="flex gap-1.5">
          {exercises.map((ex, idx) => (
            <button
              key={ex.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                idx === currentIndex
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400/50'
                  : completedExercises.includes(ex.id)
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {completedExercises.includes(ex.id) ? '\u2713' : idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-700 rounded-full h-1.5">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / exercises.length) * 100}%` }}
        />
      </div>

      {/* All Complete Banner */}
      {allCompleted && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">&#x1F389;</div>
          <h3 className="text-xl font-bold text-green-400 mb-1">All Practices Complete!</h3>
          <p className="text-slate-300">You&apos;ve mastered all the exercises for this lesson. Move on to the quiz to test your knowledge.</p>
        </div>
      )}

      {/* Exercise Card */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        {/* Exercise Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border ${typeInfo.color}`}>
              {typeInfo.icon} {typeInfo.label}
            </span>
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${difficultyColors[exercise.difficulty]}`}>
              {exercise.difficulty}
            </span>
            {isExerciseCompleted && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold text-green-400 bg-green-500/20 border border-green-500/30">
                &#x2713; Completed
              </span>
            )}
          </div>
          <h4 className="text-xl font-bold text-white mb-2">{exercise.title}</h4>
          <p className="text-slate-400">{exercise.description}</p>
        </div>

        {/* Challenge */}
        <div className="p-6 bg-slate-900/50 border-b border-slate-700">
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold text-sm shrink-0 mt-0.5">?</span>
            <div>
              <h5 className="font-semibold text-blue-300 mb-1">Challenge</h5>
              <p className="text-slate-200">{exercise.challenge}</p>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={exercise.inputPlaceholder}
              className={`w-full min-h-[120px] p-4 rounded-lg border bg-slate-900 text-slate-200 placeholder-slate-500 font-mono text-sm resize-none focus:outline-none focus:ring-2 transition-all ${
                feedback?.correct
                  ? 'border-green-500/50 focus:ring-green-500/30'
                  : feedback && !feedback.correct
                  ? 'border-red-500/50 focus:ring-red-500/30'
                  : 'border-slate-600 focus:ring-blue-500/30'
              }`}
              spellCheck={false}
            />
            <div className="absolute bottom-2 right-2 text-xs text-slate-500">
              {navigator.platform?.includes('Mac') ? '\u2318' : 'Ctrl'}+Enter to submit &middot; Ctrl+/ for hint
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                input.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
            <button
              onClick={() => {
                setShowHints(true);
                setHintIndex(prev => Math.min(prev + 1, exercise.hints.length - 1));
              }}
              className="px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors text-sm"
            >
              &#x1F4A1; Hint {showHints ? `(${Math.min(hintIndex + 1, exercise.hints.length)}/${exercise.hints.length})` : ''}
            </button>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors text-sm"
            >
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </button>
          </div>
        </div>

        {/* Hints */}
        {showHints && (
          <div className="px-6 pb-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 space-y-2">
              {exercise.hints.slice(0, hintIndex + 1).map((hint, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 text-sm font-bold shrink-0">Hint {idx + 1}:</span>
                  <p className="text-amber-200 text-sm">{hint}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Solution */}
        {showSolution && (
          <div className="px-6 pb-4">
            <div className="bg-slate-900 border border-slate-600 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-slate-800 border-b border-slate-600 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Solution</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(exercise.solution);
                  }}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Copy
                </button>
              </div>
              <pre className="p-4 text-sm text-slate-200 font-mono whitespace-pre-wrap overflow-x-auto">
                {exercise.solution}
              </pre>
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className="px-6 pb-6">
            <div className={`rounded-lg p-4 border ${
              feedback.correct
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{feedback.correct ? '\u2705' : '\u274C'}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`font-bold ${feedback.correct ? 'text-green-400' : 'text-red-400'}`}>
                      {feedback.correct ? 'Correct!' : 'Not quite right'}
                    </span>
                    {feedback.score > 0 && !feedback.correct && (
                      <span className={`text-xs font-mono ${getProgressBarColor(feedback.score).replace('bg-', 'text-')}`}>
                        {feedback.score}% match
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 text-sm">{feedback.message}</p>
                </div>
              </div>

              {/* Score bar for partial matches */}
              {!feedback.correct && feedback.score > 0 && (
                <div className="mt-3 bg-slate-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${getProgressBarColor(feedback.score)}`}
                    style={{ width: `${feedback.score}%` }}
                  />
                </div>
              )}
            </div>

            {/* Next Exercise Button */}
            {isComplete && currentIndex < exercises.length - 1 && (
              <button
                onClick={handleNextExercise}
                className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all"
              >
                Next Practice &rarr;
              </button>
            )}

            {isComplete && currentIndex === exercises.length - 1 && (
              <div className="mt-4 text-center text-sm text-slate-400">
                All practices for this lesson are done! Head to the Quiz tab to test your knowledge.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts */}
      <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
        <span><kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-400 font-mono">{typeof navigator !== 'undefined' && navigator.platform?.includes('Mac') ? '\u2318' : 'Ctrl'}+Enter</kbd> Submit</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-400 font-mono">Ctrl+/</kbd> Hint</span>
      </div>
    </div>
  );
}
