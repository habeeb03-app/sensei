"use client";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";

interface WeeklySummaryProps {
  totalXp: number;
  activities: number;
  speakingAvg: number;
  wordsLearned: number;
}

export default function WeeklySummary({ totalXp, activities, speakingAvg, wordsLearned }: WeeklySummaryProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Card className="text-center">
        <div className="text-2xl font-bold text-primary-500">{totalXp}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">XP Earned</div>
      </Card>
      <Card className="text-center">
        <div className="text-2xl font-bold text-blue-500">{activities}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">Activities</div>
      </Card>
      <Card className="text-center">
        <div className="text-2xl font-bold text-purple-500">{speakingAvg}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">Avg Speaking</div>
      </Card>
      <Card className="text-center">
        <div className="text-2xl font-bold text-yellow-500">{wordsLearned}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">Words</div>
      </Card>
    </div>
  );
}
