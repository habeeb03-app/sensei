"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import MobileDrawer from "./MobileDrawer";
import ThemeToggle from "./ThemeToggle";
import { SessionProvider } from "next-auth/react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <SessionProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar />
        <div className="lg:pl-64">
          <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-700 lg:hidden">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Open navigation menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span className="text-lg font-bold text-slate-900 dark:text-white">🎯 Sensei</span>
            </div>
            <ThemeToggle />
          </header>
          <main className="min-h-screen">{children}</main>
        </div>
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    </SessionProvider>
  );
}
