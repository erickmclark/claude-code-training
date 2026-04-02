import { UserProgress, LessonProgress } from '@/types/lesson';

const STORAGE_KEY = 'claude-code-training-progress';

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return { lessons: {}, startedAt: '', lastActiveAt: '' };
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  const initial: UserProgress = {
    lessons: {},
    startedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  progress.lastActiveAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getLessonProgress(lessonId: number): LessonProgress {
  const progress = getProgress();
  return progress.lessons[lessonId] || {
    lessonId,
    completed: false,
    quizScore: null,
    completedAt: null,
    stepsCompleted: [],
  };
}

export function markLessonComplete(lessonId: number, quizScore: number): void {
  const progress = getProgress();
  progress.lessons[lessonId] = {
    lessonId,
    completed: true,
    quizScore,
    completedAt: new Date().toISOString(),
    stepsCompleted: [],
  };
  saveProgress(progress);
}

export function getCompletionPercentage(): number {
  const progress = getProgress();
  const completed = Object.values(progress.lessons).filter(l => l.completed).length;
  return Math.round((completed / 12) * 100);
}

export function getCompletedCount(): number {
  const progress = getProgress();
  return Object.values(progress.lessons).filter(l => l.completed).length;
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
