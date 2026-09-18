import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://playwrightlab.github.io/login.html');
    });

    test('user can login successfully', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.login('test@playlab.com', 'Password1232');

        await expect(page.getByText('Signed in as test@playlab.com')).toBeVisible();
    });

    test('user cannot login with invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.login('test@playlab.com', 'Password123');

        await expect(page.getByTestId('login-email-error')).toBeVisible();
    });
});