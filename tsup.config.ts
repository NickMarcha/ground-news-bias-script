import { defineConfig } from "tsup";

const userscriptBanner = `// ==UserScript==
// @name         Ground News Lookup (Minimal)
// @namespace    https://github.com/nicol/ground-news-bias-userscript
// @version      0.0.0-dev
// @description  Manual Ground News lookup for current page URL
// @author       Nicol
// @match        http://*/*
// @match        https://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @connect      extension.ground.news
// @connect      production.checkitt.news
// ==/UserScript==`;

export default defineConfig({
  entry: ["src/userscript.ts"],
  format: ["iife"],
  outDir: "dist",
  outExtension: () => ({ js: ".user.js" }),
  clean: true,
  minify: true,
  banner: {
    js: userscriptBanner
  },
  target: "es2022"
});
