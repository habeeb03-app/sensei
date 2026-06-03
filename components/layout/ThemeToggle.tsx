"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/button";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggle} className="w-9 h-9 p-0">
      {dark ? "☀️" : "🌙"}
    </Button>
  );
}
