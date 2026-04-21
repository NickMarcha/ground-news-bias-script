# Ground News Bias Userscript (Minimal)

Repository: [NickMarcha/ground-news-bias-script](https://github.com/NickMarcha/ground-news-bias-script)

Manual lookup userscript for Ground News data with minimal interference:
- No automatic overlay injection on page load.
- User-triggered lookup via userscript menu command.
- TypeScript source and GitHub Actions build pipeline.

## Disclaimer

This project is maintained independently by its contributors. It has **no affiliation** with Ground News, its operators, or any related company or organization, and is **not** endorsed or sponsored by them. References to Ground News are for identification of the service the userscript interacts with only.

### For Ground News

If you represent Ground News and want this script or repository taken down—or have another concern about the project—please **open an issue** on this repository so maintainers can see it and respond.

## Install (Violentmonkey / Tampermonkey)

**One-click install from `main` (auto-updates when CI refreshes the file):**

[Install userscript (raw)](https://raw.githubusercontent.com/NickMarcha/ground-news-bias-script/main/published/install.user.js)

Or paste this URL into your manager’s “install from URL” field:

```
https://raw.githubusercontent.com/NickMarcha/ground-news-bias-script/main/published/install.user.js
```

Mirror path (same file): [`published/latest.user.js`](https://raw.githubusercontent.com/NickMarcha/ground-news-bias-script/main/published/latest.user.js)

Then open any article page and use the manager menu:

- **Ground News: Check Current Page**

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

## GitHub Workflow

Workflow file:
- `.github/workflows/userscript.yml`

Behavior:
- Runs check + build on pushes and manual dispatch.
- Uploads build artifact.
- On `main`, copies build output into `published/latest.user.js` and `published/install.user.js` for easy install links without release tags.

---

## Roadmap and plan (what’s left)

### Done (reverse-engineering / v1 userscript)

- Confirmed lookup flow: `extension.ground.news/search` → IDs → `production.checkitt.news/.../toolbarData/...` (anonymous, no login required for basic bias/coverage).
- Userscript: menu-triggered lookup, small results panel, TypeScript + CI.

### To do — Firefox extension (toolbar + sidebar)

- [ ] **New MV3 extension** in this repo (or sibling package): toolbar button opens lookup for the active tab URL only (no global `content_scripts` on all sites).
- [ ] **Optional sidebar** (`sidebar_action`) to show the same summary and a link to full Ground News coverage, refresh on explicit action or tab change.
- [ ] **Minimal permissions**: prefer `activeTab` + narrow `host_permissions` for Ground API hosts only; avoid `<all_urls>` and avoid always-on page injection.
- [ ] **Shared TypeScript core**: extract URL normalization + `fetchGroundDataForUrl` (or equivalent using `fetch` in extension context) into a `packages/core`-style module reused by the userscript build and the extension.
- [ ] **Distribution**: document temporary add-on load vs signed builds; AMO listing is optional and separate from the userscript install path.
- [ ] **Optional later**: login / save-article flows (not in v1 userscript); only if you want parity with the official extension.

### To do — userscript polish (optional)

- [ ] Theming / dark–light follow system preference.
- [ ] Optional `@connect` / caching tweaks if Ground changes CORS or rate limits.
