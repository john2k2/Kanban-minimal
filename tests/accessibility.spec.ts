import { test, expect, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function gotoBoard(page: Page) {
  await page.goto("/");
  await page.getByRole("heading", { name: "Project Board" }).waitFor();
}

test.describe("Accesibilidad tablero", () => {
  test("sin violaciones críticas (modo claro)", async ({ page }) => {
    await gotoBoard(page);
    await page.evaluate(() =>
      document.documentElement.classList.remove("dark")
    );
    const axe = new AxeBuilder({ page })
      .disableRules(["color-contrast"]) // ya lo cubrimos manualmente / test propio
      .withTags(["wcag2a", "wcag2aa"]);
    const results = await axe.analyze();
    const critical = results.violations.filter((v) => v.impact === "critical");
    if (critical.length) {
      console.log(
        "Violaciones críticas:",
        critical.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.length,
        }))
      );
    }
    expect(critical.length, "Violaciones críticas de accesibilidad").toBe(0);
  });

  test("sin violaciones críticas (modo oscuro)", async ({ page }) => {
    await gotoBoard(page);
    await page.evaluate(() => document.documentElement.classList.add("dark"));
    const axe = new AxeBuilder({ page })
      .disableRules(["color-contrast"])
      .withTags(["wcag2a", "wcag2aa"]);
    const results = await axe.analyze();
    const critical = results.violations.filter((v) => v.impact === "critical");
    expect(critical.length, "Violaciones críticas de accesibilidad").toBe(0);
  });
});
