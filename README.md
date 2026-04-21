# Ground News Bias Userscript (Minimal)

Manual lookup userscript for Ground News data with minimal interference:
- No automatic overlay injection on page load.
- User-triggered lookup via userscript menu command.
- TypeScript source and GitHub Actions build pipeline.

## Development

Prerequisites:
- Node.js from `.nvmrc`

Install and build:

```bash
npm ci
npm run build
```

Output:
- `dist/userscript.user.js`

## Install (manual)

In Violentmonkey/Tampermonkey:
1. Create a new script.
2. Paste the contents of `dist/userscript.user.js`.
3. Save.

Then use the userscript manager menu action:
- `Ground News: Check Current Page`

## GitHub Workflow

Workflow file:
- `.github/workflows/userscript.yml`

Behavior:
- Runs check + build on pushes and manual dispatch.
- Uploads build artifact.
- On `main`, copies build output into `published/latest.user.js` and `published/install.user.js` for easy install links without release tags.
