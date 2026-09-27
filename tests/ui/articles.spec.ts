import { test, expect } from '../../fixtures/test';
import { createArticle } from '../../test-data/article';

test('publishes an article through the editor', async ({ page, loginPage, editorPage, articlePage, account }) => {
  const article = createArticle();
  await loginPage.open();
  await loginPage.login(account.email, account.password);
  await expect(page.getByRole('link', { name: account.username, exact: true })).toBeVisible();

  await editorPage.open();
  await editorPage.fill(article);
  await editorPage.publish();

  await expect(articlePage.title).toHaveText(article.title);
  await expect(articlePage.body).toHaveText(article.body);
});
