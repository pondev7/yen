import { createContext, useContext } from "react";

export interface Theme {
  name: "dark" | "light";
  accent: string; // primary color (user messages, input border)
  assistant: string; // assistant name color
  system: string; // system message color
  dim: string; // dimmed text
  border: string; // general border color
}

export const DARK_THEME: Theme = {
  name: "dark",
  accent: "cyan",
  assistant: "green",
  system: "yellow",
  dim: "gray",
  border: "gray",
};

export const LIGHT_THEME: Theme = {
  name: "light",
  accent: "blue",
  assistant: "magenta",
  system: "yellow",
  dim: "gray",
  border: "white",
};

export const ThemeContext = createContext<Theme>(DARK_THEME);

export function useTheme() {
  return useContext(ThemeContext);
}
