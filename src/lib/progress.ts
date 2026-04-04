const STORAGE_KEY = 'claude-training-progress';

// ─── Types ───────────────────────────────────────────────

export type LessonStatus = 'locked' | 'available' | 'in-progress' | 'complete';
export type ModuleStatus = 'locked' | 'in-progress' | 'complete';

export type LessonProgress = {
  status: LessonStatus;
  currentStep: number;
  stepsComplete: string[];
  quizAnswers: {
    [questionId: string]: {
      selected: string;
      correct: boolean;
      reasoning?: string;
      score?: number;
    };
  };
  quizComplete: boolean;
  exerciseComplete: boolean;
  startedAt: string;
  completedAt?: string;
};

export type ModuleProgress = {
  status: ModuleStatus;
  lessonsComplete: number[];
  capstoneComplete: boolean;
  startedAt?: string;
  completedAt?: string;
};

export type UserProgress = {
  userId: string;
  userLevel: 'A' | 'B' | 'C' | null;
  currentLessonId: number;
  currentStep: number;
  streak: {
    count: number;
    lastActiveDate: string;
    activeDates: string[];
  };
  modules: {
    [moduleId: string]: ModuleProgress;
  };
  lessons: {
    [lessonId: string]: LessonProgress;
  };
  quizScores: {
    [lessonId: string]: number;
  };
  finalTestScore?: number;
  certificateEarned?: boolean;
  createdAt: string;
  updatedAt: string;
};

// ─── Module → Lesson mapping ─────────────────────────────

const MODULE_LESSONS: Record<string, number[]> = {
  '1': [1, 2, 3, 13],
  '2': [4, 5, 6, 14, 20],
  '3': [9, 10, 11, 19],
  '4': [7, 8, 12, 15, 16, 17, 18],
};

const MODULE_UNLOCK_ORDER: Record<string, string | null> = {
  '1': null,
  '2': '1',
  '3': '2',
  '4': '3',
};

// ─── Default state ───────────────────────────────────────

