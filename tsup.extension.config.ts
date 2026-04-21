import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    popup: "extension/src/popup.ts",
    sidebar: "extension/src/sidebar.ts"
  },
  outDir: "extension/dist",
  format: ["iife"],
  target: "es2022",
  platform: "browser",
  clean: true,
  minify: true
});
