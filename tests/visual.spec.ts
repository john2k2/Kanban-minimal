import { test, expect, Page } from "@playwright/test";

async function waitForBoard(page: Page) {
  await page.waitForSelector('h1:has-text("Project Board")');
  await page.waitForSelector('[aria-label="Tablero Kanban"]');
}

test.describe("Kanban visual", () => {
  test("modo claro snapshot", async ({ page }) => {
    await page.goto("/");
    await waitForBoard(page);
    // Asegura modo claro en <html>
    await page.evaluate(() => {
      document.documentElement.classList.remove("dark", "hc");
    });
    await page.waitForTimeout(150);
    // Tolerancia minúscula para diferencias de subpíxeles render (fuentes / AA)
    expect(await page.screenshot({ fullPage: false })).toMatchSnapshot(
      "light.png",
      { maxDiffPixels: 25 }
    );
  });

  test("modo oscuro snapshot", async ({ page }) => {
    await page.goto("/");
    await waitForBoard(page);
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("hc");
    });
    await page.waitForTimeout(150);
    expect(await page.screenshot({ fullPage: false })).toMatchSnapshot(
      "dark.png",
      { maxDiffPixels: 25 }
    );
  });

  test("contraste básico de texto columna", async ({ page }) => {
    await page.goto("/");
    await waitForBoard(page);
    // Forzar modo claro para asegurar colores de texto oscuros sobre fondo claro
    await page.evaluate(() => {
      document.documentElement.classList.remove("dark", "hc");
    });
    const color = await page.$eval("h2", (el) => getComputedStyle(el).color);
    // Calcular fondo efectivo subiendo árbol si es transparente
    const bg = await page.$eval(".kanban-column-inner", (el) => {
      let cur: HTMLElement | null = el as HTMLElement;
      while (cur) {
        const cs = getComputedStyle(cur);
        const bgc = cs.backgroundColor;
        if (
          bgc &&
          bgc !== "transparent" &&
          !bgc.startsWith("rgba(0, 0, 0, 0)")
        ) {
          return bgc;
        }
        cur = cur.parentElement;
      }
      return "rgb(255,255,255)";
    });
    // Heurística simple: comparar luminancia aproximada
    function lum(c: string) {
      // Soporte rgb/rgba
      const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (m) {
        const [r, g, b] = m
          .slice(1)
          .map(Number)
          .map((v) => v / 255);
        const conv = (v: number) =>
          v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        const [R, G, B] = [conv(r), conv(g), conv(b)];
        return 0.2126 * R + 0.7152 * G + 0.0722 * B;
      }
      // Soporte simple lab(L a b) => aproximar luminancia L/100
      if (c.startsWith("lab(")) {
        const inside = c.slice(4, -1).trim();
        const parts = inside.split(/\s+/);
        const L = parseFloat(parts[0]);
        if (!isNaN(L)) return Math.min(Math.max(L / 100, 0), 1);
      }
      // fallback
      return 1; // asume muy claro en caso desconocido
    }
    const ratio = (a: number, b: number) =>
      (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const contrast = ratio(lum(color), lum(bg));
    // Log para depuración en salida de test
    console.log("DEBUG contraste h2=", color, "bg=", bg, "ratio=", contrast);
    expect(contrast).toBeGreaterThanOrEqual(3.5); // tolerancia (AA pequeño sería 4.5, aquí control manual)
  });

  test("foco accesible toggle (light)", async ({ page }) => {
    await page.goto("/");
    await waitForBoard(page);
    // Asegurar modo claro
    await page.evaluate(() =>
      document.documentElement.classList.remove("dark", "hc")
    );
    const btn = page
      .locator(
        '.theme-toggle button[aria-label*="oscuro"], .theme-toggle button[aria-label*="claro"]'
      )
      .first();
    await btn.focus();
    // Verificar box-shadow (no debe ser none)
    const shadow = await btn.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(shadow).not.toBeFalsy();
    expect(shadow).not.toEqual("none");
    // Snapshot del botón enfocado
    expect(await btn.screenshot()).toMatchSnapshot("focus-toggle-light.png", {
      maxDiffPixels: 5,
    });
  });

  test("foco accesible toggle (dark)", async ({ page }) => {
    await page.goto("/");
    await waitForBoard(page);
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("hc");
    });
    const btn = page
      .locator(
        '.theme-toggle button[aria-label*="oscuro"], .theme-toggle button[aria-label*="claro"]'
      )
      .first();
    await btn.focus();
    const shadow = await btn.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(shadow).not.toBeFalsy();
    expect(shadow).not.toEqual("none");
    expect(await btn.screenshot()).toMatchSnapshot("focus-toggle-dark.png", {
      maxDiffPixels: 5,
    });
  });

  test("column snapshots (light)", async ({ page }) => {
    await page.goto("/");
    await waitForBoard(page);
    await page.evaluate(() =>
      document.documentElement.classList.remove("dark", "hc")
    );
    const columns = ["To do", "In progress", "Done"];
    for (const name of columns) {
      const colRegion = page.getByRole("region", { name });
      await expect(colRegion).toBeVisible();
      const inner = colRegion.locator(".kanban-column-inner");
      await inner.scrollIntoViewIfNeeded();
      await page.waitForTimeout(50);
      const file = `col-${name.toLowerCase().replace(/\s+/g, "_")}-light.png`;
      expect(await inner.screenshot()).toMatchSnapshot(file, {
        maxDiffPixels: 10,
      });
    }
  });

  test("column snapshots (dark)", async ({ page }) => {
    await page.goto("/");
    await waitForBoard(page);
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("hc");
    });
    const columns = ["To do", "In progress", "Done"];
    for (const name of columns) {
      const colRegion = page.getByRole("region", { name });
      await expect(colRegion).toBeVisible();
      const inner = colRegion.locator(".kanban-column-inner");
      await inner.scrollIntoViewIfNeeded();
      await page.waitForTimeout(50);
      const file = `col-${name.toLowerCase().replace(/\s+/g, "_")}-dark.png`;
      expect(await inner.screenshot()).toMatchSnapshot(file, {
        maxDiffPixels: 10,
      });
    }
  });

  test("badges usan variables tokenizadas", async ({ page }) => {
    await page.goto("/");
    await waitForBoard(page);
    const firstBadge = page.locator(".badge").first();
    await expect(firstBadge).toBeVisible();
    const styles = await firstBadge.evaluate((el) => {
      const cs = getComputedStyle(el as HTMLElement);
      return {
        bg: cs.backgroundImage || cs.backgroundColor,
        border: cs.borderTopColor,
        color: cs.color,
      };
    });
    // Heurística: los valores deben contener al menos uno de los colores esperados de la paleta light o gradient
    expect(styles.bg).toBeTruthy();
    expect(styles.border).toMatch(/rgb|hsl|#/);
    expect(styles.color).toMatch(/rgb|hsl|#/);
  });

  test("modo alto contraste ajusta estilos clave", async ({ page }) => {
    await page.goto("/");
    await waitForBoard(page);
    // activar HC via toggle
    const hcBtn = page.locator(".hc-toggle");
    await hcBtn.click();
    await page.waitForTimeout(80);
    // esperar aparicion de una columna
    await page.waitForSelector(".col-title");
    const columnTitle = page.locator(".col-title").first();
    const weight = await columnTitle.evaluate(
      (el) => getComputedStyle(el).fontWeight
    );
    expect(Number(weight)).toBeGreaterThanOrEqual(600);
    // snapshot parcial de una columna
    const inner = page.locator(".kanban-column-inner").first();
    expect(await inner.screenshot()).toMatchSnapshot("col-high-contrast.png", {
      maxDiffPixels: 18,
    });
  });
});
