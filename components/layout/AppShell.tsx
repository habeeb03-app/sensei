"use client";

import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import ThemeToggle from "./ThemeToggle";
import { SessionProvider } from "next-auth/react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar />
        <div className="lg:pl-64 pb-16 lg:pb-0">
          <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-700 lg:hidden">
            <span className="text-lg font-bold text-slate-900 dark:text-white">🎯 Sensei</span>
            <ThemeToggle />
          </header>
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </div>
        <BottomNav />
      </div>
    </SessionProvider>
  );
}
