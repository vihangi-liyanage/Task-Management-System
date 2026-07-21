export type ThemeMode = "dark" | "light";

const THEME_KEY = "task-management-theme";

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "dark";
  }

  const stored = window.localStorage.getItem(THEME_KEY);
  return stored === "light" ? "light" : "dark";
}

export function storeTheme(theme: ThemeMode) {
  window.localStorage.setItem(THEME_KEY, theme);
}

