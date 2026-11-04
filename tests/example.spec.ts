
import { test, expect } from "@playwright/test";

test.describe("KUNJO storefront", () => {
  test("loads the homepage successfully", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/KUNJO/i);

    await expect(
      page.getByRole("heading", {
        name: /elegance is in the details/i,
      }),
    ).toBeVisible();
  });

  test("navigates from homepage to the shop", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /shop/i }).first().click();

    await expect(page).toHaveURL(/\/shop/);
  });

  test("displays products in the shop", async ({ page }) => {
    await page.goto("/shop");

    await expect(
      page.getByText("The Bluebell Earrings"),
    ).toBeVisible();

    await expect(
      page.getByText("The Solstice Ring"),
    ).toBeVisible();
  });

  test("opens a product details page", async ({ page }) => {
    await page.goto("/shop");

    await page.getByText("The Bluebell Earrings").click();

    await expect(page).toHaveURL(/\/product\//);

    await expect(
      page.getByRole("heading", {
        name: "The Bluebell Earrings",
      }),
    ).toBeVisible();
  });

  test("adds a product to the shopping bag", async ({ page }) => {
    await page.goto("/shop");

    await page.getByRole("button", {
      name: "ADD TO BAG",
    }).first().click();

    await page.goto("/cart");

    await expect(
      page.getByRole("heading", {
        name: "The Bluebell Earrings",
      }),
    ).toBeVisible();
  });

  test("updates product quantity", async ({ page }) => {
    await page.goto("/shop");

    await page.getByRole("button", {
      name: "ADD TO BAG",
    }).first().click();

    await page.goto("/cart");

    await page.getByRole("button", {
      name: "Increase The Bluebell Earrings quantity",
    }).click();

    await expect(
      page.getByText("2", { exact: true }).last(),
    ).toBeVisible();
  });

  test("preserves the shopping bag after a page refresh", async ({
    page,
  }) => {
    await page.goto("/shop");

    await page.getByRole("button", {
      name: "ADD TO BAG",
    }).first().click();

    await page.goto("/cart");

    await page.reload();

    await expect(
      page.getByRole("heading", {
        name: "The Bluebell Earrings",
      }),
    ).toBeVisible();
  });
});
