import { useTheme } from "next-themes";
import { useCallback } from "react";

export const useToggleTheme = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const toggleTheme = useCallback(() => {
    setTheme((theme) => (theme === "dark" ? "light" : "dark"));
  }, [setTheme]);

  return { currentTheme: resolvedTheme, nextTheme: resolvedTheme === "dark" ? "light" : "dark", toggleTheme };
}