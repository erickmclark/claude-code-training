import { PracticeExercise } from '@/types/lesson';

export interface FeedbackResult {
  correct: boolean;
  feedback: string;
  score: number; // 0-100
}

export function validateAnswer(exercise: PracticeExercise, input: string): FeedbackResult {
  const trimmed = input.trim().toLowerCase();

  if (!trimmed) {
    return { correct: false, feedback: 'Type your answer above to get started.', score: 0 };
  }

  // Check how many keywords match
  const matchedKeywords = exercise.keywords.filter(kw =>
    trimmed.includes(kw.toLowerCase())
  );
  const matchRatio = matchedKeywords.length / exercise.keywords.length;

  // Exact or near-exact solution match
  const solutionNorm = exercise.solution.trim().toLowerCase().replace(/\s+/g, ' ');
  const inputNorm = trimmed.replace(/\s+/g, ' ');
  if (inputNorm === solutionNorm || inputNorm.includes(solutionNorm) || solutionNorm.includes(inputNorm)) {
    return {
      correct: true,
      feedback: exercise.successMessage,
      score: 100,
    };
  }

  // High keyword match
  if (matchRatio >= 0.8) {
    return {
      correct: true,
      feedback: exercise.successMessage,
      score: 95,
    };
  }

  if (matchRatio >= 0.5) {
    const missing = exercise.keywords.filter(kw => !trimmed.includes(kw.toLowerCase()));
    return {
      correct: false,
      feedback: `Getting close! You've got the right idea. Consider also mentioning: ${missing.slice(0, 2).join(', ')}`,
      score: Math.round(matchRatio * 80),
    };
  }

  if (matchRatio > 0) {
    return {
      correct: false,
      feedback: `You're on the right track, but missing some key concepts. Try using the hints for guidance.`,
      score: Math.round(matchRatio * 50),
    };
  }

  // Type-specific fallback feedback
  const typeFeedback: Record<string, string> = {
    command: 'Think about which terminal commands would accomplish this task. Check the hints for guidance.',
    code: 'Review the code challenge carefully. The hints will point you toward the right syntax.',
    planning: 'Break the problem into phases. What needs to happen first, second, and third?',
    verification: 'Think about how you would verify this works correctly. What checks would you add?',
  };

  return {
    correct: false,
    feedback: typeFeedback[exercise.type] || 'Not quite. Try using the hints for guidance.',
    score: 0,
  };
}

export function getProgressColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 50) return 'text-yellow-400';
  return 'text-slate-400';
}

export function getProgressBarColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-slate-500';
}
