#!/usr/bin/env node
/**
 * Build-time guard: ensure src/data/blue-water-navy/forum-knowledge.json
 * exists before Vite resolves the import. If it's missing (typical in CI
 * since the file is gitignored), copy the committed placeholder over so the
 * build succeeds with an empty forum context.
 *
 * Local development: after running the BGG scrape + curate scripts, this
 * step is a no-op (the real file is present and is left untouched).
 */

import { copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "src", "data", "blue-water-navy");
const TARGET = join(DATA_DIR, "forum-knowledge.json");
const PLACEHOLDER = join(DATA_DIR, "forum-knowledge.placeholder.json");

if (existsSync(TARGET)) {
  console.log(`ensure-forum-knowledge: ${TARGET} already exists, leaving alone`);
  process.exit(0);
}

if (!existsSync(PLACEHOLDER)) {
  console.error(`ensure-forum-knowledge: placeholder missing at ${PLACEHOLDER}`);
  process.exit(1);
}

copyFileSync(PLACEHOLDER, TARGET);
console.log(`ensure-forum-knowledge: copied placeholder -> ${TARGET}`);
