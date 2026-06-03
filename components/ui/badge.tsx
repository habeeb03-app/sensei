"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
        variant === "success" && "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
        variant === "warning" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        variant === "danger" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        variant === "info" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        className
      )}
    >
      {children}
    </span>
  );
}
