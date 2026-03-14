"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--color-teal-700)] dark:text-slate-400">
        <span className="material-symbols-outlined">dark_mode</span>
      </div>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--color-teal-700)] dark:text-slate-400 hover:text-[var(--color-primary)] transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg"
      title="Toggle Theme"
    >
      <span className="material-symbols-outlined">
        {theme === "dark" ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
