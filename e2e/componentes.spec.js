import { test, expect } from "@playwright/test";

test("el usuario puede crear un componente", async ({ page }) => {
  await page.goto("/");

  await page.getByPlaceholder("admin").fill("admin");
  await page.getByPlaceholder("••••••••").fill("admin");
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page.getByText("Gestión de componentes")).toBeVisible();

  await page.getByPlaceholder("Teclado mecánico").fill("Producto E2E");
  await page.getByPlaceholder("Periféricos").fill("Testing");
  await page.getByPlaceholder("49.99").fill("19.99");
  await page.getByPlaceholder("10").fill("7");

  await page.getByRole("button", { name: "Crear" }).click();

  await expect(page.getByText("Componente creado correctamente ✅")).toBeVisible();
  await expect(page.getByText("Producto E2E")).toBeVisible();
});


test("el usuario puede eliminar un componente", async ({ page }) => {
  await page.goto("/");

  await page.getByPlaceholder("admin").fill("admin");
  await page.getByPlaceholder("••••••••").fill("admin");
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page.getByText("Gestión de componentes")).toBeVisible();

  await page.getByPlaceholder("Teclado mecánico").fill("Eliminar E2E");
  await page.getByPlaceholder("Periféricos").fill("Testing");
  await page.getByPlaceholder("49.99").fill("29.99");
  await page.getByPlaceholder("10").fill("3");
  await page.getByRole("button", { name: "Crear" }).click();

  await expect(page.getByText("Eliminar E2E")).toBeVisible();

  const fila = page.locator("tr", { hasText: "Eliminar E2E" });
  await fila.getByRole("button", { name: "Eliminar" }).click();

  await expect(fila).toHaveCount(0);
});