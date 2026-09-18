import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Forms', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.login('test@playlab.com', 'Password123');
        await page.getByTestId('go-to-dashboard').click();
    });

    test('user can register with required fields', async ({ page }) => {

    });

});