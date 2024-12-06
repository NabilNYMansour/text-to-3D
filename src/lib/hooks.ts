import { useSidebar } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

export const useToggleTheme = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const toggleTheme = useCallback(() => {
    setTheme((theme) => (theme === "dark" ? "light" : "dark"));
  }, [setTheme]);

  return { currentTheme: resolvedTheme, nextTheme: resolvedTheme === "dark" ? "light" : "dark", toggleTheme };
}

export const useOpenSidebar = () => {
  const sidebar = useSidebar();
  useEffect(() => {
    sidebar.setOpen(true);
  }, []);
}

export const useCloseSidebar = () => {
  const sidebar = useSidebar();
  useEffect(() => {
    sidebar.setOpen(false);
  }, []);
}