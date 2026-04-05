import { test, expect } from "@playwright/test";

test("el usuario puede iniciar sesión", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Iniciar sesión")).toBeVisible();

  await page.getByPlaceholder("admin").fill("admin");
  await page.getByPlaceholder("••••••••").fill("admin");
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page.getByText("Frontend Componentes")).toBeVisible();
  await expect(page.getByText(/Sesión:/)).toBeVisible();
});