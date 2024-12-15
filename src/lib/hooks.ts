"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { sendToMixpanelClient } from "@/mixpanel/client-side";
import { useUser } from "@clerk/nextjs";
import { useDebouncedState } from "@mantine/hooks";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";

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

export const closeSiderbar = () => {
  const sidebar = useSidebar();
  useEffect(() => {
    sidebar.setOpen(false);
  }, []);
}

export const useTimeoutEffect = (callback: () => void, timeout: number, deps: any[] = []) => {
  const [timer, setTimer] = useState<number | null>(null);
  useEffect(() => {
    setTimer(window.setTimeout(callback, timeout));
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, deps);
}

export function useDynamicDebouncedState<T>(initialValue: T, delay: number = 500) {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebounced] = useDebouncedState(value, delay);

  useEffect(() => {
    setValue(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    if (value !== debouncedValue) {
      setDebounced(value);
    }
  }, [value]);

  return [value, setValue, debouncedValue, setDebounced] as const;
}

export function useMixpanel(eventName: string, data?: Record<string, any>) {
  const hasRan = useRef<boolean>(false);
  const { user } = useUser();

  useEffect(() => {
    if (!hasRan.current) {
      hasRan.current = true;
      sendToMixpanelClient(user?.id, eventName, data);
    }
  },);
}