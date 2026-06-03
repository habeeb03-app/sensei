"use client";

import { cn } from "@/lib/utils";
import type { Mode } from "@/types";

interface ModeSelectorProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

const modes: { value: Mode; label: string }[] = [
  { value: "free", label: "💬 Free Chat" },
  { value: "scenario", label: "🎭 Scenario" },
  { value: "interview", label: "💼 Interview" },
];

export default function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => onModeChange(m.value)}
          className={cn(
            "flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            mode === m.value
              ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
