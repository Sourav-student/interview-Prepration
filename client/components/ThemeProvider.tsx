"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";

type Theme = "dark" | "light";
type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
let fallbackTheme: Theme = "dark";

function subscribeToThemeChanges(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("skillspring-theme-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("skillspring-theme-change", onChange);
  };
}

function getThemeSnapshot(): Theme {
  try {
    return window.localStorage.getItem("skillspring-theme") === "light" ? "light" : "dark";
  } catch {
    return fallbackTheme;
  }
}

function getServerThemeSnapshot(): Theme {
  return "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeToThemeChanges, getThemeSnapshot, getServerThemeSnapshot);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    fallbackTheme = nextTheme;
    try {
      window.localStorage.setItem("skillspring-theme", nextTheme);
    } catch (error) {
      console.error("Could not save the theme preference:", error);
    }
    window.dispatchEvent(new Event("skillspring-theme-change"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
