'use client';

// Legacy route: redirects to the canonical /lesson/[id] implementation.
// All lesson rendering lives in src/components/lesson/LessonPage.tsx so features
// like Lesson 36's WorkflowDiagram work regardless of which URL the user lands on.

import { use } from 'react';
import LessonPage from '@/src/components/lesson/LessonPage';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <LessonPage lessonId={parseInt(id, 10)} />;
}
