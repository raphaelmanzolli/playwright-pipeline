import { test, expect } from '../../fixtures/test';

test('signs in with valid credentials', async ({ page, loginPage, account }) => {
  await loginPage.open();
  await loginPage.login(account.email, account.password);

  await expect(page.getByRole('link', { name: account.username, exact: true })).toBeVisible();
  await expect(page).toHaveURL('http://127.0.0.1:4173/#/');
});

test('shows an error for an incorrect password', async ({ page, loginPage, account }) => {
  await loginPage.open();
  await loginPage.login(account.email, 'WrongPassword123!');

  await expect(loginPage.errors).toContainText('credentials invalid');
  await expect(page).toHaveURL(/#\/login$/);
});
