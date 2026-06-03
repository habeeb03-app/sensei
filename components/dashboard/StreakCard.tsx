"use client";

import Card from "@/components/ui/card";
import { getStreakEmoji } from "@/lib/utils";

interface StreakCardProps {
  streak: number;
}

export default function StreakCard({ streak }: StreakCardProps) {
  return (
    <Card className="text-center">
      <div className="text-4xl mb-2">{getStreakEmoji(streak)}</div>
      <div className="text-3xl font-bold text-slate-900 dark:text-white">{streak}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400">Day Streak</div>
    </Card>
  );
}
