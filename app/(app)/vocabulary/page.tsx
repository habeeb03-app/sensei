"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import WordCard from "@/components/vocabulary/WordCard";
import Quiz from "@/components/vocabulary/Quiz";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import toast from "react-hot-toast";

interface Word {
  word: string;
  meaning: string;
  example: string;
  level: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export default function VocabularyPage() {
  const { data: session, status } = useSession();
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      loadWords();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (status === "unauthenticated") redirect("/login");

  const loadWords = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vocabulary");
      if (!res.ok) throw new Error("Failed to load words");
      const data = await res.json();
      const wordList = data.words || data.vocabulary || data.data || [];
      setWords(Array.isArray(wordList) ? wordList : []);
    } catch {
      toast.error("Failed to load vocabulary. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    if (words.length === 0) return;
    const questions: QuizQuestion[] = words.slice(0, 5).map((word) => {
      const wrongOptions = words
        .filter((w) => w.word !== word.word)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((w) => w.meaning);

      const options = [word.meaning, ...wrongOptions].sort(() => Math.random() - 0.5);
      const correctIndex = options.indexOf(word.meaning);

      return {
        question: `What does "${word.word}" mean?`,
        options,
        correctIndex,
      };
    });
    setQuizQuestions(questions);
    setShowQuiz(true);
  };

  const handleQuizComplete = async (score: number) => {
    try {
      await fetch("/api/vocabulary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizScore: score }),
      });
      setCompleted(true);
      toast.success(`Quiz complete! +25 XP`);
    } catch {
      toast.error("Failed to save progress");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">📚 Vocabulary Builder</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Learn new words tailored to your level</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={loadWords}>Refresh</Button>
          {words.length > 0 && !showQuiz && (
            <Button onClick={startQuiz}>Start Quiz</Button>
          )}
        </div>
      </div>

      {showQuiz && quizQuestions.length > 0 ? (
        <Card>
          <Quiz questions={quizQuestions} onComplete={handleQuizComplete} />
        </Card>
      ) : completed ? (
        <Card className="text-center py-8">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Well Done!</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">You earned XP for completing the quiz.</p>
          <Button
            onClick={() => {
              setShowQuiz(false);
              setCompleted(false);
              loadWords();
            }}
          >
            Learn More Words
          </Button>
        </Card>
      ) : words.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400 mb-4">No words loaded yet.</p>
          <Button onClick={loadWords}>Generate Vocabulary</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {words.map((word, i) => (
            <WordCard key={i} word={word.word} meaning={word.meaning} example={word.example} />
          ))}
        </div>
      )}
    </div>
  );
}
