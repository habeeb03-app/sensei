"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Badge from "@/components/ui/badge";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuestionCardProps {
  question: Question;
  index: number;
  onAnswer: (correct: boolean) => void;
}

export default function QuestionCard({ question, index, onAnswer }: QuestionCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const isCorrect = selected === question.correctIndex;

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    onAnswer(optionIndex === question.correctIndex);
  };

  return (
    <div className="animate-fade-in">
      <Badge variant="info" className="mb-3">Question {index + 1}</Badge>
      <h4 className="text-base font-medium text-slate-900 dark:text-white mb-3">
        {question.question}
      </h4>

      <div className="space-y-2 mb-3">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={selected !== null}
            className={cn(
              "w-full text-left p-3 rounded-lg border text-sm transition-all",
              selected === null
                ? "border-slate-200 dark:border-slate-600 hover:border-primary-300"
                : selected === i
                  ? isCorrect
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : i === question.correctIndex && selected !== null
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-slate-200 dark:border-slate-600 opacity-50",
              selected !== null && "cursor-default"
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {selected !== null && (
        <div className={cn(
          "p-3 rounded-lg text-sm",
          isCorrect
            ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
            : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
        )}>
          <p className="font-medium mb-1">{isCorrect ? "✅ Correct!" : "❌ Incorrect"}</p>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
