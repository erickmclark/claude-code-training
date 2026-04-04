'use client';

import { SkillCategory } from '@/types/lesson';
import ProgressRing from './ProgressRing';

interface SkillCardProps {
  skill: SkillCategory;
  proficiency: 'Novice' | 'Practitioner' | 'Expert';
  completedCount: number;
}

const proficiencyConfig = {
  Novice: { label: 'Novice', color: 'text-gray-500' },
  Practitioner: { label: 'Practitioner', color: 'text-blue-600' },
  Expert: { label: 'Expert', color: 'text-emerald-600' },
};

export default function SkillCard({ skill, proficiency, completedCount }: SkillCardProps) {
  const totalLessons = skill.skills.flatMap((s) => s.lessons || []).length;
  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const config = proficiencyConfig[proficiency];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
            {skill.title}
          </h3>
        </div>
        <ProgressRing percentage={percentage} size={56} strokeWidth={4} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {skill.description}
      </p>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${config.color}`}>
          {config.label}
        </span>
        <span className="text-xs text-gray-400">
          {completedCount}/{totalLessons} lessons
        </span>
      </div>
    </div>
  );
}
