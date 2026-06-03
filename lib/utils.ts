export const LEVEL_THRESHOLDS = [
  { level: "beginner" as const, minXp: 0, maxXp: 500 },
  { level: "intermediate" as const, minXp: 500, maxXp: 1500 },
  { level: "advanced" as const, minXp: 1500, maxXp: 3500 },
  { level: "fluent" as const, minXp: 3500, maxXp: Infinity },
];

export function getLevel(xp: number) {
  for (const l of LEVEL_THRESHOLDS) {
    if (xp >= l.minXp && xp < l.maxXp) return l.level;
  }
  return "fluent" as const;
}

export function getLevelProgress(xp: number) {
  const level = getLevel(xp);
  const idx = LEVEL_THRESHOLDS.findIndex((l) => l.level === level);
  const current = LEVEL_THRESHOLDS[idx];
  const range = current.maxXp - current.minXp;
  const progress = ((xp - current.minXp) / range) * 100;
  return Math.min(progress, 100);
}

export function getNextLevelXp(xp: number) {
  const level = getLevel(xp);
  const idx = LEVEL_THRESHOLDS.findIndex((l) => l.level === level);
  if (idx >= LEVEL_THRESHOLDS.length - 1) return null;
  return LEVEL_THRESHOLDS[idx + 1].minXp;
}

export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function getStreakEmoji(streak: number) {
  if (streak >= 30) return "🔥🔥🔥";
  if (streak >= 7) return "🔥🔥";
  if (streak >= 1) return "🔥";
  return "💤";
}

export const SCENARIOS = [
  { id: "restaurant", label: "🍽️ Restaurant", description: "Order food and talk to waitstaff" },
  { id: "travel", label: "✈️ Travel", description: "Navigate airports, hotels, and directions" },
  { id: "interview", label: "💼 Interview", description: "Practice job interviews" },
  { id: "college", label: "🎓 College", description: "Campus conversations and academics" },
] as const;
