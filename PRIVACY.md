# Privacy policy — Ground News Lookup (Firefox extension)

**Last updated:** April 21, 2026  

This policy describes the **Ground News Lookup (Minimal)** Firefox extension maintained in this repository. The project is **not affiliated with Ground News**; Ground News operates its own services and policies.

## What the extension does

When you open the **toolbar popup** or **sidebar**, the extension reads the **URL of the active browser tab** (only while you use the extension) and sends it over **HTTPS** to Ground News–related services to retrieve bias and coverage information for that page.

## Data sent and where it goes

- **Sent to third parties:** The active tab’s **URL** (and data implied by normal HTTPS requests, such as your IP address as seen by those servers) is transmitted to:
  - `https://extension.ground.news/`
  - `https://production.checkitt.news/`
- **Images:** The extension may load images (for example outlet icons or branding) from `https://groundnews.b-cdn.net/` and other **HTTPS** image URLs returned by those services.

This extension **does not** run its own backend and **does not** add separate analytics or telemetry beyond what you trigger by using the lookup.

## What stays on your device

The extension does **not** intentionally store your browsing history in extension storage for its core lookup flow. Information shown in the popup or sidebar is handled in the browser like normal web UI for that session.

## Third parties and your choices

Ground News and its infrastructure providers handle requests according to **their** terms and privacy practices. If you do not want a URL sent to them, **do not open** the extension’s popup or sidebar on that tab.

## Contact

Questions about **this extension’s behavior**: open an issue on the project repository (see the repo **README** for the canonical GitHub URL).

---

*This file may be updated when the extension’s behavior or permissions change. The version shipped to users is defined in `extension/manifest.json`.*
