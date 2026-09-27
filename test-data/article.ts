import { randomUUID } from 'node:crypto';

export function createArticle() {
  return {
    title: `Learning Playwright ${randomUUID()}`,
    description: 'A practical example of UI and API testing.',
    body: 'Page Objects keep browser interactions easy to understand.',
    tagList: [] as string[],
  };
}

export type ArticleData = ReturnType<typeof createArticle>;
