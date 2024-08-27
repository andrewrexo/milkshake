import { baseTheme } from "./base";
import { forest } from "./forest";
import { ocean } from "./ocean";
import { sunset } from "./sunset";
import { lavender } from "./lavender";
import { coffee } from "./coffee";

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
