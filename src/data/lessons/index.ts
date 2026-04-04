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
