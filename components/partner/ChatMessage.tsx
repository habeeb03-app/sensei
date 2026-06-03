"use client";

import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex mb-4 animate-fade-in", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 mr-2 mt-1">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
            S
          </div>
        </div>
      )}
      <div className={cn("max-w-[75%]", isUser && "order-1")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "bg-primary-500 text-white rounded-br-md"
              : "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-bl-md"
          )}
        >
          {message.content}
        </div>
        {message.corrections && (
          <div className="mt-1 px-3 py-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-xs text-yellow-800 dark:text-yellow-200">
            💡 {message.corrections}
          </div>
        )}
      </div>
    </div>
  );
}
