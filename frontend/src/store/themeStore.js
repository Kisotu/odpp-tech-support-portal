import { create } from "zustand";
import { persist } from "zustand/middleware";

const applyTheme = (mode, scheme) => {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.dataset.themeMode = mode;
  root.dataset.themeScheme = scheme;
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      mode: "light",
      scheme: "slate",

      initializeTheme: () => {
        const { mode, scheme } = get();
        applyTheme(mode, scheme);
      },

      setMode: (mode) => {
        set({ mode });
        applyTheme(mode, get().scheme);
      },

      toggleMode: () => {
        const nextMode = get().mode === "dark" ? "light" : "dark";
        set({ mode: nextMode });
        applyTheme(nextMode, get().scheme);
      },

      setScheme: (scheme) => {
        set({ scheme });
        applyTheme(get().mode, scheme);
      },
    }),
    {
      name: "odpp-ui-theme",
    },
  ),
);
