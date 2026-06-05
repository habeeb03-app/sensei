"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import CorrectionPanel from "@/components/writing/CorrectionPanel";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import toast from "react-hot-toast";

const ALL_PROMPTS = [
  "Describe your favorite place in the world and explain why it's special to you.",
  "What is the most important lesson life has taught you?",
  "If you could travel anywhere tomorrow, where would you go and what would you do?",
  "Describe a person who has influenced your life significantly.",
  "What are your thoughts on the role of technology in education?",
  "Write about a memorable meal you've had.",
  "What does success mean to you?",
  "Describe a time you helped someone and how it made you feel.",
  "What is your favorite way to spend a weekend?",
  "If you could learn any skill instantly, what would it be and why?",
  "Describe a challenge you overcame and what you learned from it.",
  "What is the best advice you've ever received?",
  "Write about a tradition that is important to your family.",
  "What does your ideal day look like?",
  "Describe a book or movie that changed your perspective.",
];

export default function WritingPage() {
  const { data: session, status } = useSession();
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState(() => ALL_PROMPTS[Math.floor(Math.random() * ALL_PROMPTS.length)]);
  const [loading, setLoading] = useState(false);
  const [correction, setCorrection] = useState<{
    corrected: string;
    explanation: string;
    improved: string;
  } | null>(null);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (status === "unauthenticated") redirect("/login");

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setCorrection(null);

    try {
      const res = await fetch("/api/writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Correction failed");

      const data = await res.json();
      setCorrection(data);
      toast.success("Writing corrected!");
    } catch {
      toast.error("Failed to get correction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">✍️ Writing Practice</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Write and get instant grammar corrections</p>
      </div>

      <Card>
        <h3 className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-2">Today&apos;s Prompt</h3>
        <p className="text-slate-900 dark:text-white">{prompt}</p>
      </Card>

      <div className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your response here..."
          rows={6}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">{text.length} characters</span>
          <Button onClick={handleSubmit} disabled={!text.trim() || loading}>
            {loading ? "Correcting..." : "Check Grammar"}
          </Button>
        </div>
      </div>

      {correction && (
        <CorrectionPanel
          original={text}
          corrected={correction.corrected}
          explanation={correction.explanation}
          improved={correction.improved}
        />
      )}
    </div>
  );
}
