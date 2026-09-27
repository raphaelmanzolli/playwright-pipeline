import { randomUUID } from 'node:crypto';

export function createUser() {
  const id = randomUUID();
  return {
    username: `tester-${id}`,
    email: `tester-${id}@example.com`,
    password: 'TestPassword123!',
  };
}

export type UserData = ReturnType<typeof createUser>;
