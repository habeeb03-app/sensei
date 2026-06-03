"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export default function Quiz({ questions, onComplete }: QuizProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const question = questions[current];
  const isCorrect = selected === question.correctIndex;

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);

    const correct = index === question.correctIndex;
    if (correct) setCorrectCount((c) => c + 1);
    setAnswers((a) => [...a, correct]);

    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        setShowResult(true);
        const finalScore = correctCount + (correct ? 1 : 0);
        onComplete(finalScore);
      }
    }, 1500);
  };

  if (showResult) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="text-center animate-fade-in">
        <div className="text-5xl mb-4">{percentage >= 80 ? "🎉" : percentage >= 50 ? "👍" : "💪"}</div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Quiz Complete!
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          You got {correctCount} out of {questions.length} correct ({percentage}%)
        </p>
        <div className="flex gap-2 justify-center">
          {answers.map((a, i) => (
            <Badge key={i} variant={a ? "success" : "danger"}>{i + 1}</Badge>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <Badge>Question {current + 1} of {questions.length}</Badge>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {Math.round(((current) / questions.length) * 100)}%
        </span>
      </div>

      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mb-6">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-300"
          style={{ width: `${((current) / questions.length) * 100}%` }}
        />
      </div>

      <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
        {question.question}
      </h3>

      <div className="space-y-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={selected !== null}
            className={cn(
              "w-full text-left p-3 rounded-lg border text-sm transition-all duration-200",
              selected === null
                ? "border-slate-200 dark:border-slate-600 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                : selected === index
                  ? isCorrect
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                    : "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                  : index === question.correctIndex && selected !== null
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-slate-200 dark:border-slate-600 opacity-50",
              selected !== null && "cursor-default"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
