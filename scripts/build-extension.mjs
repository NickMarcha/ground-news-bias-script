import { cpSync, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "extension", "dist");

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

execSync("npx tsup --config tsup.extension.config.ts", {
  cwd: root,
  stdio: "inherit"
});

cpSync(join(root, "extension", "manifest.json"), join(dist, "manifest.json"));
cpSync(join(root, "extension", "public"), dist, { recursive: true });

const popupGlobal = join(dist, "popup.global.js");
const sidebarGlobal = join(dist, "sidebar.global.js");
if (existsSync(popupGlobal)) {
  renameSync(popupGlobal, join(dist, "popup.js"));
}
if (existsSync(sidebarGlobal)) {
  renameSync(sidebarGlobal, join(dist, "sidebar.js"));
}

if (!existsSync(join(dist, "manifest.json"))) {
  throw new Error("extension build failed: manifest missing");
}
