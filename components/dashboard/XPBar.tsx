"use client";

import Card from "@/components/ui/card";
import { getLevel } from "@/lib/utils";

interface XPBarProps {
  xp: number;
  level: string;
  levelProgress: number;
}

export default function XPBar({ xp, level, levelProgress }: XPBarProps) {
  const levelColors: Record<string, string> = {
    beginner: "bg-slate-400",
    intermediate: "bg-primary-500",
    advanced: "bg-purple-500",
    fluent: "bg-yellow-500",
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
          {level}
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400">{xp} XP</span>
      </div>
      <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${levelColors[level] || levelColors.beginner}`}
          style={{ width: `${Math.min(levelProgress, 100)}%` }}
        />
      </div>
    </Card>
  );
}
