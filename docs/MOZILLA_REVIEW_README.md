# Source package — Mozilla add-on review

This archive contains the **human-authored TypeScript** and build tooling needed to reproduce the **Ground News Lookup (Minimal)** Firefox extension bundle submitted to AMO.

## Prerequisites

| Requirement | Notes |
|---------------|--------|
| **Node.js** | Use the version in **`node-version.txt`** in this archive (same as the repository’s `.nvmrc`). Otherwise Node **20+** with a current **npm** is sufficient. |
| **npm** | Comes with Node. Use `npm ci` so installs match `package-lock.json`. |

## Operating systems

Build steps work on **Windows**, **macOS**, and **Linux** (same commands as in CI: Ubuntu `ubuntu-latest`).

## Reproduce the extension (exact build pipeline)

1. Open a terminal in the **root of this archive** (next to `package.json` and this file).
2. Install locked dependencies:

   ```bash
   npm ci
   ```

3. Build the loadable extension into `extension/dist/`:

   ```bash
   npm run build:extension
   ```

4. Optional check:

   ```bash
   npx web-ext lint --source-dir extension/dist
   ```

The **submitted extension directory** is **`extension/dist/`** after a successful build (manifest, HTML, CSS, JS bundles, icons).

## Build tooling (declared for reviewers)

| Step | Tool | Role |
|------|------|------|
| TypeScript → bundled JS | **tsup** v8 (`tsup.extension.config.ts`) | IIFE bundles for `popup` and `sidebar`; **esbuild minification** enabled (`minify: true`). |
| Copy assets / rename outputs | **`scripts/build-extension.mjs`** | Copies `extension/manifest.json` and `extension/public/` into `extension/dist/`, renames `*.global.js` → `*.js`. |

There is **no** separate webpack step; **tsup** wraps esbuild for transpilation and bundling.

## Scope of this archive

Only files required to run `npm ci` and `npm run build:extension` for the **Firefox extension** are included. Other repo content (userscript pipeline, docs images, etc.) is omitted.
