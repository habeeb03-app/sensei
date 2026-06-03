"use client";

interface DailyGoalRingProps {
  current: number;
  goal: number;
}

export default function DailyGoalRing({ current, goal }: DailyGoalRingProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100" className="transform -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="8"
          className="text-slate-200 dark:text-slate-700" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary-500 transition-all duration-700"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900 dark:text-white">{current}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">/ {goal}</span>
      </div>
      <span className="text-sm text-slate-500 dark:text-slate-400 mt-2">Daily Goal</span>
    </div>
  );
}
