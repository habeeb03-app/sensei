"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import LineChart from "@/components/progress/LineChart";
import BarChart from "@/components/progress/BarChart";
import BadgeDisplay from "@/components/progress/BadgeDisplay";
import WeeklySummary from "@/components/progress/WeeklySummary";

interface ProgressData {
  user: {
    name: string;
    level: string;
    levelProgress: number;
    xp: number;
    streak: number;
    badges: string[];
  };
  progress: {
    date: string;
    speakingScore: number;
    writingScore: number;
    vocabularyLearned: number;
    xpEarned: number;
    activitiesCompleted: string[];
  }[];
}

export default function ProgressPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/progress")
        .then((r) => r.json())
        .then((d) => setData(d))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (status === "unauthenticated") redirect("/login");

  const progress = data?.progress || [];
  const user = data?.user;

  const speakingData = progress
    .filter((p) => p.speakingScore > 0)
    .map((p) => ({ date: p.date.slice(5), score: p.speakingScore }));

  const weeklyTotal = progress.slice(-7).reduce((sum, p) => sum + p.xpEarned, 0);
  const weeklyActivities = progress.slice(-7).reduce((sum, p) => sum + p.activitiesCompleted.length, 0);
  const avgSpeaking = progress.filter((p) => p.speakingScore > 0).length > 0
    ? Math.round(
        progress
          .filter((p) => p.speakingScore > 0)
          .reduce((sum, p) => sum + p.speakingScore, 0) /
          progress.filter((p) => p.speakingScore > 0).length
      )
    : 0;
  const totalWords = progress.reduce((sum, p) => sum + p.vocabularyLearned, 0);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">📈 Your Progress</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track your learning journey</p>
      </div>

      {user && (
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="success" className="text-sm capitalize">{user.level}</Badge>
          <Badge variant="info">{user.xp} XP</Badge>
          <Badge variant="warning">{user.streak} day streak</Badge>
        </div>
      )}

      <WeeklySummary
        totalXp={weeklyTotal}
        activities={weeklyActivities}
        speakingAvg={avgSpeaking}
        wordsLearned={totalWords}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <LineChart data={speakingData} title="Speaking Scores Over Time" />
        </Card>
        <Card>
          <BarChart
            data={progress.map((p) => ({
              date: p.date.slice(5),
              minutes: Math.round(p.xpEarned / 5),
            }))}
            title="Daily Practice (estimated minutes)"
          />
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">🏆 Badges</h2>
        <BadgeDisplay badges={user?.badges || []} />
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Activity Log</h2>
        {progress.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-4">
            No activity yet. Start practicing to see your history!
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...progress].reverse().map((p, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{p.date}</span>
                  <div className="flex gap-1 mt-1">
                    {p.activitiesCompleted.map((a, j) => (
                      <Badge key={j} variant="default" className="text-[10px]">{a}</Badge>
                    ))}
                  </div>
                </div>
                <span className="text-sm font-medium text-primary-500">+{p.xpEarned} XP</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
