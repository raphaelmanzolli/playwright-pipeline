import { execFileSync } from 'node:child_process';
import { closeSync, openSync } from 'node:fs';
import { resolve } from 'node:path';

const databasePath = resolve('.realworld/test.db');
// Prisma on Windows needs the SQLite file to exist before applying the schema.
closeSync(openSync(databasePath, 'a'));
process.env.DATABASE_URL = `file:${databasePath.replaceAll('\\', '/')}`;
process.env.JWT_SECRET = 'realworld-local-tests-only';
process.env.HOST = '127.0.0.1';
process.env.PORT = '3000';

execFileSync(process.execPath, ['node_modules/prisma/build/index.js', 'db', 'push'], {
  cwd: '.realworld/backend',
  stdio: 'inherit',
});

await import('../.realworld/backend/.output/server/index.mjs');
