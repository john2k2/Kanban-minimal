import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "kanban-theme";

export function useTheme() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Leer directamente del DOM para sincronizar estado inicial
    const hasDarkClass = document.documentElement.classList.contains("dark");
    setIsDark(hasDarkClass);
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      const html = document.documentElement.classList;
      if (next) {
        html.add("dark");
      } else {
        html.remove("dark");
      }
      try {
        localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
      } catch { }
      return next;
    });
  }, []);

  // Si no está montado, retornar false (o lo que sea default)
  // para evitar diferencias durante hidratación
  return { isDark: mounted ? isDark : false, toggle } as const;
}
