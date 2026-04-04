interface ProgressBarProps {
  percentage: number;
  color?: string;
  height?: number;
}

export default function ProgressBar({
  percentage,
  color = '#0071e3',
  height = 6,
}: ProgressBarProps) {
  return (
    <div
      className="w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
      style={{ height }}
    >
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      />
    </div>
  );
}
