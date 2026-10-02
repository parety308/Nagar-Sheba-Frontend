"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/theme.provider";

export function ThemeToggle() {
  const { toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="flex size-9 items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <Sun className="hidden size-5 dark:block" />
      <Moon className="size-5 dark:hidden" />
    </button>
  );
}
