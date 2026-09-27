import { type Page } from '@playwright/test';
import { type ArticleData } from '../test-data/article';

export class EditorPage {
  constructor(private page: Page) {}

  get title() {
    return this.page.getByRole('textbox', { name: 'Title', exact: true });
  }

  async open() {
    await this.page.goto('/#/article/create');
  }

  async fill(article: Pick<ArticleData, 'title' | 'description' | 'body'>) {
    await this.title.fill(article.title);
    await this.page.getByRole('textbox', { name: 'Description', exact: true }).fill(article.description);
    await this.page.getByRole('textbox', { name: 'Body', exact: true }).fill(article.body);
  }

  async publish() {
    await this.page.getByRole('button', { name: 'Publish Article', exact: true }).click();
  }
}
