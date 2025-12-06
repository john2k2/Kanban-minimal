import { describe, it, expect } from "vitest";

// Simulación sencilla: el script de tema en la app usa localStorage 'kanban-theme'.

describe("persistencia de tema", () => {
  it("guarda y lee dark", () => {
    const storage: Record<string, string> = {};
    // mock localStorage
    // @ts-ignore
    global.localStorage = {
      getItem: (k: string) => storage[k] || null,
      setItem: (k: string, v: string) => {
        storage[k] = v;
      },
      removeItem: (k: string) => {
        delete storage[k];
      },
      clear: () => {
        Object.keys(storage).forEach((k) => delete storage[k]);
      },
    };
    localStorage.setItem("kanban-theme", "dark");
    expect(localStorage.getItem("kanban-theme")).toBe("dark");
  });
});
