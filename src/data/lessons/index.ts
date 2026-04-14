export { lessons, lessonSummaries } from '@/data/lessons';
export { modules } from '@/data/modules';
export type { LessonContent, Step, QuizQuestion, Module } from '@/types/lesson';

import { lessons } from '@/data/lessons';
import { modules } from '@/data/modules';

export function getLessonById(id: number) {
  return lessons.find((l) => l.id === id);
}

export function getModuleForLesson(lessonId: number) {
  return modules.find((m) => m.lessons.includes(lessonId));
}

/**
 * Returns the global lesson number (1-based) across all modules in their declared order.
 * Returns null if the lesson is not found in any module.
 */
export function getGlobalLessonNumber(lessonId: number): number | null {
  let n = 0;
  for (const mod of modules) {
    for (const lid of mod.lessons) {
      n += 1;
      if (lid === lessonId) return n;
    }
  }
  return null;
}
