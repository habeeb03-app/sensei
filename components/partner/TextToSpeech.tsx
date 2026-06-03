"use client";

import { useState, useCallback } from "react";

interface TextToSpeechProps {
  text: string;
}

export default function TextToSpeech({ text }: TextToSpeechProps) {
  const [playing, setPlaying] = useState(false);

  const speak = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);

    window.speechSynthesis.speak(utterance);
    setPlaying(true);
  }, [text, playing]);

  return (
    <button
      onClick={speak}
      className="p-1.5 rounded-full text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
      title={playing ? "Stop" : "Read aloud"}
    >
      {playing ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 00-1 1v2a1 1 0 001 1h1a1 1 0 001-1v-2a1 1 0 00-1-1H9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10a1 1 0 00-1 1v2a1 1 0 001 1h1a1 1 0 001-1v-2a1 1 0 00-1-1h-1z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      )}
    </button>
  );
}
