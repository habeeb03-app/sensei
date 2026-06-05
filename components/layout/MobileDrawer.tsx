"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";

const drawerItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/speaking", label: "Speaking", icon: "🎤" },
  { href: "/listening", label: "Listening", icon: "🎧" },
  { href: "/partner", label: "Partner", icon: "💬" },
  { href: "/writing", label: "Writing", icon: "✍️" },
  { href: "/vocabulary", label: "Vocabulary", icon: "📚" },
  { href: "/progress", label: "Progress", icon: "📈" },
];

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleNav = () => {
    onClose();
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        >
          <div
            ref={drawerRef}
            className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-2xl animate-slide-in-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2" onClick={handleNav}>
                <span className="text-2xl">🎯</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">Sensei</span>
              </Link>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto" style={{ height: "calc(100% - 140px)" }}>
              {drawerItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNav}
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

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 w-full transition-colors"
              >
                <span>🚪</span>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

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
