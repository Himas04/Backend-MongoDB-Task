import { test, expect } from "@playwright/test";

test("add a student", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await page.getByPlaceholder("Name").fill("Himas");
  await page.getByPlaceholder("Email").fill("himas@gmail.com");
  await page.getByPlaceholder("Age").fill("23");
  await page.getByPlaceholder("Course").fill("Computer Science");

  await page.getByRole("button", { name: "Add" }).click();

  await page.waitForTimeout(1000);

  await page.screenshot({ path: "after-add.png", fullPage: true });

  console.log(await page.locator("body").innerText());
});
