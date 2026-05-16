#!/usr/bin/env node
/**
 * Post-process the single-file build to make it truly offline-capable.
 *
 * The Vite singlefile plugin inlines JS and CSS but leaves PNG/JPG/etc.
 * referenced via string paths (e.g. tables.json `"src": "assets/bwn/play-aid-1.png"`).
 * When opened from a `file://` URL or from the downloaded HTML, those paths
 * 404 because there's no server to serve `assets/bwn/...`.
 *
 * This script:
 *   1. Reads `dist-single/index.html`
 *   2. Finds all `"assets/<dir>/<file>.{png,jpg,jpeg,gif,webp,svg}"` references in the bundle
 *   3. For each, reads the source file from `public/assets/<dir>/...`
 *   4. Encodes as base64 and replaces the string with a `data:` URL
 *   5. Writes the result back
 *
 * Result: one self-contained HTML, viewable offline with all images.
 *
 * Usage: node scripts/inline-offline-assets.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const HTML = join(ROOT, "dist-single", "index.html");
const PUBLIC = join(ROOT, "public");

const MIME = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
};

if (!existsSync(HTML)) {
  console.error(`Singlefile build not found at ${HTML}`);
  console.error('Run "npm run build:single" first.');
  process.exit(1);
}

let html = readFileSync(HTML, "utf8");
const originalSize = html.length;

// Match strings inside the bundle like:
//   "assets/bwn/play-aid-1.png"
//   "assets/nw/tec.png"
const assetRefPattern = /"(assets\/[a-z0-9_-]+\/[^"\\]+\.(?:png|jpe?g|gif|webp|svg))"/gi;

const refs = new Set();
let m;
while ((m = assetRefPattern.exec(html))) refs.add(m[1]);

console.log(`Found ${refs.size} asset references to inline:`);

let totalInlinedBytes = 0;
let inlinedCount = 0;
let missingCount = 0;

for (const relPath of refs) {
  const sourcePath = join(PUBLIC, relPath);
  if (!existsSync(sourcePath)) {
    console.warn(`  MISSING  ${relPath} (not at ${sourcePath})`);
    missingCount++;
    continue;
  }

  const ext = relPath.split(".").pop().toLowerCase();
  const mime = MIME[ext];
  if (!mime) {
    console.warn(`  SKIP     ${relPath} (unknown extension)`);
    continue;
  }

  const bytes = readFileSync(sourcePath);
  const base64 = bytes.toString("base64");
  const dataUrl = `data:${mime};base64,${base64}`;

  // Replace ALL occurrences of "relPath" (escaped) in the HTML with the data URL
  const escaped = relPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const replacement = JSON.stringify(dataUrl); // adds surrounding quotes
  const before = html.length;
  html = html.replace(new RegExp(`"${escaped}"`, "g"), () => replacement);
  const after = html.length;

  const delta = after - before;
  totalInlinedBytes += bytes.length;
  inlinedCount++;
  console.log(
    `  inline   ${relPath.padEnd(40)} ${(bytes.length / 1024).toFixed(1).padStart(8)} KB  -> ${(delta / 1024).toFixed(1)} KB grew`,
  );
}

writeFileSync(HTML, html);

const finalSize = html.length;
console.log("");
console.log(`Inlined ${inlinedCount} assets (${(totalInlinedBytes / 1024 / 1024).toFixed(2)} MB raw bytes).`);
if (missingCount > 0) {
  console.log(`WARNING: ${missingCount} referenced assets not found in public/.`);
}
console.log(
  `Singlefile size: ${(originalSize / 1024 / 1024).toFixed(2)} MB -> ${(finalSize / 1024 / 1024).toFixed(2)} MB`,
);
