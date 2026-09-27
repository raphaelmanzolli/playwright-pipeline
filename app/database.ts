import { createClient } from '@libsql/client';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// RealWorld has no delete-user endpoint. Only test cleanup accesses SQLite.
export async function deleteTestUser(email: string) {
  const database = createClient({
    url: pathToFileURL(resolve('.realworld/test.db')).href,
  });

  try {
    await database.execute('PRAGMA foreign_keys = ON');
    // Foreign keys also remove this user's articles, comments and favorites.
    await database.execute({ sql: 'DELETE FROM User WHERE email = ?', args: [email] });
  } finally {
    database.close();
  }
}
