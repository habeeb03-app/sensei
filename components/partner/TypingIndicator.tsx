export default function TypingIndicator() {
  return (
    <div className="flex items-start mb-4 animate-fade-in">
      <div className="flex-shrink-0 mr-2 mt-1">
        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
          S
        </div>
      </div>
      <div className="bg-slate-200 dark:bg-slate-700 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
