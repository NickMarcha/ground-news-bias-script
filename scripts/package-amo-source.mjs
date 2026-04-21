/**
 * Stages extension-related source and zips it for Mozilla AMO "source code" upload.
 * Output: extension/artifacts/ground-news-lookup-firefox-source.zip
 *
 * Uses `archiver` so every ZIP entry name uses forward slashes (AMO rejects `\`).
 * Ships `node-version.txt` instead of `.nvmrc` (some validators reject leading-dot names).
 */
import archiver from "archiver";
import {
  cpSync,
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const folderName = "ground-news-extension-source";
const stagingParent = join(root, "extension", "artifacts", "amo-source-staging");
const staging = join(stagingParent, folderName);
const outDir = join(root, "extension", "artifacts");
const outZip = join(outDir, "ground-news-lookup-firefox-source.zip");

function copyFile(relFromRoot, destRel = relFromRoot) {
  const from = join(root, relFromRoot);
  const to = join(staging, destRel);
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to);
}

function copyDir(relFromRoot, destRel = relFromRoot) {
  const from = join(root, relFromRoot);
  const to = join(staging, destRel);
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
}

function zipDirectoryWithPosixNames(sourceDir, pathPrefixInZip, destZipFile) {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(destZipFile);
    const archive = archiver("zip", { zlib: { level: 9 } });
    output.on("close", resolve);
    output.on("error", reject);
    archive.on("error", reject);
    archive.on("warning", (err) => {
      if (err.code !== "ENOENT") {
        reject(err);
      }
    });
    archive.pipe(output);
    archive.directory(sourceDir, pathPrefixInZip);
    void archive.finalize();
  });
}

rmSync(stagingParent, { recursive: true, force: true });
mkdirSync(staging, { recursive: true });

copyFile("package.json");
copyFile("package-lock.json");
copyFile("tsconfig.json");
copyFile("tsup.extension.config.ts");
copyFile("scripts/build-extension.mjs", "scripts/build-extension.mjs");

copyFile("extension/manifest.json", "extension/manifest.json");
copyDir("extension/src", "extension/src");
copyDir("extension/public", "extension/public");

for (const f of ["types.ts", "lookupCore.ts", "panelHtml.ts"]) {
  copyFile(join("src", f), join("src", f));
}

const nvmrcPath = join(root, ".nvmrc");
if (existsSync(nvmrcPath)) {
  writeFileSync(
    join(staging, "node-version.txt"),
    `${readFileSync(nvmrcPath, "utf8").trim()}\n`,
    "utf8"
  );
}

const reviewReadme = join(root, "docs", "MOZILLA_REVIEW_README.md");
if (!existsSync(reviewReadme)) {
  throw new Error(`Missing ${reviewReadme}`);
}
writeFileSync(
  join(staging, "README.md"),
  readFileSync(reviewReadme, "utf8"),
  "utf8"
);

mkdirSync(outDir, { recursive: true });
rmSync(outZip, { force: true });

await zipDirectoryWithPosixNames(staging, folderName, outZip);

rmSync(stagingParent, { recursive: true, force: true });

// eslint-disable-next-line no-console
console.log(`Wrote ${outZip}`);
