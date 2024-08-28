import { baseTheme } from "./base";
import { coffee } from "./coffee";
import { forest } from "./forest";
import { lavender } from "./lavender";
import { ocean } from "./ocean";
import { sunset } from "./sunset";

export const themes = {
  base: baseTheme,
  forest,
  ocean,
  sunset,
  lavender,
  coffee,
} as const;

export type ThemeName = keyof typeof themes;
export type ThemeMode = "light" | "dark";
