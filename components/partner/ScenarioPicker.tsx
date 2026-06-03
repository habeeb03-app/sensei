"use client";

import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { SCENARIOS } from "@/lib/utils";
import type { Scenario } from "@/types";

interface ScenarioPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (scenario: Scenario) => void;
}

export default function ScenarioPicker({ open, onClose, onSelect }: ScenarioPickerProps) {
  return (
    <Modal open={open} onClose={onClose} title="Choose a Scenario">
      <div className="space-y-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              onSelect(s.id as Scenario);
              onClose();
            }}
            className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200"
          >
            <div className="text-lg font-medium text-slate-900 dark:text-white">{s.label}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.description}</div>
          </button>
        ))}
        <div className="pt-2">
          <Button variant="ghost" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
