"use client";

import { useState, useRef, useCallback } from "react";

interface MicRecorderProps {
  onTranscript: (text: string) => void;
}

export default function MicRecorder({ onTranscript }: MicRecorderProps) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const toggleListening = useCallback(() => {
    if (listening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setListening(false);
      return;
    }

    if (typeof window === "undefined" || !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported. Please use Chrome.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }
    };

    recognition.onend = () => {
      if (finalTranscript.trim()) {
        onTranscript(finalTranscript.trim());
      }
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [listening, onTranscript]);

  return (
    <button
      onClick={toggleListening}
      className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
        listening
          ? "bg-red-500 scale-110 shadow-xl shadow-red-500/40"
          : "bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/30"
      }`}
    >
      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
      {listening && (
        <>
          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25" />
          <span className="absolute -bottom-8 text-xs font-medium text-red-500 animate-pulse">
            Recording...
          </span>
        </>
      )}
    </button>
  );
}
