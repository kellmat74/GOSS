#!/usr/bin/env node
/**
 * Merge BWN rule fragments into rules.json.
 *
 * Reads all rules-N.json files in src/data/blue-water-navy/_fragments/,
 * dedupes by section (last writer wins per section), sorts by section,
 * and writes the merged array to src/data/blue-water-navy/rules.json.
 *
 * Usage: node scripts/merge-bwn-rules.mjs
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FRAGMENTS_DIR = join(__dirname, "..", "src", "data", "blue-water-navy", "_fragments");
const OUTPUT = join(__dirname, "..", "src", "data", "blue-water-navy", "rules.json");

/** Convert a section string ("2.2.1") to a comparable numeric tuple. */
function sectionKey(section) {
  return section
    .split(".")
    .map((s) => {
      // Handle letter suffix like "3a" -> [3, "a"]
      const m = s.match(/^(\d+)([a-z]+)?$/i);
      if (m) return [parseInt(m[1], 10), m[2] ?? ""];
      return [0, s];
    })
    .flat();
}

function compareSection(a, b) {
  const ka = sectionKey(a);
  const kb = sectionKey(b);
  const len = Math.max(ka.length, kb.length);
  for (let i = 0; i < len; i++) {
    const va = ka[i] ?? (typeof ka[i - 1] === "number" ? 0 : "");
    const vb = kb[i] ?? (typeof kb[i - 1] === "number" ? 0 : "");
    if (typeof va === "number" && typeof vb === "number") {
      if (va !== vb) return va - vb;
    } else {
      const sa = String(va);
      const sb = String(vb);
      if (sa !== sb) return sa < sb ? -1 : 1;
    }
  }
  return 0;
}

const fragmentFiles = readdirSync(FRAGMENTS_DIR)
  .filter((f) => f.startsWith("rules-") && f.endsWith(".json"))
  .sort();

console.log(`Found ${fragmentFiles.length} fragment files: ${fragmentFiles.join(", ")}`);

const seen = new Map(); // section -> entry
let totalRead = 0;
let duplicates = 0;

for (const file of fragmentFiles) {
  const path = join(FRAGMENTS_DIR, file);
  const raw = readFileSync(path, "utf8");
  let entries;
  try {
    entries = JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to parse ${file}: ${err.message}`);
    process.exit(1);
  }
  if (!Array.isArray(entries)) {
    console.error(`${file} is not an array`);
    process.exit(1);
  }
  console.log(`  ${file}: ${entries.length} entries`);
  totalRead += entries.length;

  for (const entry of entries) {
    if (!entry.section) {
      console.warn(`  WARN ${file}: entry without section, id=${entry.id}`);
      continue;
    }
    if (seen.has(entry.section)) {
      duplicates++;
      console.warn(`  WARN duplicate section ${entry.section} (id=${entry.id} overwrites previous)`);
    }
    seen.set(entry.section, entry);
  }
}

const merged = Array.from(seen.values()).sort((a, b) => compareSection(a.section, b.section));

writeFileSync(OUTPUT, JSON.stringify(merged, null, 2) + "\n");

console.log(`\nMerged: ${merged.length} unique sections (${totalRead} read, ${duplicates} duplicates resolved)`);
console.log(`Output: ${OUTPUT}`);
