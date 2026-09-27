import { type APIRequestContext } from '@playwright/test';
import { type UserData } from '../test-data/user';

export class UsersApi {
  constructor(private request: APIRequestContext) {}

  register(user: UserData) {
    return this.request.post('/api/users', { data: { user } });
  }

  login(email: string, password: string) {
    return this.request.post('/api/users/login', { data: { user: { email, password } } });
  }
}
