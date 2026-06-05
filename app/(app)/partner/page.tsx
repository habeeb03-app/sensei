"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import ChatMessage from "@/components/partner/ChatMessage";
import ModeSelector from "@/components/partner/ModeSelector";
import ScenarioPicker from "@/components/partner/ScenarioPicker";
import TypingIndicator from "@/components/partner/TypingIndicator";
import VoiceInput from "@/components/partner/VoiceInput";
import TextToSpeech from "@/components/partner/TextToSpeech";
import Button from "@/components/ui/button";
import type { ChatMessage as ChatMessageType, Mode, Scenario } from "@/types";
import toast from "react-hot-toast";

export default function PartnerPage() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      role: "assistant",
      content: "Hi! I'm Sensei, your English conversation partner. What would you like to talk about today? 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("free");
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [showScenarioPicker, setShowScenarioPicker] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (mode === "scenario" && !scenario) {
      setShowScenarioPicker(true);
    }
  }, [mode, scenario]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (status === "unauthenticated") redirect("/login");

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || streaming) return;

    setInput("");
    const userMessage: ChatMessageType = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setStreaming(true);

    try {
      const controller = new AbortController();
      setAbortController(controller);

      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          mode,
          scenario,
          conversationId,
        }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("Failed to get response");

      const newConversationId = res.headers.get("X-Conversation-Id");
      if (newConversationId) setConversationId(newConversationId);

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      let aiContent = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiContent += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === "assistant") {
            updated[updated.length - 1] = { ...last, content: aiContent };
          }
          return updated;
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        toast.error("Failed to get response. Please try again.");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I couldn't process that. Please check your connection and try again.",
          },
        ]);
      }
    } finally {
      setStreaming(false);
      setAbortController(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setInput(text);
    setTimeout(() => handleSend(text), 100);
  };

  const handleScenarioSelect = (s: Scenario) => {
    setScenario(s);
    setMessages([
      {
        role: "assistant",
        content: `Great! Let's practice a ${s} scenario. I'll be your conversation partner. Let's start! 🎭`,
      },
    ]);
    setConversationId(null);
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setConversationId(null);
    if (newMode === "scenario") {
      setShowScenarioPicker(true);
    } else {
      setScenario(null);
      setMessages([
        {
          role: "assistant",
          content: `Switched to ${newMode === "interview" ? "interview practice" : "free chat"} mode. Let's continue! 💬`,
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen">
      <div className="flex-shrink-0 p-4 pb-2 space-y-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">💬 Partner Mode</h1>
        </div>
        <ModeSelector mode={mode} onModeChange={handleModeChange} />
        {mode === "scenario" && scenario && (
          <button
            onClick={() => setShowScenarioPicker(true)}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Scenario: {scenario} (change)
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.map((msg, i) => (
          <div key={i} className="group">
            <ChatMessage message={msg} />
            {msg.role === "assistant" && msg.content && i === messages.length - 1 && !streaming && (
              <div className="flex justify-start ml-10 -mt-2 mb-2">
                <TextToSpeech text={msg.content} />
              </div>
            )}
          </div>
        ))}
        {streaming && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <VoiceInput onTranscript={handleVoiceTranscript} disabled={streaming} />
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              style={{ minHeight: "42px", maxHeight: "120px" }}
            />
          </div>
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || streaming}
            size="md"
            className="rounded-xl px-4"
          >
            Send
          </Button>
        </div>
      </div>

      <ScenarioPicker
        open={showScenarioPicker}
        onClose={() => {
          setShowScenarioPicker(false);
          if (!scenario) setMode("free");
        }}
        onSelect={handleScenarioSelect}
      />
    </div>
  );
}
