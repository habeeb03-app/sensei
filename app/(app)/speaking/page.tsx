"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import MicRecorder from "@/components/speaking/MicRecorder";
import ScoreDisplay from "@/components/speaking/ScoreDisplay";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import toast from "react-hot-toast";

export default function SpeakingPage() {
  const { data: session, status } = useSession();
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    feedback: string;
    improved: string;
  } | null>(null);
  const [history, setHistory] = useState<{ transcript: string; score: number }[]>([]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (status === "unauthenticated") redirect("/login");

  const handleTranscript = async (text: string) => {
    setTranscript(text);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text }),
      });

      if (!res.ok) throw new Error("Evaluation failed");

      const data = await res.json();
      setResult(data);
      setHistory((prev) => [{ transcript: text, score: data.score }, ...prev]);
      toast.success("Speaking evaluated!");
    } catch {
      toast.error("Failed to evaluate speech. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">🎤 Speaking Practice</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Speak into your microphone and get AI feedback</p>
      </div>

      <Card className="flex flex-col items-center py-12">
        <MicRecorder onTranscript={handleTranscript} />
        {loading && (
          <div className="mt-8 text-center animate-fade-in">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Analyzing your speech...</p>
          </div>
        )}
      </Card>

      {transcript && !loading && (
        <Card>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Your Speech</h3>
          <p className="text-slate-900 dark:text-slate-100 italic">{`\u201C${transcript}\u201D`}</p>
        </Card>
      )}

      {result && <ScoreDisplay score={result.score} feedback={result.feedback} improved={result.improved} />}

      {history.length > 1 && (
        <Card>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Past Attempts</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.slice(1).map((h, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <p className="text-sm text-slate-700 dark:text-slate-300 truncate flex-1 mr-4">
                  {`\u201C${h.transcript.slice(0, 60)}${h.transcript.length > 60 ? '...' : ''}\u201D`}
                </p>
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400 flex-shrink-0">
                  {h.score}/100
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
