"use client";

import { motion } from "framer-motion";
import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex w-20 items-center rounded-full border border-white/30 bg-white/70 p-1 shadow-soft backdrop-blur-xl transition dark:border-white/10 dark:bg-white/5"
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="flex w-full items-center justify-between"
      >
        <motion.span
          animate={{ opacity: isDark ? 0.5 : 1 }}
          className="flex h-8 w-8 items-center justify-center rounded-full text-amber-500"
        >
          <SunMedium className="h-4 w-4" />
        </motion.span>
        <motion.span
          layout
          className="absolute h-8 w-8 rounded-full bg-brand-600 shadow-glow dark:bg-brand-500"
          animate={{ x: isDark ? 40 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
        <motion.span
          animate={{ opacity: isDark ? 1 : 0.5 }}
          className="flex h-8 w-8 items-center justify-center text-slate-100"
        >
          <Moon className="h-4 w-4" />
        </motion.span>
      </motion.div>
    </button>
  );
}