function createDefaultProgress(): UserProgress {
  return {
    userId: crypto.randomUUID(),
    userLevel: null,
    currentLessonId: 1,
    currentStep: 0,
    streak: {
      count: 0,
      lastActiveDate: '',
      activeDates: [],
    },
    modules: {
      '1': { status: 'in-progress', lessonsComplete: [], capstoneComplete: false },
      '2': { status: 'locked', lessonsComplete: [], capstoneComplete: false },
      '3': { status: 'locked', lessonsComplete: [], capstoneComplete: false },
      '4': { status: 'locked', lessonsComplete: [], capstoneComplete: false },
    },
    lessons: {},
    quizScores: {},
    certificateEarned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ─── Core read/write ─────────────────────────────────────

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return createDefaultProgress();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const init = createDefaultProgress();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
    return init;
  }
  try {
    return JSON.parse(raw) as UserProgress;
  } catch {
    const init = createDefaultProgress();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
    return init;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  progress.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// ─── Lesson helpers ──────────────────────────────────────

function defaultLessonProgress(): LessonProgress {
  return {
    status: 'available',
    currentStep: 0,
    stepsComplete: [],
    quizAnswers: {},
    quizComplete: false,
    exerciseComplete: false,
    startedAt: new Date().toISOString(),
  };
}

export function getLessonProgress(lessonId: number): LessonProgress {
  const progress = getProgress();
  return progress.lessons[String(lessonId)] || defaultLessonProgress();
}

export function updateLesson(lessonId: number, update: Partial<LessonProgress>): void {
  const progress = getProgress();
  const key = String(lessonId);
  const existing = progress.lessons[key] || defaultLessonProgress();
  progress.lessons[key] = { ...existing, ...update };
  progress.currentLessonId = lessonId;
  if (update.currentStep !== undefined) {
    progress.currentStep = update.currentStep;
  }
  saveProgress(progress);
}

export function completeStep(lessonId: number, stepId: string): void {
  const progress = getProgress();
  const key = String(lessonId);
  const lesson = progress.lessons[key] || defaultLessonProgress();

  if (!lesson.stepsComplete.includes(stepId)) {
    lesson.stepsComplete = [...lesson.stepsComplete, stepId];
  }

  if (lesson.status === 'available') {
    lesson.status = 'in-progress';
  }

  progress.lessons[key] = lesson;
  progress.currentLessonId = lessonId;
  saveProgress(progress);
}

export function completeLesson(lessonId: number): void {
  const progress = getProgress();
  const key = String(lessonId);
  const lesson = progress.lessons[key] || defaultLessonProgress();

  lesson.status = 'complete';
  lesson.completedAt = new Date().toISOString();
  progress.lessons[key] = lesson;

  // Find which module this lesson belongs to and update it
  for (const [moduleId, lessonIds] of Object.entries(MODULE_LESSONS)) {
    if (lessonIds.includes(lessonId)) {
      const mod = progress.modules[moduleId];
      if (mod && !mod.lessonsComplete.includes(lessonId)) {
        mod.lessonsComplete = [...mod.lessonsComplete, lessonId];
      }

      // Check if all lessons in this module are complete
      if (mod) {
        const allDone = lessonIds.every((id) =>
          mod.lessonsComplete.includes(id)
        );
        if (allDone && mod.capstoneComplete) {
          completeModuleInternal(progress, parseInt(moduleId, 10));
        }
      }
      break;
    }
  }

  // Unlock next lesson in the same module
  unlockNextLesson(progress, lessonId);

  saveProgress(progress);
}

// ─── Module helpers ──────────────────────────────────────

function completeModuleInternal(progress: UserProgress, moduleId: number): void {
  const key = String(moduleId);
  const mod = progress.modules[key];
  if (!mod) return;

  mod.status = 'complete';
  mod.completedAt = new Date().toISOString();

  // Unlock next module
  for (const [nextId, prevId] of Object.entries(MODULE_UNLOCK_ORDER)) {
    if (prevId === key) {
      const nextMod = progress.modules[nextId];
      if (nextMod && nextMod.status === 'locked') {
        nextMod.status = 'in-progress';
        nextMod.startedAt = new Date().toISOString();

        // Unlock first lesson in the newly unlocked module
        const firstLessonId = MODULE_LESSONS[nextId]?.[0];
        if (firstLessonId) {
          const firstLessonKey = String(firstLessonId);
          if (!progress.lessons[firstLessonKey]) {
            progress.lessons[firstLessonKey] = defaultLessonProgress();
          } else if (progress.lessons[firstLessonKey].status === 'locked') {
            progress.lessons[firstLessonKey].status = 'available';
          }
        }
      }
      break;
    }
  }
}

function unlockNextLesson(progress: UserProgress, completedLessonId: number): void {
  for (const [, lessonIds] of Object.entries(MODULE_LESSONS)) {
    const idx = lessonIds.indexOf(completedLessonId);
    if (idx !== -1 && idx + 1 < lessonIds.length) {
      const nextLessonId = lessonIds[idx + 1];
      const nextKey = String(nextLessonId);
      if (!progress.lessons[nextKey]) {
        progress.lessons[nextKey] = defaultLessonProgress();
      } else if (progress.lessons[nextKey].status === 'locked') {
        progress.lessons[nextKey].status = 'available';
      }
      break;
    }
  }
}

export function completeModule(moduleId: number): void {
  const progress = getProgress();
  completeModuleInternal(progress, moduleId);
  saveProgress(progress);
}

// ─── Quiz helpers ────────────────────────────────────────

export function saveQuizAnswer(
  lessonId: number,
  questionId: string,
  answer: {
    selected: string;
    correct: boolean;
    reasoning?: string;
    score?: number;
  }
): void {
  const progress = getProgress();
  const key = String(lessonId);
  const lesson = progress.lessons[key] || defaultLessonProgress();

  lesson.quizAnswers[questionId] = answer;

  if (lesson.status === 'available') {
    lesson.status = 'in-progress';
  }

  progress.lessons[key] = lesson;
  saveProgress(progress);
}

// ─── Course progress ─────────────────────────────────────

export function getCourseProgress(): number {
  const progress = getProgress();
  const totalLessons = Object.values(MODULE_LESSONS).flat().length; // 20
  const completedLessons = Object.values(progress.lessons).filter(
    (l) => l.status === 'complete'
  ).length;
  return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
}

// ─── Streak ──────────────────────────────────────────────

export function updateStreak(): void {
  const progress = getProgress();
  const today = new Date().toISOString().split('T')[0];

  if (progress.streak.lastActiveDate === today) {
    return; // Already active today
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (progress.streak.lastActiveDate === yesterday) {
    // Consecutive day — increment streak
    progress.streak.count += 1;
  } else {
    // Streak broken — reset to 1
    progress.streak.count = 1;
  }

  progress.streak.lastActiveDate = today;
  if (!progress.streak.activeDates.includes(today)) {
    progress.streak.activeDates = [...progress.streak.activeDates, today];
  }

  saveProgress(progress);
}

// ─── User level ──────────────────────────────────────────

export function saveUserLevel(level: 'A' | 'B' | 'C'): void {
  const progress = getProgress();
  progress.userLevel = level;
  saveProgress(progress);
}

// ─── Resume ──────────────────────────────────────────────

export function getCurrentLesson(): { lessonId: number; step: number } {
  const progress = getProgress();
  return {
    lessonId: progress.currentLessonId,
    step: progress.currentStep,
  };
}
