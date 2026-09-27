import { test, expect } from '../../fixtures/test';
import { ArticlesApi } from '../../api/ArticlesApi';
import { createArticle } from '../../test-data/article';

test('creates, reads and deletes an article', async ({ articlesApi, account }) => {
  const data = createArticle();
  const created = await articlesApi.create(data);
  expect(created.status()).toBe(201);
  const { article } = await created.json();

  const found = await articlesApi.get(article.slug);
  expect(found.status()).toBe(200);
  expect((await found.json()).article).toMatchObject({
    ...data,
    author: { username: account.username },
  });

  const deleted = await articlesApi.delete(article.slug);
  expect(deleted.status()).toBe(204);
  expect((await articlesApi.get(article.slug)).status()).toBe(404);
});

test('rejects article creation without authentication', async ({ api }) => {
  const anonymousArticles = new ArticlesApi(api);
  const response = await anonymousArticles.create(createArticle());
  expect(response.status()).toBe(401);
});
