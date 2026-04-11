import { test, expect } from "@playwright/test";

test.describe("Authentication Pages", () => {
    test.describe("Login Page", () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/login");
        });

        test("should render the login form", async ({ page }) => {
            await expect(page.locator("#email")).toBeVisible();
            await expect(page.locator("#password")).toBeVisible();
            await expect(page.locator("button[type='submit']")).toBeVisible();
        });

        test("should show validation on empty submit", async ({ page }) => {
            await page.locator("button[type='submit']").click();
            // HTML5 required validation: email field should be invalid
            const emailInput = page.locator("#email");
            const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
            expect(validationMessage).not.toBe("");
        });

        test("should show user-friendly error on wrong credentials", async ({ page }) => {
            await page.locator("#email").fill("wrong@example.com");
            await page.locator("#password").fill("wrongpassword123");
            await page.locator("button[type='submit']").click();

            // Wait for error message to appear
            const errorMessage = page.locator("text=/invalid|credentials|incorrect|wrong|network/i").first();
            await expect(errorMessage).toBeVisible({ timeout: 8000 });

            // Crucially: should NOT contain raw technical text
            await expect(errorMessage).not.toContainText("TypeError");
            await expect(errorMessage).not.toContainText("fetch failed");
            await expect(errorMessage).not.toContainText("ECONNREFUSED");
        });

        test("should have a link to the registration page", async ({ page }) => {
            const registerLink = page.locator("a[href='/register']");
            await expect(registerLink).toBeVisible();
        });
    });

    test.describe("Register Page", () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/register");
        });

        test("should render the registration form", async ({ page }) => {
            await expect(page.locator("input[type='text']")).toBeVisible(); // Name
            await expect(page.locator("input[type='email']")).toBeVisible();
            await expect(page.locator("button[type='submit']")).toBeVisible();
        });

        test("should validate password mismatch client-side", async ({ page }) => {
            await page.locator("input[type='text']").fill("Test User");
            await page.locator("input[type='email']").fill("test@example.com");

            const passwordInputs = page.locator("input[type='password']");
            await passwordInputs.nth(0).fill("password123");
            await passwordInputs.nth(1).fill("differentpass");
            await page.locator("button[type='submit']").click();

            const errorMsg = page.locator("text=/password/i").first();
            await expect(errorMsg).toBeVisible({ timeout: 5000 });
        });

        test("should have a link back to the login page", async ({ page }) => {
            const loginLink = page.locator("a[href='/login']");
            await expect(loginLink).toBeVisible();
        });
    });
});
