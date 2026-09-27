import { test, expect } from '../../fixtures/test';
import { createArticle } from '../../test-data/article';

test('persists a UI edit in the API', async ({
  page, account, articlesApi, loginPage, articlePage, editorPage,
}) => {
  const original = createArticle();
  const updated = {
    ...original,
    title: `${original.title} - updated`,
    description: 'Updated through the browser.',
    body: 'This change must be persisted by the API.',
  };

  const response = await articlesApi.create(original);
  expect(response.status()).toBe(201);
  const { article } = await response.json();

  await loginPage.open();
  await loginPage.login(account.email, account.password);
  await expect(page.getByRole('link', { name: account.username, exact: true })).toBeVisible();
  await articlePage.open(article.slug);
  await expect(articlePage.title).toHaveText(original.title);
  await expect(articlePage.body).toHaveText(original.body);

  await articlePage.edit();
  await expect(editorPage.title).toHaveValue(original.title);
  await editorPage.fill(updated);
  await editorPage.publish();
  await expect(articlePage.title).toHaveText(updated.title);
  await expect(articlePage.body).toHaveText(updated.body);

  // Updating the title changes the slug in this RealWorld implementation.
  const saved = await articlesApi.get(articlePage.slug);
  expect(saved.status()).toBe(200);
  expect((await saved.json()).article).toMatchObject(updated);

  const deleted = await articlesApi.delete(articlePage.slug);
  expect(deleted.status()).toBe(204);
  expect((await articlesApi.get(articlePage.slug)).status()).toBe(404);
});
