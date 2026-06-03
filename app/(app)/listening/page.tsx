"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AudioPlayer from "@/components/listening/AudioPlayer";
import QuestionCard from "@/components/listening/QuestionCard";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import toast from "react-hot-toast";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function ListeningPage() {
  const { data: session, status } = useSession();
  const [passage, setPassage] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      loadContent();
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

  const loadContent = async () => {
    setLoading(true);
    setShowResults(false);
    setAnswers([]);

    try {
      const res = await fetch("/api/listening");
      if (!res.ok) throw new Error("Failed to load");

      const data = await res.json();
      const qs = data.questions || [];
      setPassage(data.passage || "Practice passage not available.");
      setQuestions(Array.isArray(qs) ? qs : []);
    } catch {
      const fallbackPassage = "Hello! Welcome to Sensei English Learning. Today we are going to practice listening comprehension. Listening is an important skill that helps you understand native speakers better. Try to catch the main ideas and details as you listen. Good luck!";
      const fallbackQuestions: Question[] = [
        {
          question: "What is the main topic of this passage?",
          options: ["Speaking practice", "Listening comprehension", "Writing skills", "Grammar rules"],
          correctIndex: 1,
          explanation: "The passage states 'we are going to practice listening comprehension'.",
        },
        {
          question: "Why is listening important?",
          options: ["It helps with writing", "It helps understand native speakers", "It improves grammar", "It builds vocabulary"],
          correctIndex: 1,
          explanation: "Listening 'helps you understand native speakers better'.",
        },
        {
          question: "What should you try to catch while listening?",
          options: ["Only new words", "Main ideas and details", "The speaker's name", "Every single word"],
          correctIndex: 1,
          explanation: "Try to 'catch the main ideas and details as you listen'.",
        },
      ];
      setPassage(fallbackPassage);
      setQuestions(fallbackQuestions);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (correct: boolean) => {
    setAnswers((prev) => [...prev, correct]);
    if (answers.length + 1 === questions.length) {
      setShowResults(true);
    }
  };

  const allAnswered = answers.length === questions.length && questions.length > 0;
  const score = answers.filter(Boolean).length;
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">🎧 Listening Practice</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Listen and answer comprehension questions</p>
        </div>
        <Button variant="secondary" onClick={loadContent}>New Passage</Button>
      </div>

      <AudioPlayer text={passage} />

      <Card>
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Passage Text</h3>
        <p className="text-slate-900 dark:text-white">{passage}</p>
      </Card>

      <div className="space-y-6">
        {questions.map((q, i) => (
          <Card key={i}>
            <QuestionCard
              question={q}
              index={i}
              onAnswer={handleAnswer}
            />
          </Card>
        ))}
      </div>

      {showResults && allAnswered && (
        <Card className="text-center py-6 animate-fade-in">
          <div className="text-4xl mb-3">{percentage >= 80 ? "🎉" : percentage >= 50 ? "👍" : "💪"}</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Score: {score}/{questions.length} ({percentage}%)
          </h3>
          <div className="flex gap-2 justify-center mb-4">
            {answers.map((a, i) => (
              <Badge key={i} variant={a ? "success" : "danger"}>{i + 1}</Badge>
            ))}
          </div>
          <Button onClick={loadContent}>Try Another Passage</Button>
        </Card>
      )}
    </div>
  );
}
