import { test, expect } from "@playwright/test";

test("simulation", async ({ page }) => {
  await page.goto("/");

  // trigger click on eleement with attribute data-test "cta-play"
  await page.waitForSelector('[data-test="cta-play"]');
  await page.click('[data-test="cta-play"]');
  await page.waitForTimeout(300);
  await page.keyboard.press("r");
  await page.waitForTimeout(100);
  await page.keyboard.press("Space");
  await page.waitForTimeout(1000);
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(200);
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(200);
  await page.keyboard.press("Space");
  await page.waitForTimeout(300);
  await page.keyboard.press("r");
  await page.waitForTimeout(200);
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(200);
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(200);
  await page.keyboard.press("r");
  await page.waitForTimeout(300);
  await page.keyboard.press("Space");
  await page.waitForTimeout(400);
  await page.keyboard.press("r");
  await page.waitForTimeout(200);
  await page.keyboard.press("ArrowUp");
  await page.waitForTimeout(200);
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(200);
  await page.keyboard.press("r");
  await page.waitForTimeout(300);
  await page.keyboard.press("Space");
  await page.waitForTimeout(400);
  await page.keyboard.press("r");
  await page.waitForTimeout(200);
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(200);
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(200);
  await page.keyboard.press("r");
  await page.waitForTimeout(400);
  await page.keyboard.press("r");
  await page.waitForTimeout(600);
  expect(await page.screenshot()).toMatchSnapshot("screenshot.png", {
    maxDiffPixelRatio: 0.03,
  });
});
