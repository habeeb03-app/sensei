"use client";

import Card from "@/components/ui/card";

const BADGE_ICONS: Record<string, string> = {
  "first_chat": "💬",
  "streak_7": "🔥",
  "streak_30": "⚡",
  "vocab_master": "📚",
  "speaking_star": "⭐",
  "writer": "✍️",
  "perfect_score": "💯",
  "early_bird": "🌅",
};

interface BadgeDisplayProps {
  badges: string[];
}

export default function BadgeDisplay({ badges }: BadgeDisplayProps) {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        Complete activities to earn badges!
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {badges.map((badge) => (
        <div
          key={badge}
          className="flex flex-col items-center gap-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-700"
          title={badge.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        >
          <span className="text-2xl">{BADGE_ICONS[badge] || "🏆"}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
            {badge.replace(/_/g, " ")}
          </span>
        </div>
      ))}
    </div>
  );
}
