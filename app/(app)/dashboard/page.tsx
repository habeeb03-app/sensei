"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import StreakCard from "@/components/dashboard/StreakCard";
import XPBar from "@/components/dashboard/XPBar";
import QuickStartCards from "@/components/dashboard/QuickStartCards";
import DailyGoalRing from "@/components/dashboard/DailyGoalRing";
import Card from "@/components/ui/card";
import { getLevel, getLevelProgress } from "@/lib/utils";

interface DashboardData {
  user: {
    name: string;
    level: string;
    levelProgress: number;
    xp: number;
    streak: number;
  };
  todayActivities: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);

  const fetchData = useCallback(() => {
    if (status !== "authenticated") return;
    fetch("/api/progress")
      .then((res) => res.json())
      .then((json) => {
        const level = getLevel(json.user.xp);
        const today = new Date().toISOString().split("T")[0];
        const todayRecord = (json.progress || []).find((p: { date: string }) => p.date === today);
        setData({
          user: {
            ...json.user,
            level,
            levelProgress: getLevelProgress(json.user.xp),
          },
          todayActivities: todayRecord ? (todayRecord.activitiesCompleted || []).length : 0,
        });
      })
      .catch(() => {});
  }, [status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const onFocus = () => fetchData();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchData]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (status === "unauthenticated") redirect("/login");

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Hello, {session?.user?.name || "Learner"} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Ready to practice English today?</p>
        </div>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StreakCard streak={data.user.streak} />
            <Card className="flex flex-col justify-center">
              <XPBar
                xp={data.user.xp}
                level={data.user.level}
                levelProgress={data.user.levelProgress}
              />
            </Card>
            <Card className="flex items-center justify-center col-span-2 sm:col-span-2">
              <DailyGoalRing current={data?.todayActivities || 0} goal={5} />
            </Card>
          </div>
        </>
      )}

      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Start</h2>
        <QuickStartCards />
      </section>
    </div>
  );
}
