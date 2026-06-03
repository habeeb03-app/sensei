"use client";

import { useState, useCallback, useRef } from "react";

interface AudioPlayerProps {
  text: string;
}

export default function AudioPlayer({ text }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const togglePlay = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    utteranceRef.current = utterance;

    window.speechSynthesis.speak(utterance);
    setPlaying(true);
  }, [text, playing]);

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-700">
      <button
        onClick={togglePlay}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          playing
            ? "bg-primary-500 text-white animate-pulse"
            : "bg-primary-500 text-white hover:bg-primary-600"
        }`}
      >
        {playing ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {playing ? "Playing..." : "Listen to the passage"}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Click to {playing ? "stop" : "play"}
        </p>
      </div>
    </div>
  );
}
