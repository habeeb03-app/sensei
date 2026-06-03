"use client";

import { useState } from "react";

interface WordCardProps {
  word: string;
  meaning: string;
  example: string;
}

export default function WordCard({ word, meaning, example }: WordCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="relative h-48 cursor-pointer"
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute inset-0 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          style={{ backfaceVisibility: "hidden" }}
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{word}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Tap to reveal</p>
        </div>
        <div
          className="absolute inset-0 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 p-6 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-base font-medium text-slate-900 dark:text-white mb-3 text-center">{meaning}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center italic">{`\u201C${example}\u201D`}</p>
        </div>
      </div>
    </div>
  );
}
