import { UserProgress, LessonProgress, TestResult } from '@/types/lesson';

const STORAGE_KEY = 'claude-code-training-progress';

function defaultProgress(): UserProgress {
  return {
    lessons: {},
    startedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    testResult: null,
    buildProgress: {},
  };
}

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initial = defaultProgress();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    const parsed = JSON.parse(stored) as UserProgress;
    return {
      ...defaultProgress(),
      ...parsed,
      lessons: parsed.lessons || {},
      buildProgress: parsed.buildProgress || {},
    };
  } catch {
    const initial = defaultProgress();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
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
    practicesCompleted: [],
  };
}

export function markLessonComplete(lessonId: number, quizScore: number): void {
  const progress = getProgress();
  const current = getLessonProgress(lessonId);
  progress.lessons[lessonId] = {
    ...current,
    completed: true,
    quizScore,
    completedAt: new Date().toISOString(),
  };
  saveProgress(progress);
}

export function toggleStepComplete(lessonId: number, stepIndex: number): void {
  const progress = getProgress();
  const lesson = getLessonProgress(lessonId);
  const steps = new Set(lesson.stepsCompleted);
  if (steps.has(stepIndex)) steps.delete(stepIndex);
  else steps.add(stepIndex);
  progress.lessons[lessonId] = { ...lesson, stepsCompleted: [...steps].sort((a, b) => a - b) };
  saveProgress(progress);
}

export function getCompletionPercentage(): number {
  const progress = getProgress();
  const completed = Object.values(progress.lessons).filter((l) => l.completed).length;
  return Math.round((completed / 12) * 100);
}

export function getCompletedCount(): number {
  const progress = getProgress();
  return Object.values(progress.lessons).filter((l) => l.completed).length;
}

export function getCompletedLessonIds(): number[] {
  const progress = getProgress();
  return Object.values(progress.lessons)
    .filter((l) => l.completed)
    .map((l) => l.lessonId)
    .sort((a, b) => a - b);
}

export function markPracticeComplete(lessonId: number, exerciseId: string): void {
  const progress = getProgress();
  const lesson = getLessonProgress(lessonId);
  const practices = new Set(lesson.practicesCompleted || []);
  practices.add(exerciseId);
  progress.lessons[lessonId] = { ...lesson, practicesCompleted: [...practices] };
  saveProgress(progress);
}

export function getCompletedPractices(lessonId: number): string[] {
  return getLessonProgress(lessonId).practicesCompleted || [];
}

export function getBuildProgress(buildId: string): number[] {
  const progress = getProgress();
  return progress.buildProgress?.[buildId] || [];
}

export function toggleBuildStep(buildId: string, stepId: number): void {
  const progress = getProgress();
  const current = new Set(progress.buildProgress?.[buildId] || []);
  if (current.has(stepId)) current.delete(stepId);
  else current.add(stepId);
  progress.buildProgress = progress.buildProgress || {};
  progress.buildProgress[buildId] = [...current].sort((a, b) => a - b);
  saveProgress(progress);
}

export function saveTestResult(result: TestResult): void {
  const progress = getProgress();
  progress.testResult = result;
  saveProgress(progress);
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
