"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/partner", label: "Partner", icon: "💬" },
  { href: "/speaking", label: "Speaking", icon: "🎤" },
  { href: "/writing", label: "Writing", icon: "✍️" },
  { href: "/vocabulary", label: "Vocabulary", icon: "📚" },
  { href: "/listening", label: "Listening", icon: "🎧" },
  { href: "/progress", label: "Progress", icon: "📈" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 h-screen fixed left-0 top-0">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">Sensei</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                )}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 w-full transition-colors"
          >
            <span>🚪</span>
            Sign Out
          </button>
        </div>
      </aside>

      <Modal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Confirm Sign Out">
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Are you sure you want to log out?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? "Signing out..." : "Log Out"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
