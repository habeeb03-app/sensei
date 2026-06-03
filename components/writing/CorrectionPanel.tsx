"use client";

interface CorrectionPanelProps {
  original: string;
  corrected: string;
  explanation: string;
  improved: string;
}

export default function CorrectionPanel({ original, corrected, explanation, improved }: CorrectionPanelProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-700">
        <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Original</h4>
        <p className="text-slate-900 dark:text-slate-100 line-through opacity-60">{original}</p>
      </div>

      <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
        <h4 className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-2">✅ Corrected</h4>
        <p className="text-slate-900 dark:text-slate-100">{corrected}</p>
      </div>

      <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
        <h4 className="text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-2">📝 Explanation</h4>
        <p className="text-slate-900 dark:text-slate-100">{explanation}</p>
      </div>

      <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
        <h4 className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-2">✨ Improved Version</h4>
        <p className="text-slate-900 dark:text-slate-100">{improved}</p>
      </div>
    </div>
  );
}
