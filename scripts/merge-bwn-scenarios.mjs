#!/usr/bin/env node
/**
 * Merge BWN scenario book fragments into scenario-book.json.
 *
 * Reads from src/data/blue-water-navy/_fragments/scenarios-*.json.
 * Each fragment may contain:
 *   - "shared" — once, shared notes (e.g. small-scenario OPS track rules)
 *   - "scenarios" — array of ScenarioContent objects
 *
 * Output: src/data/blue-water-navy/scenario-book.json with shape:
 *   {
 *     "shared": {...},
 *     "scenarios": [...]  (sorted by .number)
 *   }
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FRAGMENTS_DIR = join(__dirname, "..", "src", "data", "blue-water-navy", "_fragments");
const OUTPUT = join(__dirname, "..", "src", "data", "blue-water-navy", "scenario-book.json");

const files = readdirSync(FRAGMENTS_DIR)
  .filter((f) => f.startsWith("scenarios-") && f.endsWith(".json"))
  .sort();

console.log(`Found ${files.length} scenario fragment files: ${files.join(", ")}`);

let shared = {};
const scenarios = [];
const seenIds = new Set();

for (const file of files) {
  const path = join(FRAGMENTS_DIR, file);
  const raw = readFileSync(path, "utf8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to parse ${file}: ${err.message}`);
    process.exit(1);
  }

  if (data.shared && typeof data.shared === "object") {
    shared = { ...shared, ...data.shared };
  }
  const arr = data.scenarios ?? (Array.isArray(data) ? data : []);
  for (const s of arr) {
    if (!s.id) {
      console.warn(`  WARN ${file}: scenario without id, skipping`);
      continue;
    }
    if (seenIds.has(s.id)) {
      console.warn(`  WARN duplicate scenario id "${s.id}" — using first occurrence`);
      continue;
    }
    seenIds.add(s.id);
    scenarios.push(s);
  }
  console.log(`  ${file}: shared keys=${Object.keys(data.shared ?? {}).length}, scenarios=${arr.length}`);
}

scenarios.sort((a, b) => (a.number ?? 0) - (b.number ?? 0));

const output = { shared, scenarios };
writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + "\n");

console.log("");
console.log(`Merged: ${scenarios.length} scenarios written to ${OUTPUT}`);
for (const s of scenarios) {
  const sides = s.setup ? `nato=${s.setup.nato?.length ?? 0} sov=${s.setup.soviet?.length ?? 0}` : "no setup";
  console.log(`  #${s.number} ${s.title} (${s.year ?? "?"}) — ${sides}`);
}
