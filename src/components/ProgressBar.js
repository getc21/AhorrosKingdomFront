'use client';

export default function ProgressBar({ current, goal }) {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-text-secondary">Progreso</span>
        <span className="text-sm font-bold text-primary">{percentage.toFixed(1)}%</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-text-secondary">
        <span>Bs. {current.toFixed(2)}</span>
        <span>Meta: Bs. {goal.toFixed(2)}</span>
      </div>
    </div>
  );
}
