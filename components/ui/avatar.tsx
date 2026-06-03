"use client";

import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const colors = [
  "bg-primary-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-teal-500",
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function Avatar({ name, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full text-white font-medium",
        getColor(name),
        size === "sm" && "h-8 w-8 text-xs",
        size === "md" && "h-10 w-10 text-sm",
        size === "lg" && "h-14 w-14 text-lg",
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
