"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors duration-200",
            "border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
            "dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 dark:placeholder-slate-500 dark:focus:border-primary-400",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
