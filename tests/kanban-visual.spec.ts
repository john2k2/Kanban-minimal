import { test, expect } from '@playwright/test';

test.describe('Kanban visual', () => {
  test("estado inicial tablero", async ({ page }) => {
    await page.goto("/");
    // Esperar columnas
    await page.getByRole("heading", { name: "Project Board" }).waitFor();
    // Forzar estado consistente (modo claro)
    await page.evaluate(() =>
      document.documentElement.classList.remove("dark", "hc")
    );
    await expect(page).toHaveScreenshot("kanban-inicial.png", {
      fullPage: false,
    });
  });

  test("hover tarjeta", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() =>
      document.documentElement.classList.remove("dark", "hc")
    );
    const firstCard = page.locator(".kanban-card").first();
    await firstCard.hover();
    await expect(firstCard).toHaveScreenshot("kanban-card-hover.png");
  });
});
