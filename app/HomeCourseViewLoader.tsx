'use client';

import dynamic from 'next/dynamic';

const HomeCourseView = dynamic(() => import('./HomeCourseView'), { ssr: false });

export default function HomeCourseViewLoader() {
  return <HomeCourseView />;
}
