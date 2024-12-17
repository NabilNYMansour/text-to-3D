"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToggleTheme } from "@/lib/hooks";

export function ThemeToggle({ className, variant="outline" }: {
  className?: string,
  variant?: "outline" | "default" | "destructive" | "secondary" | "ghost" | "link"
}) {
  const { toggleTheme } = useToggleTheme();

  return (
    <Button variant={variant} size="icon" className={className} onClick={toggleTheme} title="Toggle theme">
      <Sun className="h-[1.2rem] w-[1.2rem] hidden dark:flex" />
      <Moon className="h-[1.2rem] w-[1.2rem] flex dark:hidden" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
