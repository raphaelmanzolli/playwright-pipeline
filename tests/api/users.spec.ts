import { test, expect } from '../../fixtures/test';

test('registers a user and returns an authentication token', async ({ usersApi, userData }) => {
  const response = await usersApi.register(userData);
  expect(response.status()).toBe(201);
  const { user } = await response.json();
  expect(user).toMatchObject({ username: userData.username, email: userData.email });
  expect(user.token).toEqual(expect.any(String));
  expect(user.token.length).toBeGreaterThan(0);
  expect(user).not.toHaveProperty('password');
});

test('rejects an incorrect password', async ({ usersApi, account }) => {
  const response = await usersApi.login(account.email, 'WrongPassword123!');
  expect(response.status()).toBe(401);
  expect(await response.json()).toMatchObject({ errors: { credentials: ['invalid'] } });
});
