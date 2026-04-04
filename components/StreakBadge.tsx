interface StreakBadgeProps {
  streak: number;
}

export default function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak <= 0) return null;

  return (
    <div className="flex items-center gap-1 text-orange-500">
      <span className="text-sm">🔥</span>
      <span className="text-xs font-bold">{streak}</span>
    </div>
  );
}
