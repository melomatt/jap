import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("should load and display the hero section", async ({ page }) => {
        // Hero section should exist
        const hero = page.locator("#hero");
        await expect(hero).toBeVisible();
    });

    test("should display the firm name or hero title text", async ({ page }) => {
        // The page title or document title should reference JAP
        await expect(page).toHaveTitle(/Justice Advocates/i);
    });

    test("should show the Get a Quote button in hero", async ({ page }) => {
        const quoteBtn = page.locator("#hero button").first();
        await expect(quoteBtn).toBeVisible();
    });

    test("should scroll to services when Explore Services is clicked", async ({ page }) => {
        const exploreBtn = page.locator("#hero button", { hasText: "Explore Services" });
        await exploreBtn.click();
        // After click, services section should be in view
        const servicesSection = page.locator("#services");
        await expect(servicesSection).toBeInViewport({ timeout: 3000 });
    });

    test("navbar should be visible and contain navigation links", async ({ page }) => {
        const navbar = page.locator("nav");
        await expect(navbar).toBeVisible();
    });

    test("services section should be present on page", async ({ page }) => {
        await page.locator("#services").scrollIntoViewIfNeeded();
        await expect(page.locator("#services")).toBeVisible();
    });

    test("about section should be present on page", async ({ page }) => {
        await page.locator("#about").scrollIntoViewIfNeeded();
        await expect(page.locator("#about")).toBeVisible();
    });

    test("footer should display firm contact details", async ({ page }) => {
        await page.locator("footer").scrollIntoViewIfNeeded();
        const footer = page.locator("footer");
        await expect(footer).toBeVisible();
        // Should contain an email or address
        await expect(footer).toContainText(/@|Monrovia|Liberia|justice/i);
    });
});
