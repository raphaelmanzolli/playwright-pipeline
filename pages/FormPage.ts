import { type Page } from '@playwright/test';

export class FormPage {
    constructor(private page: Page) { }

    async fillRequiredFields(
        fullName: string,
        email: string,
        password: string
    ) {
        await this.page.getByTestId('input-fullname').fill(fullName);
        await this.page.getByTestId('input-email').fill(email);
        await this.page.getByTestId('input-password').fill(password);
    }
    
    async acceptTerms() {
        await this.page.getByTestId('check-terms').check();
    }
}

