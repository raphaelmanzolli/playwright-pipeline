# Test environment

[Back to the README](../README.md)

## Applications and versions

The suite tests these existing RealWorld implementations:

- Frontend: [Vue 3](https://github.com/mutoe/vue3-realworld-example-app).
- Backend: [Nitro + Prisma + SQLite](https://github.com/realworld-apps/nitro-prisma-zod-realworld-example-app).

This repository contributes the test automation and environment setup. The applications belong to their respective authors and retain their licenses in the local checkouts.

Full commit hashes are recorded in [app/versions.json](../app/versions.json). Three lockfiles pin the dependencies:

- [package-lock.json](../package-lock.json): test automation.
- [app/frontend.package-lock.json](../app/frontend.package-lock.json): frontend.
- [app/backend.package-lock.json](../app/backend.package-lock.json): backend.

Application checkouts are stored in `.realworld/`, which is excluded from Git. Setup verifies each checkout's commit against the pinned version.

## Local setup adaptations

[app/setup.mjs](../app/setup.mjs) downloads, installs, and builds the applications. It adapts only their local execution:

- Builds the backend with the Node server preset.
- Uses a reduced frontend dependency manifest and Vite configuration to build the application without its upstream development tooling.
- Removes links to external fonts and icons so those requests do not affect local tests.

The code for the tested application flows is unchanged. During tests, the UI calls the real API on localhost; responses are not mocked.

The pipeline uses Node.js 22.16.0, matching [.nvmrc](../.nvmrc). The first setup requires network access to download the applications, dependencies, and browser.

## Server lifecycle

[playwright.config.ts](../playwright.config.ts) starts and stops both servers:

| Service | Address |
| --- | --- |
| API | `http://127.0.0.1:3000` |
| UI | `http://127.0.0.1:4173` |

The suite does not reuse existing servers, to avoid accidentally testing another application. Both ports must be free. Do not run two suites simultaneously in the same directory.

Tests run with two workers and unique data for each scenario. The backend uses a fixed local test secret, configured in [app/start-backend.mjs](../app/start-backend.mjs).

## Database and cleanup

The dedicated test database is stored at `.realworld/test.db`. The backend launcher creates the file if needed and applies the Prisma schema before starting the API.

Fixtures clean up test data after normal test execution, including failed assertions. Since the RealWorld specification does not provide user deletion, [app/database.ts](../app/database.ts) deletes each scenario's account by its unique email address. Foreign keys also remove that user's articles, comments, and favorites.

Cleanup runs in a `finally` block in [fixtures/test.ts](../fixtures/test.ts). Forcibly terminating the process may prevent cleanup and leave data behind. UUIDs prevent another test from reusing that data. The suite does not clear the entire database before each run.

The mixed scenario also deletes its article through the API and checks for a subsequent 404 response. Fixture cleanup handles any remaining data if an earlier assertion fails.

## Report screenshot

[The README screenshot](images/playwright-report.png) was captured from the local HTML report of the successful RealWorld run on September 26, 2026. It is a static example, not a live CI result.

At the time the screenshot was added, the latest successful GitHub Actions run covered the previous suite. The README's live badge follows the published workflow; the RealWorld suite still needs its first remote CI run.
