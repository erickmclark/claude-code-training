'use client';

import { use } from 'react';
import LessonPage from '@/src/components/lesson/LessonPage';

export default function Page({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  return <LessonPage lessonId={parseInt(lessonId, 10)} />;
}
