import { test as base, expect, type APIRequestContext } from '@playwright/test';
import { UsersApi } from '../api/UsersApi';
import { ArticlesApi } from '../api/ArticlesApi';
import { LoginPage } from '../pages/LoginPage';
import { EditorPage } from '../pages/EditorPage';
import { ArticlePage } from '../pages/ArticlePage';
import { createUser, type UserData } from '../test-data/user';
import { deleteTestUser } from '../app/database';

type Fixtures = {
  api: APIRequestContext;
  userData: UserData;
  account: UserData & { token: string };
  usersApi: UsersApi;
  articlesApi: ArticlesApi;
  loginPage: LoginPage;
  editorPage: EditorPage;
  articlePage: ArticlePage;
};

export const test = base.extend<Fixtures>({
  api: async ({ playwright }, use) => {
    const api = await playwright.request.newContext({ baseURL: 'http://127.0.0.1:3000' });
    try {
      await use(api);
    } finally {
      await api.dispose();
    }
  },

  userData: async ({}, use) => {
    const user = createUser();
    try {
      await use(user);
    } finally {
      await deleteTestUser(user.email);
    }
  },

  usersApi: async ({ api }, use) => {
    await use(new UsersApi(api));
  },

  account: async ({ usersApi, userData }, use) => {
    const response = await usersApi.register(userData);
    await expect(response).toBeOK();
    const { user } = await response.json();
    await use({ ...userData, token: user.token });
  },

  articlesApi: async ({ api, account }, use) => {
    await use(new ArticlesApi(api, account.token));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  editorPage: async ({ page }, use) => {
    await use(new EditorPage(page));
  },

  articlePage: async ({ page }, use) => {
    await use(new ArticlePage(page));
  },
});

export { expect } from '@playwright/test';
