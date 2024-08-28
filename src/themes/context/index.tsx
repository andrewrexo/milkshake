import type React from "react";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import { type ThemeMode, type ThemeName, themes } from "..";

interface ThemeContextType {
  theme: ThemeName;
  mode: ThemeMode;
  setTheme: (theme: ThemeName) => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeName>("coffee");
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(themes[theme][mode])) {
      root.style.setProperty(`--color-${key}`, value);
    }
  }, [theme, mode]);

  return <ThemeContext.Provider value={{ theme, mode, setTheme, setMode }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
