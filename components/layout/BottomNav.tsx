"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: "📊" },
  { href: "/partner", label: "Chat", icon: "💬" },
  { href: "/speaking", label: "Speak", icon: "🎤" },
  { href: "/writing", label: "Write", icon: "✍️" },
  { href: "/progress", label: "Stats", icon: "📈" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 z-40">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                isActive
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-slate-500 dark:text-slate-500"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
