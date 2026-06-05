"use client";

import Link from "next/link";
import Card from "@/components/ui/card";

const quickLinks = [
  { href: "/partner", label: "💬 Partner Chat", desc: "Practice conversation with AI" },
  { href: "/speaking", label: "🎤 Speaking", desc: "Improve your pronunciation" },
  { href: "/listening", label: "🎧 Listening", desc: "Comprehension practice" },
  { href: "/writing", label: "✍️ Writing", desc: "Get grammar corrections" },
];

export default function QuickStartCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {quickLinks.map((link) => (
        <Link key={link.href} href={link.href}>
          <Card hover className="cursor-pointer h-full">
            <div className="text-2xl mb-2">{link.label.split(" ")[0]}</div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{link.label}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{link.desc}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
