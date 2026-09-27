import { type Page } from '@playwright/test';

export class ArticlePage {
  constructor(private page: Page) {}

  get title() {
    return this.page.getByRole('heading', { level: 1 });
  }

  get body() {
    return this.page.getByTestId('article-body');
  }

  get slug() {
    return new URL(this.page.url()).hash.split('/')[2];
  }

  async open(slug: string) {
    await this.page.goto(`/#/article/${slug}`);
  }

  async edit() {
    await this.page.getByTestId('article-banner').getByRole('link', { name: 'Edit article', exact: true }).click();
  }
}
