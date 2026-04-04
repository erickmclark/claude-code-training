interface LessonHeroProps {
  icon: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  lessonNumber: number;
  totalLessons: number;
}

export default function LessonHero({
  icon,
  title,
  description,
  difficulty,
  duration,
  lessonNumber,
  totalLessons,
}: LessonHeroProps) {
  const difficultyColor =
    difficulty === 'Beginner'
      ? 'bg-green-500/20 text-green-300 border-green-500/30'
      : difficulty === 'Intermediate'
      ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      : difficulty === 'Advanced'
      ? 'bg-red-500/20 text-red-300 border-red-500/30'
      : 'bg-purple-500/20 text-purple-300 border-purple-500/30';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-slate-700 p-8 mb-8">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-slate-400">
            Lesson {lessonNumber} of {totalLessons}
          </span>
          <span className={`text-xs px-3 py-1 rounded-full border ${difficultyColor}`}>
            {difficulty}
          </span>
          <span className="text-xs px-3 py-1 rounded-full border border-slate-600 bg-slate-700/50 text-slate-300">
            {duration}
          </span>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <span className="text-6xl">{icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            <p className="text-lg text-slate-300 mt-1">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
