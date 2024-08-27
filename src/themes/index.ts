import { baseTheme } from "./base";
import { forest } from "./forest";
import { ocean } from "./ocean";

export const themes = {
  ...baseTheme,
  forest,
  ocean,
} as const;

export type ThemeName = keyof typeof themes;
