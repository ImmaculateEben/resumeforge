import { expect, test } from "@playwright/test";

const templateIds = ["modern", "classic", "creative"] as const;

test.describe("resume preview visual baselines", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dev/preview-regression");
  });

  for (const templateId of templateIds) {
    test(`${templateId} thumbnail and preview match screenshots`, async ({ page }) => {
      await expect(page.getByTestId(`${templateId}-thumbnail`)).toHaveScreenshot(
        `${templateId}-thumbnail.png`,
        {
          animations: "disabled",
        }
      );

      await expect(page.getByTestId(`${templateId}-preview`)).toHaveScreenshot(
        `${templateId}-preview.png`,
        {
          animations: "disabled",
        }
      );
    });
  }
});
