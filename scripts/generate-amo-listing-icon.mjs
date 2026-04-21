/**
 * Rasterizes extension/public/icons/icon.svg to a 128×128 PNG for AMO listing upload.
 * Output: docs/amo-listing-icon-128.png (dark background so the white glyph is visible on AMO).
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svgPath = join(root, "extension", "public", "icons", "icon.svg");
const outPath = join(root, "docs", "amo-listing-icon-128.png");

const inner = 104;
const iconPng = await sharp(svgPath, { density: 384 })
  .resize(inner, inner, { fit: "contain" })
  .png()
  .toBuffer();

mkdirSync(dirname(outPath), { recursive: true });

await sharp({
  create: {
    width: 128,
    height: 128,
    channels: 4,
    background: { r: 34, g: 34, b: 34, alpha: 1 }
  }
})
  .composite([{ input: iconPng, gravity: "center" }])
  .png()
  .toFile(outPath);

// eslint-disable-next-line no-console
console.log(`Wrote ${outPath}`);
