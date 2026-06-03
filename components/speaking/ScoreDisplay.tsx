"use client";

interface ScoreDisplayProps {
  score: number;
  feedback: string;
  improved: string;
}

export default function ScoreDisplay({ score, feedback, improved }: ScoreDisplayProps) {
  const getColor = (s: number) => {
    if (s >= 80) return "text-primary-500";
    if (s >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getRingColor = (s: number) => {
    if (s >= 80) return "stroke-primary-500";
    if (s >= 60) return "stroke-yellow-500";
    return "stroke-red-500";
  };

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <svg width="140" height="140" className="transform -rotate-90">
            <circle cx="70" cy="70" r={radius} fill="none" stroke="currentColor" strokeWidth="10"
              className="text-slate-200 dark:text-slate-700" />
            <circle cx="70" cy="70" r={radius} fill="none" strokeWidth="10"
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round"
              className={`${getRingColor(score)} transition-all duration-1000`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-4xl font-bold ${getColor(score)}`}>{score}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-700">
          <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Feedback</h4>
          <p className="text-slate-900 dark:text-slate-100">{feedback}</p>
        </div>
        <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
          <h4 className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-1">Improved Version</h4>
          <p className="text-slate-900 dark:text-slate-100">{improved}</p>
        </div>
      </div>
    </div>
  );
}
