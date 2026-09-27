import { type Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  get errors() {
    return this.page.locator('.error-messages');
  }

  async open() {
    await this.page.goto('/#/login');
  }

  async login(email: string, password: string) {
    await this.page.getByRole('textbox', { name: 'Email', exact: true }).fill(email);
    await this.page.getByLabel('Password', { exact: true }).fill(password);
    await this.page.getByRole('button', { name: 'Sign in', exact: true }).click();
  }
}
