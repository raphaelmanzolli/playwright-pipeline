import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const versions = JSON.parse(readFileSync('app/versions.json', 'utf8'));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(command, args, cwd) {
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
    // Windows executes npm through its .cmd launcher.
    shell: process.platform === 'win32' && command === npm,
  });
}

mkdirSync('.realworld', { recursive: true });

for (const [name, version] of Object.entries(versions)) {
  const directory = resolve('.realworld', name);
  if (!existsSync(directory)) {
    run('git', ['clone', '--no-checkout', version.repository, directory]);
    run('git', ['checkout', '--detach', version.commit], directory);
  }

  const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: directory, encoding: 'utf8' }).trim();
  if (head !== version.commit) {
    throw new Error(`${name}: expected commit ${version.commit}, found ${head}.`);
  }

  if (name === 'frontend') {
    // Install only what is needed to run the application under test.
    copyFileSync('app/frontend.package.json', `${directory}/package.json`);
    copyFileSync('app/frontend.vite.ts', `${directory}/vite.config.ts`);
    // Optional external fonts and icons must not affect local tests.
    const html = readFileSync(`${directory}/index.html`, 'utf8');
    writeFileSync(`${directory}/index.html`, html.replace(/^.*<link[^>]+https:\/\/[^>]+>.*$/gm, ''));
  }

  copyFileSync(`app/${name}.package-lock.json`, `${directory}/package-lock.json`);
  run(npm, ['ci', '--ignore-scripts', '--no-audit', '--no-fund'], directory);
}

run(process.execPath, ['node_modules/nitropack/dist/cli/index.mjs', 'prepare'], '.realworld/backend');
run(process.execPath, ['node_modules/prisma/build/index.js', 'generate'], '.realworld/backend');
run(process.execPath, ['node_modules/nitropack/dist/cli/index.mjs', 'build', '--preset', 'node-server'], '.realworld/backend');
process.env.VITE_API_HOST = 'http://127.0.0.1:3000';
run(process.execPath, ['node_modules/vite/bin/vite.js', 'build'], '.realworld/frontend');
console.log('\nRealWorld ready. Run npm test.');
